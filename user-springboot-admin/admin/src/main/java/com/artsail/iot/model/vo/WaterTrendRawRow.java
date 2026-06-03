package com.artsail.iot.model.vo;

import lombok.Data;

/**
 * 水质趋势查询原始行（一个时间点的一个指标一条）
 */
@Data
public class WaterTrendRawRow {
    private String recordTime;
    private String metricKey;
    private Double metricValue;
}
