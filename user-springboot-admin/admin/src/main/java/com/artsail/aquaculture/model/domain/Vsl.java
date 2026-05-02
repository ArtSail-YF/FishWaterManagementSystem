package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 养殖工船信息实体类
 */
@Data
@TableName("vsl_info")
public class Vsl implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

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
     * 水上移动通信标识码
     */
    private String mmsi;

    /**
     * IMO编号
     */
    private String imoNumber;

    /**
     * 船籍港
     */
    private String registryPort;

    /**
     * 总长(米)
     */
    private BigDecimal lengthOverall;

    /**
     * 型宽(米)
     */
    private BigDecimal width;

    /**
     * 型深(米)
     */
    private BigDecimal depth;

    /**
     * 总吨位
     */
    private Integer grossTonnage;

    /**
     * 载重吨位
     */
    private Integer deadweight;

    /**
     * 养殖水体(立方米)
     */
    private BigDecimal breedingVolume;

    /**
     * 年产能力(吨)
     */
    private BigDecimal productionCapacity;

    /**
     * 主机功率(kw)
     */
    private Integer enginePower;

    /**
     * 航速(节)
     */
    private BigDecimal maxSpeed;

    /**
     * 自持力(天)
     */
    private Integer endurance;

    /**
     * 是否有加工车间
     */
    private Integer hasProcessing;

    /**
     * 是否有冷藏舱
     */
    private Integer hasColdStorage;

    /**
     * 状态 1-在航 2-锚泊 3-维修
     */
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 是否删除: 0-正常, 1-已删除
     */
    @TableLogic
    private Integer isDelete;

    /**
     * 删除时间
     */
    private LocalDateTime deleteTime;
}

