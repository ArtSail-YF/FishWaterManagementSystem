package com.artsail.iot.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("iot_alert_rule")
public class IotAlertRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String ruleName;

    private Long deviceTypeId;

    private String metricKey;

    private String conditionExpr;

    private String severity;

    private Integer isEnabled;

    private String remark;

    /** 通知渠道，逗号分隔：sms,email,system */
    private String notifyChannels;
}
