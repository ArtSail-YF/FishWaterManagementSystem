package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotAlertMapper;
import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.artsail.iot.service.IotAlertService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotAlertServiceImpl extends ServiceImpl<IotAlertMapper, IotAlert> implements IotAlertService {

    private final IotAlertMapper iotAlertMapper;

    @Override
    public Page<IotAlert> search(Page<IotAlert> page, IotAlertQuery query) {
        return iotAlertMapper.searchWithDevice(page, query);
    }
}
