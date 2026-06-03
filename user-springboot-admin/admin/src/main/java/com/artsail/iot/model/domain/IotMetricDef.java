package com.artsail.iot.model.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("iot_metric_def")
public class IotMetricDef implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId
    private String metricKey;

    private String displayName;

    private String unit;

    private Long deviceTypeId;

    private Integer isActive;
}
