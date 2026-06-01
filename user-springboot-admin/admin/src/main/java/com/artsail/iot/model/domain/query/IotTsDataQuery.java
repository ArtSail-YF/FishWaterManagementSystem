package com.artsail.iot.model.domain.query;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class IotTsDataQuery {
    private Long deviceId;
    private String deviceSn;
    private String metricKey;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String sourceType;
    private Integer qualityFlag;
}
