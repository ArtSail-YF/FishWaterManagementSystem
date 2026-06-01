package com.artsail.iot.model.domain.query;

import lombok.Data;

@Data
public class IotAlertRuleQuery {
    private String ruleName;
    private Long deviceTypeId;
    private String metricKey;
    private Integer isEnabled;
}
