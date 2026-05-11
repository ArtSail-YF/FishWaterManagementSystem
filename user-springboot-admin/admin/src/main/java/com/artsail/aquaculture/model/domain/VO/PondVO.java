package com.artsail.aquaculture.model.domain.VO;

import com.artsail.common.enums.PondStatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PondVO {
    
    private Long id;
    private String pondCode;
    private String pondName;
    private Long baseId;
    private String baseName;  // 基地名称（关联查询）
    private BigDecimal area;
    private BigDecimal depthAvg;
    private BigDecimal depthMax;
    private String shapeType;
    private String bottomType;
    private BigDecimal bottomSiltDepth;
    private Integer inletCount;
    private Integer inletDiameter;
    private Integer outletCount;
    private String outletType;
    private String aerationType;
    private Integer aerationCount;
    private BigDecimal aerationPower;
    private Boolean hasCirculating;
    private Boolean hasMonitoring;
    private String currentSpecies;
    private LocalDate stockingDate;
    private BigDecimal estimatedOutput;
    private PondStatusEnum status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;
}
