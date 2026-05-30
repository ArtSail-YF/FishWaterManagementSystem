package com.artsail.production.model.domain.VO;

import com.artsail.production.model.domain.ProdPlan;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 生产计划 VO — 带关联名称
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ProdPlanVO extends ProdPlan {

    /** 基地名称（关联查询） */
    private String baseName;

    /** 目标名称（关联查询，如塘口名） */
    private String targetName;
}
