package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotMetricDefMapper;
import com.artsail.iot.model.domain.IotMetricDef;
import com.artsail.iot.service.IotMetricDefService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotMetricDefServiceImpl extends ServiceImpl<IotMetricDefMapper, IotMetricDef> implements IotMetricDefService {

    private final IotMetricDefMapper iotMetricDefMapper;

    @Override
    public List<IotMetricDef> getMetricsByDeviceType(Long deviceTypeId) {
        return iotMetricDefMapper.selectByDeviceTypeId(deviceTypeId);
    }
}
