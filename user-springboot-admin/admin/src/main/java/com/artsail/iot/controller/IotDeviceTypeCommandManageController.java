package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.artsail.iot.service.IotDeviceTypeCommandService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 设备类型指令管理 CRUD
 */
@RestController
@RequestMapping("/iot/device-type-command")
public class IotDeviceTypeCommandManageController {

    @Autowired
    private IotDeviceTypeCommandService iotDeviceTypeCommandService;

    @GetMapping("/list")
    public Result<java.util.List<IotDeviceTypeCommand>> list(@RequestParam(required = false) Long deviceTypeId) {
        if (deviceTypeId != null) {
            return Result.success(iotDeviceTypeCommandService.getCommandsByDeviceType(deviceTypeId));
        }
        return Result.success(iotDeviceTypeCommandService.list());
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody IotDeviceTypeCommand command) {
        if (command.getDeviceTypeId() == null || command.getCommandKey() == null) {
            return Result.error("设备类型和指令键不能为空");
        }
        return Result.success(iotDeviceTypeCommandService.save(command));
    }

    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody IotDeviceTypeCommand command) {
        command.setId(id);
        return Result.success(iotDeviceTypeCommandService.updateById(command));
    }

    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id) {
        boolean ok = iotDeviceTypeCommandService.removeById(id);
        return ok ? Result.success(null) : Result.error("删除失败");
    }
}
