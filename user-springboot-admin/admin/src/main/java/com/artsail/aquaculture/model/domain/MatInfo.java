package com.artsail.aquaculture.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@TableName("mat_info")
@EqualsAndHashCode(callSuper = true)
public class MatInfo extends LogicDeleteEntity {

    private String matCode;
    private String matName;
    private Long catId;
    private String spec;
    private String unit;
    private Long supplierId;
    private BigDecimal minStock;
    private BigDecimal maxStock;
    private Integer status;

    // 新增字段
    private Integer withdrawalDays;  // 休药期（天）
    private BigDecimal unitPrice;    // 参考单价
    private String approvalCode;     // 批准文号
    private String manufacturer;     // 生产厂家
}
