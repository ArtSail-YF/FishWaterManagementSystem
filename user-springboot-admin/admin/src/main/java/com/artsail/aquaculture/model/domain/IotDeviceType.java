package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * IoT 设备类型
 * 对应 iot_device_type 表
 */
@Data
@TableName("iot_device_type")
public class IotDeviceType implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 类型编码 */
    private String typeCode;

    /** 类型名称 */
    private String typeName;

    /** 制造商 */
    private String manufacturer;

    /** 协议类型: MQTT / CoAP / HTTP */
    private String protocolType;

    /** 描述 */
    private String description;

    /** 状态: 1=启用, 0=停用 */
    private Integer status;
}
