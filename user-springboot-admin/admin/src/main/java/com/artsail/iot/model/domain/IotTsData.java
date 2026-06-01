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
@TableName("iot_ts_data")
public class IotTsData implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long deviceId;

    private String metricKey;

    private Double metricValue;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime recordTime;

    private Integer qualityFlag;

    private String sourceType;

    private Long operatorId;

    @TableField(exist = false)
    private String deviceSn;

    @TableField(exist = false)
    private String deviceName;

    @TableField(exist = false)
    private String typeName;
}
