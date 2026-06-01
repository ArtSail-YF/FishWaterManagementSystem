package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IotTsDataService extends IService<IotTsData> {

    Page<IotTsData> search(Page<IotTsData> page, IotTsDataQuery query);
}
