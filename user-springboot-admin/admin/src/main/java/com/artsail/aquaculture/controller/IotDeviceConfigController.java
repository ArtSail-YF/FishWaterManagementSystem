package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.IotDeviceConfig;
import com.artsail.aquaculture.service.IotDeviceConfigService;
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

    /** 获取某台设备的所有配置 GET /iot/device-config/{deviceId} */
    @GetMapping("/{deviceId}")
    public Result<List<IotDeviceConfig>> getByDeviceId(@PathVariable Long deviceId) {
        return Result.success(iotDeviceConfigService.getByDeviceId(deviceId));
    }

    /** 保存设备配置（全量覆盖）POST /iot/device-config/{deviceId} */
    @PostMapping("/{deviceId}")
    public Result<Void> saveConfigs(@PathVariable Long deviceId, @RequestBody List<IotDeviceConfig> configs) {
        iotDeviceConfigService.saveConfigs(deviceId, configs);
        return Result.success(null);
    }

    /** 新增单条配置 POST /iot/device-config */
    @PostMapping
    public Result<Boolean> addConfig(@RequestBody IotDeviceConfig config) {
        return Result.success(iotDeviceConfigService.save(config));
    }

    /** 删除配置 DELETE /iot/device-config/{id} */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteConfig(@PathVariable Long id) {
        return Result.success(iotDeviceConfigService.removeById(id));
    }
}
