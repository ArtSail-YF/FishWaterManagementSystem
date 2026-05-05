package com.artsail.production.model.domain.Query;

import lombok.Data;

/**
 * 生产任务查询参数
 */
@Data
public class ProdTaskQuery {
    
    private Long planId;
    private Long baseId;
    private String targetType;
    private Long targetId;
    private String status;
    private Long assigneeId;
}
