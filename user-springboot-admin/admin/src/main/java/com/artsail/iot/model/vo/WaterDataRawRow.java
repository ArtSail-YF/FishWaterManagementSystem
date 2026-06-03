package com.artsail.iot.model.vo;

import lombok.Data;

/**
 * 水质数据查询原始行（一个塘口的一个指标一条）
 */
@Data
public class WaterDataRawRow {
    private Long pondId;
    private String pondName;
    private String baseName;
    private Integer pondStatus;
    private String metricKey;
    private Double metricValue;
    private String recordTime;
}
