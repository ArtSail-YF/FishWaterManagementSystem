package com.artsail.production.model.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存流水记录实体类
 */
@Data
@TableName("stk_record")
public class StkRecord {

    private Long id;
    private String recordNo;
    private Long baseId;
    private Long matId;
    private String batchNo;
    private String type;
    private BigDecimal changeQty;
    private Long operatorId;
    private String remark;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;
}
