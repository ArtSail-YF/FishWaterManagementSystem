package com.artsail.iot.model.vo;

import lombok.Data;

/**
 * 水质趋势数据 VO
 */
@Data
public class WaterTrendVO {
    private String timestamp;
    private Double dissolvedOxygen;
    private Double waterTemperature;
    private Double pH;
}
