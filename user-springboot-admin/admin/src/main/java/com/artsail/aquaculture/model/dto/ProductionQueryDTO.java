package com.artsail.aquaculture.model.dto;

import lombok.Data;

/**
 * 生产载体统一查询 DTO
 */
@Data
public class ProductionQueryDTO {
    
    /**
     * 关键词搜索
     */
    private String keyword;
    
    /**
     * 归属主体ID
     */
    private Long breederId;
    
    /**
     * 基地ID
     */
    private Long baseId;
    
    /**
     * 状态
     */
    private Integer status;
}
