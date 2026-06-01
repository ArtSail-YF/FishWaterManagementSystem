package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceMaintenance;
import com.artsail.iot.model.domain.query.IotDeviceMaintenanceQuery;
import com.artsail.iot.service.IotDeviceMaintenanceService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 设备保养记录
 */
@RestController
@RequestMapping("/iot/maintenance")
public class IotDeviceMaintenanceController extends BaseController<IotDeviceMaintenanceService, IotDeviceMaintenance, IotDeviceMaintenance, IotDeviceMaintenanceQuery> {

    @Autowired
    private IotDeviceMaintenanceService iotDeviceMaintenanceService;

    @Override
    public Result<Page<IotDeviceMaintenance>> search(Page<IotDeviceMaintenance> page, IotDeviceMaintenanceQuery query) {
        return Result.success(iotDeviceMaintenanceService.search(page, query));
    }
}
