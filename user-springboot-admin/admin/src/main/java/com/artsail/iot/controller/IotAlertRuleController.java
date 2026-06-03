package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.query.IotAlertRuleQuery;
import com.artsail.iot.service.IotAlertRuleService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 告警规则
 */
@RestController
@RequestMapping("/iot/alert-rule")
public class IotAlertRuleController extends BaseController<IotAlertRuleService, IotAlertRule, IotAlertRule, IotAlertRuleQuery> {

    @Autowired
    private IotAlertRuleService iotAlertRuleService;

    @Override
    public Result<Page<IotAlertRule>> search(Page<IotAlertRule> page, IotAlertRuleQuery query) {
        return Result.success(iotAlertRuleService.search(page, query));
    }
}
