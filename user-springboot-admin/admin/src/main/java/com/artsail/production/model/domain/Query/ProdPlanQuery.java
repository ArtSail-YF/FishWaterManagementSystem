package com.artsail.production.model.domain.Query;

import lombok.Data;

/**
 * 生产计划查询参数
 */
@Data
public class ProdPlanQuery {
    
    /**
     * 基地ID
     */
    private Long baseId;
    
    /**
     * 目标类型: pond, cage, vsl
     */
    private String targetType;
    
    /**
     * 目标ID
     */
    private Long targetId;
    
    /**
     * 计划类型: feeding, medication, harvest, maintenance
     */
    private String planType;
    
    /**
     * 状态: draft, published, active, completed, cancelled
     */
    private String status;
    
    /**
     * 标题关键词
     */
    private String title;
}
