package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotDevice;
import com.artsail.iot.model.domain.query.IotDeviceQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotDeviceService extends IService<IotDevice> {

    Page<IotDevice> search(Page<IotDevice> page, IotDeviceQuery query);

    List<IotDevice> getDeviceOptions(Long baseId, Long typeId);
}