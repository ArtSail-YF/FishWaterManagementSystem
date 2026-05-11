package com.artsail.aquaculture.model.domain;

import com.artsail.common.enums.PondStatusEnum;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 塘口实体
 * 对应数据库表 pond_info
 */
@TableName("pond_info")
@Data
@EqualsAndHashCode(callSuper = true)
public class Pond extends BaseEntity {

    /**
     * 塘口编码
     */
    @TableField("pond_code")
    private String pondCode;

    /**
     * 塘口名称
     */
    @TableField("pond_name")
    private String pondName;

    /**
     * 归属基地ID
     */
    @TableField("base_id")
    private Long baseId;

    /**
     * 水面面积(亩)
     */
    @TableField("area")
    private BigDecimal area;

    /**
     * 平均深度(米)
     */
    @TableField("depth_avg")
    private BigDecimal depthAvg;

    /**
     * 最深处(米)
     */
    @TableField("depth_max")
    private BigDecimal depthMax;

    /**
     * 形状(矩形/圆形/不规则)
     */
    @TableField("shape_type")
    private String shapeType;

    /**
     * 底质(泥沙/铺膜/混凝土)
     */
    @TableField("bottom_type")
    private String bottomType;

    /**
     * 淤泥深度(厘米)
     */
    @TableField("bottom_silt_depth")
    private BigDecimal bottomSiltDepth;

    /**
     * 进水口数量
     */
    @TableField("inlet_count")
    private Integer inletCount;

    /**
     * 进水管径(mm)
     */
    @TableField("inlet_diameter")
    private Integer inletDiameter;

    /**
     * 出水口数量
     */
    @TableField("outlet_count")
    private Integer outletCount;

    /**
     * 出水方式(溢流/底排)
     */
    @TableField("outlet_type")
    private String outletType;

    /**
     * 增氧机类型
     */
    @TableField("aeration_type")
    private String aerationType;

    /**
     * 增氧机台数
     */
    @TableField("aeration_count")
    private Integer aerationCount;

    /**
     * 总功率(kw)
     */
    @TableField("aeration_power")
    private BigDecimal aerationPower;

    /**
     * 是否有循环水系统
     */
    @TableField("has_circulating")
    private Boolean hasCirculating;

    /**
     * 是否有视频监控
     */
    @TableField("has_monitoring")
    private Boolean hasMonitoring;

    /**
     * 当前养殖品种
     */
    @TableField("current_species")
    private String currentSpecies;

    /**
     * 最近放苗日期
     */
    @TableField("stocking_date")
    private LocalDate stockingDate;

    /**
     * 预计产量(斤)
     */
    @TableField("estimated_output")
    private BigDecimal estimatedOutput;

    /**
     * 状态：1-养殖中 2-空闲 0-废弃
     */
    @TableField("status")
    private PondStatusEnum status;

    /**
     * 逻辑删除标识：0-未删除，1-已删除
     */
    @TableLogic
    @TableField("is_delete")
    private Boolean isDeleted;

    /**
     * 删除时间
     */
    @TableField("delete_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime deleteTime;
}