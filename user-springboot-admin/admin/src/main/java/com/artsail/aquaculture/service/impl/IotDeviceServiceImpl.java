package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.IotDeviceMapper;
import com.artsail.aquaculture.model.domain.IotDevice;
import com.artsail.aquaculture.model.domain.IotDeviceType;
import com.artsail.aquaculture.model.domain.Query.IotDeviceQuery;
import com.artsail.aquaculture.service.IotDeviceService;
import com.artsail.aquaculture.service.IotDeviceTypeService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotDeviceServiceImpl extends ServiceImpl<IotDeviceMapper, IotDevice> implements IotDeviceService {

    private final IotDeviceMapper iotDeviceMapper;

    @Override
    public Page<IotDevice> search(Page<IotDevice> page, IotDeviceQuery query) {
        return iotDeviceMapper.searchWithNames(page, query);
    }

    @Override
    public List<IotDevice> getByBaseId(Long baseId) {
        // 使用 XML 联表查询，返回带 typeCode 的在线设备
        return iotDeviceMapper.selectByBaseId(baseId);
    }

    @Override
    public List<IotDevice> getByTypeAndBase(Long typeId, Long baseId) {
        return this.lambdaQuery()
                .eq(IotDevice::getBaseId, baseId)
                .eq(typeId != null, IotDevice::getTypeId, typeId)
                .eq(IotDevice::getStatus, 1)
                .list();
    }
}
