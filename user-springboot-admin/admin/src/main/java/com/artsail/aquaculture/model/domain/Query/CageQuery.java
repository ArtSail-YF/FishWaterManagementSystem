package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

/**
 * 网箱查询参数
 */
@Data
public class CageQuery {
    
    /**
     * 网箱编码
     */
    private String cageCode;
    
    /**
     * 网箱名称
     */
    private String cageName;
    
    /**
     * 挂靠基地ID
     */
    private Long baseId;
    
    /**
     * 归属主体ID
     */
    private Long breederId;
    
    /**
     * 所在海域名称
     */
    private String seaAreaName;
    
    /**
     * 状态 1-正常 2-维修 3-闲置
     */
    private Integer status;
    
    /**
     * 类型(重力式/张力腿/升降式)
     */
    private String cageType;
}
