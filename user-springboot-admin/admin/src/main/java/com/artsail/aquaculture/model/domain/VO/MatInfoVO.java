package com.artsail.aquaculture.model.domain.VO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MatInfoVO {
    
    private Long id;
    private String matCode;
    private String matName;
    private Long catId;
    private String catName;  // 分类名称（关联查询）
    private String spec;
    private String unit;
    private Long supplierId;
    private String supplierName;  // 供应商名称（关联查询）
    private BigDecimal minStock;
    private BigDecimal maxStock;
    private Integer status;
    private Integer withdrawalDays;
    private BigDecimal unitPrice;
    private String approvalCode;
    private String manufacturer;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
