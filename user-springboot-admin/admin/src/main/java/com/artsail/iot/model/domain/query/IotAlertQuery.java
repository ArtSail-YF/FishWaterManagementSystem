package com.artsail.iot.model.domain.query;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class IotAlertQuery {
    private String alertNo;
    private Long deviceId;
    private String alertType;
    private String status;
    private String severity;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
