package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotAlertRuleMapper;
import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.query.IotAlertRuleQuery;
import com.artsail.iot.service.IotAlertRuleService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotAlertRuleServiceImpl extends ServiceImpl<IotAlertRuleMapper, IotAlertRule> implements IotAlertRuleService {

    @Override
    public Page<IotAlertRule> search(Page<IotAlertRule> page, IotAlertRuleQuery query) {
        LambdaQueryWrapper<IotAlertRule> wrapper = new LambdaQueryWrapper<>();
        if (query == null) {
            return this.page(page, wrapper.orderByDesc(IotAlertRule::getId));
        }
        if (StringUtils.hasText(query.getRuleName())) {
            wrapper.like(IotAlertRule::getRuleName, query.getRuleName());
        }
        if (query.getDeviceTypeId() != null) {
            wrapper.eq(IotAlertRule::getDeviceTypeId, query.getDeviceTypeId());
        }
        if (StringUtils.hasText(query.getMetricKey())) {
            wrapper.eq(IotAlertRule::getMetricKey, query.getMetricKey());
        }
        if (query.getIsEnabled() != null) {
            wrapper.eq(IotAlertRule::getIsEnabled, query.getIsEnabled());
        }
        wrapper.orderByDesc(IotAlertRule::getId);
        return this.page(page, wrapper);
    }
}
