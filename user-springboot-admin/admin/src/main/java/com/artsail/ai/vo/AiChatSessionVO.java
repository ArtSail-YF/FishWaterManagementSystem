package com.artsail.ai.vo;

import java.time.LocalDateTime;

public record AiChatSessionVO(
        Long id,
        String sessionNo,
        String title,
        String modelName,
        Integer messageCount,
        LocalDateTime lastMessageAt,
        LocalDateTime createTime) {
}
