package com.artsail.iot.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("iot_device_type")
public class IotDeviceType implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String typeCode;

    private String typeName;

    private String manufacturer;

    private String protocolType;

    private String description;

    private Integer status;
}
