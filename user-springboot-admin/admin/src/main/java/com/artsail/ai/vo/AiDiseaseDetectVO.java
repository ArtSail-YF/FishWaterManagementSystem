package com.artsail.ai.vo;

import com.artsail.ai.dto.AiDiseaseDetectionDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AiDiseaseDetectVO {
    private String recordNo;
    private String originalImageUrl;
    private String annotatedImageUrl;
    private Boolean detected;
    private String topDisease;
    private BigDecimal confidence;
    private String confidencePercent;
    private String riskLevel;
    private String suggestion;
    private List<AiDiseaseDetectionDTO> detections;
}
