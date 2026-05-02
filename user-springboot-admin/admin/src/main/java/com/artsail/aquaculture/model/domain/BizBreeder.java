package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 养殖户/主体信息
 */
@TableName("biz_breeder")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BizBreeder extends BaseEntity {
    
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
     * 电子邮箱
     */
    private String email;
    
    /**
     * 法人身份证号
     */
    private String idCard;
    
    /**
     * 营业执照路径
     */
    private String businessLicense;
    
    /**
     * 统一社会信用代码
     */
    private String licenseNo;
    
    /**
     * 注册资本(万元)
     */
    private BigDecimal regCapital;
    
    /**
     * 成立日期
     */
    private LocalDate establishDate;
    
    /**
     * 省份
     */
    private String province;
    
    /**
     * 城市
     */
    private String city;
    
    /**
     * 区县
     */
    private String county;
    
    /**
     * 详细注册地址
     */
    private String address;
    
    /**
     * 中心经度
     */
    private BigDecimal longitude;
    
    /**
     * 中心纬度
     */
    private BigDecimal latitude;
    
    /**
     * 状态 1-正常 0-停用
     */
    private Integer status;
}
