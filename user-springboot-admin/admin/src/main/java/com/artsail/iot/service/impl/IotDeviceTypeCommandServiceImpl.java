package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotDeviceTypeCommandMapper;
import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.artsail.iot.service.IotDeviceTypeCommandService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceTypeCommandServiceImpl extends ServiceImpl<IotDeviceTypeCommandMapper, IotDeviceTypeCommand>
        implements IotDeviceTypeCommandService {

    private final IotDeviceTypeCommandMapper iotDeviceTypeCommandMapper;

    @Override
    public List<IotDeviceTypeCommand> getCommandsByDeviceType(Long deviceTypeId) {
        return iotDeviceTypeCommandMapper.selectByDeviceType(deviceTypeId);
    }
}
