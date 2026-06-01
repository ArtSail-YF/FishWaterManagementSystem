package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotDeviceMaintenanceMapper;
import com.artsail.iot.model.domain.IotDeviceMaintenance;
import com.artsail.iot.model.domain.query.IotDeviceMaintenanceQuery;
import com.artsail.iot.service.IotDeviceMaintenanceService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceMaintenanceServiceImpl extends ServiceImpl<IotDeviceMaintenanceMapper, IotDeviceMaintenance> implements IotDeviceMaintenanceService {

    private final IotDeviceMaintenanceMapper iotDeviceMaintenanceMapper;

    @Override
    public Page<IotDeviceMaintenance> search(Page<IotDeviceMaintenance> page, IotDeviceMaintenanceQuery query) {
        return iotDeviceMaintenanceMapper.searchWithDevice(page, query);
    }
}
