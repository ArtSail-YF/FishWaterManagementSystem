package com.artsail.aquaculture.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;
import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 网箱信息实体类
 */
@Data
@TableName("cage_info")
public class Cage extends LogicDeleteEntity {

    private static final long serialVersionUID = 1L;


    /**
     * 网箱编码
     */
    private String cageCode;

    /**
     * 网箱名称
     */
    private String cageName;

    /**
     * 挂靠基地ID(可选)
     */
    private Long baseId;

    /**
     * 归属主体ID
     */
    private Long breederId;

    /**
     * 中心经度
     */
    private BigDecimal longitude;

    /**
     * 中心纬度
     */
    private BigDecimal latitude;

    /**
     * 所在海域名称
     */
    private String seaAreaName;

    /**
     * 该处水深(米)
     */
    private BigDecimal waterDepth;

    /**
     * 类型(重力式/张力腿/升降式)
     */
    private String cageType;

    /**
     * 形状
     */
    private String shape;

    /**
     * 周长(米)
     */
    private BigDecimal perimeter;

    /**
     * 养殖水体(立方米)
     */
    private BigDecimal volume;

    /**
     * 网衣深度(米)
     */
    private BigDecimal netBagDepth;

    /**
     * 材质(HDPE/钢制)
     */
    private String material;

    /**
     * 抗风等级(级)
     */
    private Integer windResistance;

    /**
     * 抗流能力(节)
     */
    private Integer currentResistance;

    /**
     * 状态 1-正常 2-维修 3-闲置
     */
    private Integer status;




}

