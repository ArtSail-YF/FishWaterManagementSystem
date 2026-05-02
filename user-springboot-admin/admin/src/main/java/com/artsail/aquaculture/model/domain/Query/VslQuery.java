package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

/**
 * 工船查询参数
 */
@Data
public class VslQuery {
    
    /**
     * 船舶编号
     */
    private String vslCode;
    
    /**
     * 船名
     */
    private String vslName;
    
    /**
     * 归属主体ID
     */
    private Long breederId;
    
    /**
     * MMSI
     */
    private String mmsi;
    
    /**
     * 船籍港
     */
    private String registryPort;
    
    /**
     * 状态 1-在航 2-锚泊 3-维修
     */
    private Integer status;
}
