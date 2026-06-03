package com.artsail.iot.model.vo;

import lombok.Data;

/**
 * 塘口水质的实时指标 VO（用于 IoT 模块聚合查询）
 */
@Data
public class WaterDataVO {
    private String id;          // 塘口ID
    private String name;        // 塘口名称
    private String baseName;    // 基地名称
    private String status;      // normal / warning / error

    private IndicatorVO oxygen;
    private IndicatorVO temp;
    private IndicatorVO ph;

    @Data
    public static class IndicatorVO {
        private Double value;
        private String trend;   // up / down / stable
    }
}
