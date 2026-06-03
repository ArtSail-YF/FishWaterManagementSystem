package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotCommandLog;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotCommandLogService extends IService<IotCommandLog> {

    List<IotCommandLog> getLogsByDeviceId(Long deviceId);
}
