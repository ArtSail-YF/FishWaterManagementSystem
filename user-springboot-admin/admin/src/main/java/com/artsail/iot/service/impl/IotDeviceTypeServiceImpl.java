package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotDeviceTypeMapper;
import com.artsail.iot.model.domain.IotDeviceType;
import com.artsail.iot.service.IotDeviceTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceTypeServiceImpl extends ServiceImpl<IotDeviceTypeMapper, IotDeviceType> implements IotDeviceTypeService {
}
