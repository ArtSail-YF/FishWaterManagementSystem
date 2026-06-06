package com.artsail.ai.vo;

import com.artsail.ai.dto.AiChatSource;
import com.artsail.ai.dto.AiToolCall;

import java.util.List;

public record AiChatReplyVO(
        Long sessionId,
        String answer,
        List<AiChatSource> sources,
        List<AiToolCall> tools,
        String riskLevel,
        String riskNotice) {
}
