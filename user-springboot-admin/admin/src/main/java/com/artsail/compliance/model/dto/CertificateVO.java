package com.artsail.compliance.model.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 合格证完整信息（含明细和策略名称）
 */
@Data
public class CertificateVO {
    private Long id;
    private String certNo;
    private Long strategyId;
    private String strategyName;
    private String specType;
    private LocalDate issueDate;
    private String status;
    private List<CertDetailVO> details;

    @Data
    public static class CertDetailVO {
        private Long id;
        private String targetType;
        private Long targetId;
        private String targetName;
        private java.math.BigDecimal quantity;
        private boolean withdrawalPassed;
        private boolean testPassed;
        private String testReportUrl;
    }
}
