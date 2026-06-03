package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotMetricDef;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotMetricDefService extends IService<IotMetricDef> {

    List<IotMetricDef> getMetricsByDeviceType(Long deviceTypeId);
}
