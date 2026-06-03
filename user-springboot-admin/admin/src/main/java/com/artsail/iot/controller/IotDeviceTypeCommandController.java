package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceType;
import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.artsail.iot.service.IotDeviceTypeCommandService;
import com.artsail.iot.service.IotDeviceTypeService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 设备类型 + 类型指令
 */
@RestController
@RequestMapping("/iot/device-type")
public class IotDeviceTypeCommandController {

    @Autowired
    private IotDeviceTypeCommandService iotDeviceTypeCommandService;

    @Autowired
    private IotDeviceTypeService iotDeviceTypeService;

    @GetMapping("/{id}/commands")
    public Result<List<IotDeviceTypeCommand>> getCommands(@PathVariable Long id) {
        return Result.success(iotDeviceTypeCommandService.getCommandsByDeviceType(id));
    }

    @GetMapping("/all")
    public Result<List<IotDeviceType>> getAll() {
        return Result.success(iotDeviceTypeService.lambdaQuery()
                .eq(IotDeviceType::getStatus, 1)
                .list());
    }
}
