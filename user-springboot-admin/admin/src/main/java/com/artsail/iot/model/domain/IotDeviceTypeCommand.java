package com.artsail.iot.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("iot_device_type_command")
public class IotDeviceTypeCommand implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long deviceTypeId;
    private String commandKey;
    private String commandName;
    private String confirmText;
    private Integer isStop;
    private Integer sortOrder;
    private Integer isActive;
}
