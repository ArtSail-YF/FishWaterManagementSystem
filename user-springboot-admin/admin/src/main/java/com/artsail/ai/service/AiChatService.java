package com.artsail.ai.service;

import com.artsail.ai.vo.AiChatMessageVO;
import com.artsail.ai.vo.AiChatReplyVO;
import com.artsail.ai.vo.AiChatSessionVO;

import java.util.List;

public interface AiChatService {
    AiChatSessionVO createSession(Long userId);

    List<AiChatSessionVO> listSessions(Long userId);

    List<AiChatMessageVO> listMessages(Long userId, Long sessionId);

    AiChatReplyVO chat(Long userId, Long sessionId, String message, String tool);

    void deleteSession(Long userId, Long sessionId);
}
