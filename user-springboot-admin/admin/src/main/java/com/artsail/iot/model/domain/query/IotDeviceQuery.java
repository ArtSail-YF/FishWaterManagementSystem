package com.artsail.iot.model.domain.query;

import lombok.Data;

@Data
public class IotDeviceQuery {
    private String deviceSn;
    private String deviceName;
    private Long typeId;
    private Long baseId;
    private Long pondId;
    private Integer status;
}
