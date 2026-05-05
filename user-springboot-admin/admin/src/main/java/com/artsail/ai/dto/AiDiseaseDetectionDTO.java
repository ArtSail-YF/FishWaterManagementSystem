package com.artsail.ai.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AiDiseaseDetectionDTO {
    private String label;
    private BigDecimal confidence;
    private String confidencePercent;
    private List<BigDecimal> bbox;
    private String riskLevel;
    private String suggestion;
}
