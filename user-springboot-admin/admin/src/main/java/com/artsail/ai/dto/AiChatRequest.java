package com.artsail.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiChatRequest {
    @NotBlank(message = "问题不能为空")
    @Size(max = 4000, message = "问题不能超过4000个字符")
    private String message;

    @Size(max = 40, message = "工具标识不能超过40个字符")
    private String tool;
}
