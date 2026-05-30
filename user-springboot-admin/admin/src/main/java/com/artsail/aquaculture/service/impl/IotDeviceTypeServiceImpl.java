package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.IotDeviceTypeMapper;
import com.artsail.aquaculture.model.domain.IotDeviceType;
import com.artsail.aquaculture.service.IotDeviceTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceTypeServiceImpl extends ServiceImpl<IotDeviceTypeMapper, IotDeviceType> implements IotDeviceTypeService {
}
