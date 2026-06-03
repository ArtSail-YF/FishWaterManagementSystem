package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotAlertMapper;
import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.artsail.iot.service.IotAlertService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotAlertServiceImpl extends ServiceImpl<IotAlertMapper, IotAlert> implements IotAlertService {

    private final IotAlertMapper iotAlertMapper;

    @Override
    public Page<IotAlert> search(Page<IotAlert> page, IotAlertQuery query) {
        return iotAlertMapper.searchWithDevice(page, query);
    }

    @Override
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // unprocessed
        long unprocessed = count(new LambdaQueryWrapper<IotAlert>()
                .eq(IotAlert::getStatus, "UNHANDLED"));
        stats.put("unprocessed", unprocessed);

        // new in last hour
        long newInHour = count(new LambdaQueryWrapper<IotAlert>()
                .ge(IotAlert::getTriggerTime, LocalDateTime.now().minusHours(1)));
        stats.put("newInHour", newInHour);

        // processed today
        LocalDateTime todayStart = LocalDateTime.now().with(LocalTime.MIN);
        long processedToday = count(new LambdaQueryWrapper<IotAlert>()
                .eq(IotAlert::getStatus, "HANDLED")
                .ge(IotAlert::getHandleTime, todayStart));
        stats.put("processedToday", processedToday);

        stats.put("avgResponseTime", "--");

        return stats;
    }

    @Override
    public List<IotAlert> getRecentUnhandled(int limit) {
        return iotAlertMapper.selectList(new LambdaQueryWrapper<IotAlert>()
                .eq(IotAlert::getStatus, "UNHANDLED")
                .orderByDesc(IotAlert::getTriggerTime)
                .last("LIMIT " + limit));
    }
}
