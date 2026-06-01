package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotDeviceMaintenance;
import com.artsail.iot.model.domain.query.IotDeviceMaintenanceQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IotDeviceMaintenanceService extends IService<IotDeviceMaintenance> {

    Page<IotDeviceMaintenance> search(Page<IotDeviceMaintenance> page, IotDeviceMaintenanceQuery query);
}
