package com.artsail.aquaculture.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * IoT 设备
 * 对应 iot_device 表（无逻辑删除，无 create_time/update_time 自动填充）
 */
@Data
@TableName("iot_device")
public class IotDevice implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 设备唯一序列号 */
    private String deviceSn;

    /** 设备名称 */
    private String deviceName;

    /** 设备类型ID（关联 iot_device_type.id） */
    private Long typeId;

    /** 所属基地ID */
    private Long baseId;

    /** 关联塘口ID（可选） */
    private Long pondId;

    /** IP 地址 */
    private String ipAddress;

    /** 端口 */
    private Integer port;

    /** 认证信息（JSON） */
    private String authInfo;

    /** 状态: 1=在线, 0=离线, 2=维护中 */
    private Integer status;

    /** 最后心跳时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime lastHeartbeat;

    /** 安装时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime installTime;

    /** 备注 */
    private String remark;

    // ====== 非数据库字段 ======

    /** 设备类型名称（联表查询填充） */
    @TableField(exist = false)
    private String typeName;

    /** 设备类型编码（联表查询填充） */
    @TableField(exist = false)
    private String typeCode;

    /** 基地名称（联表查询填充） */
    @TableField(exist = false)
    private String baseName;

    /** 塘口名称（联表查询填充） */
    @TableField(exist = false)
    private String pondName;

    /** 状态文本（转换用） */
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
