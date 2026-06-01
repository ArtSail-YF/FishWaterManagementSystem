package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IotAlertService extends IService<IotAlert> {

    Page<IotAlert> search(Page<IotAlert> page, IotAlertQuery query);
}
