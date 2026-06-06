package com.artsail.ai.service;

import com.artsail.ai.dto.AiToolCall;

import java.util.List;

public interface AiBusinessToolService {

    ToolResult query(String question, String requestedTool);

    record ToolResult(String context, List<AiToolCall> calls) {
        public static ToolResult empty() {
            return new ToolResult("未调用业务数据查询工具。", List.of());
        }
    }
}
