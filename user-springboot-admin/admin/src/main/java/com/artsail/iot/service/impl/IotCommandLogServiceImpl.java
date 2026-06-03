package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotCommandLogMapper;
import com.artsail.iot.model.domain.IotCommandLog;
import com.artsail.iot.service.IotCommandLogService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotCommandLogServiceImpl extends ServiceImpl<IotCommandLogMapper, IotCommandLog>
        implements IotCommandLogService {

    private final IotCommandLogMapper iotCommandLogMapper;

    @Override
    public List<IotCommandLog> getLogsByDeviceId(Long deviceId) {
        return iotCommandLogMapper.selectList(
                new LambdaQueryWrapper<IotCommandLog>()
                        .eq(IotCommandLog::getDeviceId, deviceId)
                        .orderByDesc(IotCommandLog::getTriggerTime));
    }
}
