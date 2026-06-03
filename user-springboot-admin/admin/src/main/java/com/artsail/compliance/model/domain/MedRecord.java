package com.artsail.compliance.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用药记录表 (med_record)
 * 记录药品使用情况，自动计算休药期截止日
 */
@Data
@TableName("med_record")
public class MedRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long baseId;
    private Long pondId;
    private Long drugMatId;
    private BigDecimal usageQty;
    private LocalDate adminDate;
    private Integer withdrawalDays;
    private LocalDate banHarvestUntil;
    private Long logId;
    private LocalDateTime createTime;

    // 非数据库字段
    @TableField(exist = false)
    private String pondName;

    @TableField(exist = false)
    private String pondCode;

    @TableField(exist = false)
    private String medicineName;

    @TableField(exist = false)
    private String manufacturer;
}
