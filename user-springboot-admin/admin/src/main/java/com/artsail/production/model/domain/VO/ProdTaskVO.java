package com.artsail.production.model.domain.VO;

import com.artsail.production.model.domain.ProdTask;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 生产任务 VO — 带关联名称
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ProdTaskVO extends ProdTask {

    /** 基地名称（关联查询） */
    private String baseName;

    /** 目标名称（关联查询，如塘口名） */
    private String targetName;

    /** 计划详细描述（关联查询） */
    private String contentDesc;

    /** 优先级文字 */
    private String priorityLabel;

    /** 饲料品种 */
    private String feedVariety;
    /** 计划投喂量 */
    private java.math.BigDecimal feedAmount;
    /** 药品名称 */
    private String drugName;
    /** 用量 */
    private String dosage;
    /** 休药期天数 */
    private Integer withdrawalDays;
    /** 气象要求 */
    private String weatherReq;
    /** 预计产量 */
    private java.math.BigDecimal estYield;
}
