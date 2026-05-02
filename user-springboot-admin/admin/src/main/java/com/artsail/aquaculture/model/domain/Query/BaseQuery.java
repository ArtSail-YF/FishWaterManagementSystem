package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

/**
 * 基地查询参数
 */
@Data
public class BaseQuery {
    
    /**
     * 基地编码
     */
    private String baseCode;
    
    /**
     * 基地名称
     */
    private String baseName;
    
    /**
     * 归属主体ID
     */
    private Long breederId;
    
    /**
     * 部门ID
     */
    private Long deptId;
    
    /**
     * 状态 1-正常 0-停用
     */
    private Integer status;
    
    /**
     * 地址关键词
     */
    private String address;
}
