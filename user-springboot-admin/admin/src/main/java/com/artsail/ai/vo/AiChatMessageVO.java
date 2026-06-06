package com.artsail.ai.vo;

import com.artsail.ai.dto.AiChatSource;
import com.artsail.ai.dto.AiToolCall;

import java.time.LocalDateTime;
import java.util.List;

public record AiChatMessageVO(
        Long id,
        String role,
        String content,
        List<AiChatSource> sources,
        List<AiToolCall> tools,
        String riskLevel,
        String riskNotice,
        LocalDateTime createTime) {
}
