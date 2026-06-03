package com.artsail.compliance.model.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * 用药记录查询参数
 */
@Data
public class MedRecordQuery {
    private Long baseId;
    private Long pondId;
    private Long drugMatId;
    private String medicineName;
    private LocalDate startTime;
    private LocalDate endTime;
    private Long logId;
}
