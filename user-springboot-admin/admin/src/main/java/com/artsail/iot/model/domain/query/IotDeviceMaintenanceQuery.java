package com.artsail.iot.model.domain.query;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class IotDeviceMaintenanceQuery {
    private Long deviceId;
    private String maintType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
