package com.artsail.iot.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("iot_device")
public class IotDevice implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String deviceSn;

    private String deviceName;

    private Long typeId;

    private Long baseId;

    private Long pondId;

    private String ipAddress;

    private Integer port;

    private String authInfo;

    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime lastHeartbeat;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime installTime;

    private String remark;

    @TableField(exist = false)
    private String typeName;

    @TableField(exist = false)
    private String typeCode;

    @TableField(exist = false)
    private String baseName;

    @TableField(exist = false)
    private String pondName;

    @TableField(exist = false)
    private String statusText;

    public String getStatusText() {
        if (status == null) return "未知";
        switch (status) {
            case 1: return "在线";
            case 0: return "离线";
            case 2: return "维护中";
            default: return "未知";
        }
    }
}
