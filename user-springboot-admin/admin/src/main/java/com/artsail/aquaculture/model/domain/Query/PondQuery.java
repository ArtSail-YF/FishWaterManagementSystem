package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 塘口查询参数
 */
@Data
public class PondQuery {
    
    /**
     * 塘口编码
     */
    private String pondCode;
    
    /**
     * 塘口名称
     */
    private String pondName;
    
    /**
     * 归属基地ID
     */
    private Long baseId;
    
    /**
     * 状态 1-养殖中 2-空闲 0-废弃
     */
    private Integer status;
    
    /**
     * 当前养殖品种
     */
    private String currentSpecies;
    
    /**
     * 最小面积(亩)
     */
    private BigDecimal minArea;
    
    /**
     * 最大面积(亩)
     */
    private BigDecimal maxArea;
}
