package com.artsail.production.model.domain;

import com.artsail.aquaculture.model.domain.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存流水记录实体类
 */
@Data
@TableName("stk_record")
@EqualsAndHashCode(callSuper = true)
public class StkRecord extends BaseEntity {

    private String recordNo;
    private Long baseId;
    private Long matId;
    private String batchNo;
    private String type;
    private BigDecimal changeQty;
    private Long operatorId;
    private String remark;
    private LocalDateTime createTime;
}
