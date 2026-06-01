package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceConfig;
import com.artsail.iot.service.IotDeviceConfigService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * IoT 设备参数配置
 */
@RestController
@RequestMapping("/iot/device-config")
public class IotDeviceConfigController {

    @Autowired
    private IotDeviceConfigService iotDeviceConfigService;

    @GetMapping("/{deviceId}")
    public Result<List<IotDeviceConfig>> getByDeviceId(@PathVariable Long deviceId) {
        return Result.success(iotDeviceConfigService.getByDeviceId(deviceId));
    }

    @PostMapping("/{deviceId}")
    public Result<Void> saveConfigs(@PathVariable Long deviceId, @RequestBody List<IotDeviceConfig> configs) {
        iotDeviceConfigService.saveConfigs(deviceId, configs);
        return Result.success(null);
    }
}
