package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

/**
 * 养殖户查询参数
 */
@Data
public class BreederQuery {
    
    /**
     * 主体编码
     */
    private String breederCode;
    
    /**
     * 主体名称
     */
    private String breederName;
    
    /**
     * 法人代表
     */
    private String legalPerson;
    
    /**
     * 联系电话
     */
    private String phone;
    
    /**
     * 状态 1-正常 0-停用
     */
    private Integer status;
}
