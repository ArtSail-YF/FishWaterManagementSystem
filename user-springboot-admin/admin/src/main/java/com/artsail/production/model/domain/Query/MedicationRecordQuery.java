package com.artsail.production.model.domain.Query;

import lombok.Data;

import java.time.LocalDate;

/**
 * 用药记录查询条件
 */
@Data
public class MedicationRecordQuery {

    /**
     * 基地ID
     */
    private Long baseId;

    /**
     * 塘口ID
     */
    private Long pondId;

    /**
     * 药品物资ID
     */
    private Long drugMatId;

    /**
     * 药品名称（模糊搜索，关联 mat_info）
     */
    private String medicineName;

    /**
     * 施药开始日期
     */
    private LocalDate startTime;

    /**
     * 施药结束日期
     */
    private LocalDate endTime;

    /**
     * 关联的生产日志ID
     */
    private Long logId;
}
