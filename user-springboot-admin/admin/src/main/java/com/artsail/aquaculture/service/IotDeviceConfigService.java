package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.IotDeviceConfig;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotDeviceConfigService extends IService<IotDeviceConfig> {

    /** 根据设备ID获取所有配置 */
    List<IotDeviceConfig> getByDeviceId(Long deviceId);

    /** 批量保存设备配置（先删后插） */
    void saveConfigs(Long deviceId, List<IotDeviceConfig> configs);
}
