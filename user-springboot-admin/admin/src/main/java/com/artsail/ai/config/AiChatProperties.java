package com.artsail.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "ai.chat")
public class AiChatProperties {
    private String apiKey;
    private String baseUrl;
    private String modelName;
    private Double temperature = 0.3;
    private Integer timeoutSeconds = 60;
}
