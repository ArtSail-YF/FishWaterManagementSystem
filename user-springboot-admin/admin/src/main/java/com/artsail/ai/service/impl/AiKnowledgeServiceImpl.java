package com.artsail.ai.service.impl;

import com.artsail.ai.service.AiKnowledgeService;
import com.artsail.ai.vo.AiKnowledgeDocumentVO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AiKnowledgeServiceImpl implements AiKnowledgeService {
    private static final int CHUNK_SIZE = 800;
    private static final int CHUNK_OVERLAP = 100;

    private final JdbcTemplate jdbcTemplate;

    public AiKnowledgeServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public AiKnowledgeDocumentVO importDocument(String title, String category, MultipartFile file, Long userId)
            throws IOException {
        validateFile(file);
        byte[] bytes = file.getBytes();
        String content = new String(bytes, StandardCharsets.UTF_8).trim();
        if (content.isBlank()) {
            throw new IllegalArgumentException("知识文档内容不能为空");
        }

        String hash = sha256(bytes);
        Integer duplicates = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM ai_knowledge_document WHERE file_hash = ?", Integer.class, hash);
        if (duplicates != null && duplicates > 0) {
            throw new IllegalArgumentException("该知识文档已经导入");
        }

        List<String> chunks = split(content);
        String documentNo = "AI-KB-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        jdbcTemplate.update("""
                INSERT INTO ai_knowledge_document(
                    document_no, title, category, source_type, file_name, file_hash,
                    content_type, chunk_count, status, uploaded_by
                ) VALUES (?, ?, ?, 'FILE', ?, ?, ?, ?, 'READY', ?)
                """, documentNo, title, category.toUpperCase(Locale.ROOT), file.getOriginalFilename(),
                hash, file.getContentType(), chunks.size(), userId);

        Long documentId = jdbcTemplate.queryForObject(
                "SELECT id FROM ai_knowledge_document WHERE document_no = ?", Long.class, documentNo);
        for (int i = 0; i < chunks.size(); i++) {
            jdbcTemplate.update("""
                    INSERT INTO ai_knowledge_chunk(document_id, chunk_index, content, token_count)
                    VALUES (?, ?, ?, ?)
                    """, documentId, i, chunks.get(i), Math.max(1, chunks.get(i).length() / 2));
        }
        return findById(documentId);
    }

    @Override
    public List<AiKnowledgeDocumentVO> listDocuments() {
        return jdbcTemplate.query("""
                SELECT id, document_no, title, category, file_name, chunk_count, status, create_time
                FROM ai_knowledge_document ORDER BY id DESC
                """, (rs, rowNum) -> mapDocument(
                rs.getLong("id"), rs.getString("document_no"), rs.getString("title"),
                rs.getString("category"), rs.getString("file_name"), rs.getInt("chunk_count"),
                rs.getString("status"), rs.getTimestamp("create_time")));
    }

    @Override
    public void deleteDocument(Long id) {
        if (jdbcTemplate.update("DELETE FROM ai_knowledge_document WHERE id = ?", id) == 0) {
            throw new IllegalArgumentException("知识文档不存在");
        }
    }

    private AiKnowledgeDocumentVO findById(Long id) {
        return jdbcTemplate.queryForObject("""
                SELECT id, document_no, title, category, file_name, chunk_count, status, create_time
                FROM ai_knowledge_document WHERE id = ?
                """, (rs, rowNum) -> mapDocument(
                rs.getLong("id"), rs.getString("document_no"), rs.getString("title"),
                rs.getString("category"), rs.getString("file_name"), rs.getInt("chunk_count"),
                rs.getString("status"), rs.getTimestamp("create_time")), id);
    }

    private AiKnowledgeDocumentVO mapDocument(Long id, String no, String title, String category,
                                               String fileName, Integer chunkCount, String status,
                                               Timestamp createTime) {
        LocalDateTime time = createTime == null ? null : createTime.toLocalDateTime();
        return new AiKnowledgeDocumentVO(id, no, title, category, fileName, chunkCount, status, time);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("请选择知识文档");
        }
        String name = file.getOriginalFilename();
        String normalized = name == null ? "" : name.toLowerCase(Locale.ROOT);
        if (!normalized.endsWith(".txt") && !normalized.endsWith(".md")) {
            throw new IllegalArgumentException("当前仅支持 TXT 和 Markdown 文档");
        }
    }

    private List<String> split(String content) {
        List<String> chunks = new ArrayList<>();
        int start = 0;
        while (start < content.length()) {
            int end = Math.min(content.length(), start + CHUNK_SIZE);
            if (end < content.length()) {
                int paragraphEnd = content.lastIndexOf('\n', end);
                if (paragraphEnd > start + CHUNK_SIZE / 2) {
                    end = paragraphEnd;
                }
            }
            chunks.add(content.substring(start, end).trim());
            if (end >= content.length()) {
                break;
            }
            start = Math.max(start + 1, end - CHUNK_OVERLAP);
        }
        return chunks;
    }

    private String sha256(byte[] bytes) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (Exception e) {
            throw new IllegalStateException("无法计算文档摘要", e);
        }
    }
}
