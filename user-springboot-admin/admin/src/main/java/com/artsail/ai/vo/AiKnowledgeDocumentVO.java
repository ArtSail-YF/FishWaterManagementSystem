package com.artsail.ai.vo;

import java.time.LocalDateTime;

public record AiKnowledgeDocumentVO(
        Long id,
        String documentNo,
        String title,
        String category,
        String fileName,
        Integer chunkCount,
        String status,
        LocalDateTime createTime) {
}
