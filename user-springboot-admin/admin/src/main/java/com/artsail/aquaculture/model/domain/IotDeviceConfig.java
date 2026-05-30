package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * IoT 设备参数配置
 * 对应 iot_device_config 表
 */
@Data
@TableName("iot_device_config")
public class IotDeviceConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 关联设备ID */
    private Long deviceId;

    /** 参数键 */
    private String paramKey;

    /** 参数值 */
    private String paramValue;

    /** 是否激活: 1=激活, 0=停用 */
    private Integer isActive;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;
}
