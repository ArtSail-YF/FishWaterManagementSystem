package com.artsail.compliance.model.dto;

import lombok.Data;
import java.util.List;

/**
 * 合格证申请请求
 */
@Data
public class CertificateApplyDTO {
    private Long pondId;
    private Long strategyId;
    private List<Long> harvestRecordIds;
    private java.math.BigDecimal quantity;
    private String testReportUrl;
}
