package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.IotDeviceConfigMapper;
import com.artsail.aquaculture.model.domain.IotDeviceConfig;
import com.artsail.aquaculture.service.IotDeviceConfigService;
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
        // 先删掉该设备所有旧配置
        this.remove(new LambdaQueryWrapper<IotDeviceConfig>()
                .eq(IotDeviceConfig::getDeviceId, deviceId));
        // 再插入新配置
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
