package com.artsail.production.model.domain.Query;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 物资使用记录查询条件
 */
@Data
public class StkUsageQuery {

    /**
     * 基地ID
     */
    private Long baseId;

    /**
     * 塘口ID
     */
    private Long pondId;

    /**
     * 物资ID
     */
    private Long matId;

    /**
     * 物资名称（模糊查询）
     */
    private String matName;

    /**
     * 物资分类ID
     */
    private Long categoryId;

    /**
     * 使用开始时间
     */
    private LocalDateTime startTime;

    /**
     * 使用结束时间
     */
    private LocalDateTime endTime;

    /**
     * 任务ID
     */
    private Long taskId;

    /**
     * 操作人ID
     */
    private Long operatorId;
}
