package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotDeviceConfigMapper;
import com.artsail.iot.model.domain.IotDeviceConfig;
import com.artsail.iot.service.IotDeviceConfigService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceConfigServiceImpl extends ServiceImpl<IotDeviceConfigMapper, IotDeviceConfig> implements IotDeviceConfigService {

    @Override
    public List<IotDeviceConfig> getByDeviceId(Long deviceId) {
        return this.lambdaQuery()
                .eq(IotDeviceConfig::getDeviceId, deviceId)
                .orderByAsc(IotDeviceConfig::getParamKey)
                .list();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveConfigs(Long deviceId, List<IotDeviceConfig> configs) {
        this.remove(new LambdaQueryWrapper<IotDeviceConfig>()
                .eq(IotDeviceConfig::getDeviceId, deviceId));
        if (configs != null && !configs.isEmpty()) {
            for (IotDeviceConfig config : configs) {
                config.setId(null);
                config.setDeviceId(deviceId);
                config.setUpdateTime(LocalDateTime.now());
                if (config.getIsActive() == null) {
                    config.setIsActive(1);
                }
            }
            this.saveBatch(configs);
        }
    }
}
