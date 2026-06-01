package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotDeviceConfig;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotDeviceConfigService extends IService<IotDeviceConfig> {

    List<IotDeviceConfig> getByDeviceId(Long deviceId);

    void saveConfigs(Long deviceId, List<IotDeviceConfig> configs);
}
