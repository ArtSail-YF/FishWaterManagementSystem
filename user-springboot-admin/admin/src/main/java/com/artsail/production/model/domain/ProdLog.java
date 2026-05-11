package com.artsail.production.model.domain;

import com.artsail.aquaculture.model.domain.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 生产日志实体类
 */
@Data
@TableName("prod_log")
@EqualsAndHashCode(callSuper = true)
public class ProdLog extends BaseEntity {

    private Long taskId;
    private Long planId;
    private Long baseId;
    private String targetType;
    private Long targetId;
    private String logType;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime actionTime;
    private BigDecimal quantity;
    private String photoUrls;
    private BigDecimal gpsLat;
    private BigDecimal gpsLng;
    private String source;
    private Long createdBy;
    private Long actualWorkerId;
    private Boolean isBackfilled;
    private String backfillReason;
    private String verifyStatus;
}
