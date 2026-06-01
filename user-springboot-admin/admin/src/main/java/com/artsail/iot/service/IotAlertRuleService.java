package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.query.IotAlertRuleQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IotAlertRuleService extends IService<IotAlertRule> {

    Page<IotAlertRule> search(Page<IotAlertRule> page, IotAlertRuleQuery query);
}
