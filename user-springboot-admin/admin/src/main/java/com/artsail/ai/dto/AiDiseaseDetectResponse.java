package com.artsail.ai.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AiDiseaseDetectResponse {
    private Boolean detected;
    private String topLabel;
    private BigDecimal topConfidence;
    private String topConfidencePercent;
    private String riskLevel;
    private String suggestion;
    private List<AiDiseaseDetectionDTO> detections;
    private String annotatedImageBase64;
}
