package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotTsDataMapper;
import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.service.IotTsDataService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotTsDataServiceImpl extends ServiceImpl<IotTsDataMapper, IotTsData> implements IotTsDataService {

    private final IotTsDataMapper iotTsDataMapper;

    @Override
    public Page<IotTsData> search(Page<IotTsData> page, IotTsDataQuery query) {
        return iotTsDataMapper.searchWithDevice(page, query);
    }
}
