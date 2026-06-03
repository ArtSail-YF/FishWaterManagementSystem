package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

public interface IotAlertService extends IService<IotAlert> {

    Page<IotAlert> search(Page<IotAlert> page, IotAlertQuery query);

    Map<String, Object> getStats();

    List<IotAlert> getRecentUnhandled(int limit);
}
