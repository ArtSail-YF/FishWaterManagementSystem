package com.artsail.ai.service.impl;

import com.artsail.ai.config.AiChatProperties;
import com.artsail.ai.dto.AiChatSource;
import com.artsail.ai.dto.AiToolCall;
import com.artsail.ai.service.AiBusinessToolService;
import com.artsail.ai.service.AiChatService;
import com.artsail.ai.vo.AiChatMessageVO;
import com.artsail.ai.vo.AiChatReplyVO;
import com.artsail.ai.vo.AiChatSessionVO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.model.chat.ChatModel;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AiChatServiceImpl implements AiChatService {
    private static final String RISK_NOTICE = "回答仅供养殖管理辅助参考；涉及病害诊断和用药时，请由水产技术人员或执业兽医复核。";
    private static final List<String> RISK_WORDS = List.of("病", "药", "剂量", "治疗", "消毒", "抗生素", "死亡");

    private final JdbcTemplate jdbcTemplate;
    private final ObjectProvider<ChatModel> chatModelProvider;
    private final AiChatProperties properties;
    private final ObjectMapper objectMapper;
    private final AiBusinessToolService businessToolService;

    public AiChatServiceImpl(JdbcTemplate jdbcTemplate, ObjectProvider<ChatModel> chatModelProvider,
                             AiChatProperties properties, ObjectMapper objectMapper,
                             AiBusinessToolService businessToolService) {
        this.jdbcTemplate = jdbcTemplate;
        this.chatModelProvider = chatModelProvider;
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.businessToolService = businessToolService;
    }

    @Override
    @Transactional
    public AiChatSessionVO createSession(Long userId) {
        String sessionNo = "AI-CHAT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        jdbcTemplate.update("""
                INSERT INTO ai_chat_session(session_no, user_id, title, model_name)
                VALUES (?, ?, '新对话', ?)
                """, sessionNo, userId, properties.getModelName());
        Long id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        return getSession(userId, id);
    }

    @Override
    public List<AiChatSessionVO> listSessions(Long userId) {
        return jdbcTemplate.query("""
                SELECT id, session_no, title, model_name, message_count, last_message_at, create_time
                FROM ai_chat_session
                WHERE user_id = ? AND status = 'ACTIVE'
                ORDER BY COALESCE(last_message_at, create_time) DESC
                """, (rs, rowNum) -> new AiChatSessionVO(
                rs.getLong("id"), rs.getString("session_no"), rs.getString("title"),
                rs.getString("model_name"), rs.getInt("message_count"),
                toLocalDateTime(rs.getTimestamp("last_message_at")),
                toLocalDateTime(rs.getTimestamp("create_time"))), userId);
    }

    @Override
    public List<AiChatMessageVO> listMessages(Long userId, Long sessionId) {
        requireSession(userId, sessionId);
        return jdbcTemplate.query("""
                SELECT id, role, content, sources_json, tool_calls_json, risk_level, risk_notice, create_time
                FROM ai_chat_message WHERE session_id = ? ORDER BY id
                """, (rs, rowNum) -> new AiChatMessageVO(
                rs.getLong("id"), rs.getString("role"), rs.getString("content"),
                readSources(rs.getString("sources_json")), readTools(rs.getString("tool_calls_json")),
                rs.getString("risk_level"),
                rs.getString("risk_notice"), toLocalDateTime(rs.getTimestamp("create_time"))), sessionId);
    }

    @Override
    @Transactional
    public AiChatReplyVO chat(Long userId, Long sessionId, String message, String tool) {
        requireConfigured();
        requireSession(userId, sessionId);
        List<AiChatSource> sources = searchKnowledge(message);
        AiBusinessToolService.ToolResult toolResult = businessToolService.query(message, tool);
        List<AiChatMessageVO> history = recentMessages(sessionId);
        boolean risky = isRisky(message);
        long startedAt = System.currentTimeMillis();

        jdbcTemplate.update("""
                INSERT INTO ai_chat_message(session_id, role, content, risk_level)
                VALUES (?, 'USER', ?, ?)
                """, sessionId, message, risky ? "NOTICE" : "NONE");

        String answer;
        try {
            answer = chatModelProvider.getObject().chat(buildPrompt(history, sources, toolResult.context(), message));
        } catch (Exception e) {
            jdbcTemplate.update("""
                    INSERT INTO ai_chat_message(session_id, role, content, model_name, status, error_message)
                    VALUES (?, 'ASSISTANT', ?, ?, 'FAILED', ?)
                    """, sessionId, "AI 服务暂时不可用，请稍后重试。", properties.getModelName(), limit(e.getMessage(), 1000));
            throw new IllegalStateException("DeepSeek调用失败：" + e.getMessage(), e);
        }

        String sourceJson = writeSources(sources);
        String toolJson = writeTools(toolResult.calls());
        jdbcTemplate.update("""
                INSERT INTO ai_chat_message(
                    session_id, role, content, model_name, sources_json, tool_calls_json,
                    risk_level, risk_notice, latency_ms
                ) VALUES (?, 'ASSISTANT', ?, ?, ?, ?, ?, ?, ?)
                """, sessionId, answer, properties.getModelName(), sourceJson, toolJson,
                risky ? "NOTICE" : "NONE", risky ? RISK_NOTICE : null,
                (int) (System.currentTimeMillis() - startedAt));

        String title = message.length() > 30 ? message.substring(0, 30) + "..." : message;
        jdbcTemplate.update("""
                UPDATE ai_chat_session
                SET title = IF(message_count = 0, ?, title),
                    message_count = message_count + 2,
                    last_message_at = NOW()
                WHERE id = ?
                """, title, sessionId);
        return new AiChatReplyVO(sessionId, answer, sources, toolResult.calls(), risky ? "NOTICE" : "NONE",
                risky ? RISK_NOTICE : null);
    }

    @Override
    public void deleteSession(Long userId, Long sessionId) {
        int changed = jdbcTemplate.update("""
                UPDATE ai_chat_session SET status = 'DELETED' WHERE id = ? AND user_id = ? AND status = 'ACTIVE'
                """, sessionId, userId);
        if (changed == 0) {
            throw new IllegalArgumentException("会话不存在");
        }
    }

    private AiChatSessionVO getSession(Long userId, Long id) {
        return jdbcTemplate.queryForObject("""
                SELECT id, session_no, title, model_name, message_count, last_message_at, create_time
                FROM ai_chat_session WHERE id = ? AND user_id = ?
                """, (rs, rowNum) -> new AiChatSessionVO(
                rs.getLong("id"), rs.getString("session_no"), rs.getString("title"),
                rs.getString("model_name"), rs.getInt("message_count"),
                toLocalDateTime(rs.getTimestamp("last_message_at")),
                toLocalDateTime(rs.getTimestamp("create_time"))), id, userId);
    }

    private void requireSession(Long userId, Long sessionId) {
        Integer count = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM ai_chat_session WHERE id = ? AND user_id = ? AND status = 'ACTIVE'
                """, Integer.class, sessionId, userId);
        if (count == null || count == 0) {
            throw new IllegalArgumentException("会话不存在");
        }
    }

    private void requireConfigured() {
        if (properties.getApiKey() == null || properties.getApiKey().isBlank()) {
            throw new IllegalStateException("未配置 DEEPSEEK_API_KEY");
        }
    }

    private List<AiChatMessageVO> recentMessages(Long sessionId) {
        List<AiChatMessageVO> messages = jdbcTemplate.query("""
                SELECT id, role, content, sources_json, tool_calls_json, risk_level, risk_notice, create_time
                FROM ai_chat_message WHERE session_id = ? ORDER BY id DESC LIMIT 10
                """, (rs, rowNum) -> new AiChatMessageVO(
                rs.getLong("id"), rs.getString("role"), rs.getString("content"),
                List.of(), List.of(), rs.getString("risk_level"), rs.getString("risk_notice"),
                toLocalDateTime(rs.getTimestamp("create_time"))), sessionId);
        java.util.Collections.reverse(messages);
        return messages;
    }

    private List<AiChatSource> searchKnowledge(String question) {
        List<String> terms = Arrays.stream(question.split("[\\s，。！？、；：,.!?;:]+"))
                .map(String::trim).filter(term -> term.length() >= 2).distinct().limit(5).toList();
        if (terms.isEmpty()) {
            return List.of();
        }
        String conditions = terms.stream().map(term -> "c.content LIKE ?").collect(Collectors.joining(" OR "));
        List<Object> args = terms.stream().map(term -> "%" + term + "%").collect(Collectors.toCollection(ArrayList::new));
        return jdbcTemplate.query("""
                SELECT d.id, d.title, d.category, c.content
                FROM ai_knowledge_chunk c
                JOIN ai_knowledge_document d ON d.id = c.document_id
                WHERE d.status = 'READY' AND (%s)
                ORDER BY c.id DESC LIMIT 5
                """.formatted(conditions), (rs, rowNum) -> new AiChatSource(
                rs.getLong("id"), rs.getString("title"), rs.getString("category"),
                limit(rs.getString("content"), 240)), args.toArray());
    }

    private String buildPrompt(List<AiChatMessageVO> history, List<AiChatSource> sources,
                               String businessContext, String question) {
        String historyText = history.stream()
                .map(item -> item.role() + ": " + item.content())
                .collect(Collectors.joining("\n"));
        String knowledgeText = sources.isEmpty() ? "没有检索到本地资料。"
                : sources.stream().map(source -> "[%s] %s".formatted(source.title(), source.excerpt()))
                .collect(Collectors.joining("\n"));
        return """
                你是水产养殖管理系统中的智能助手。请使用中文，回答准确、简洁、可执行。
                你可以回答养殖技术、病害常识、政策法规和系统操作问题。
                不得虚构本地资料来源；资料不足时要明确说明。
                涉及病害和用药时只能提供辅助建议，必须提醒用户现场复核，不能给出保证性诊断。
                “实时业务数据”来自系统白名单只读查询，回答生产情况时必须优先以该数据为准。
                如果实时业务数据为空或查询失败，要如实说明，不得自行补造记录。

                本地知识：
                %s

                实时业务数据：
                %s

                最近对话：
                %s

                用户问题：
                %s
                """.formatted(knowledgeText, businessContext,
                historyText.isBlank() ? "无" : historyText, question);
    }

    private boolean isRisky(String text) {
        String normalized = text.toLowerCase(Locale.ROOT);
        return RISK_WORDS.stream().anyMatch(normalized::contains);
    }

    private String writeSources(List<AiChatSource> sources) {
        try {
            return objectMapper.writeValueAsString(sources);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<AiChatSource> readSources(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private String writeTools(List<AiToolCall> tools) {
        try {
            return objectMapper.writeValueAsString(tools);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<AiToolCall> readTools(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private static String limit(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
