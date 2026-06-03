package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotDeviceTypeCommandService extends IService<IotDeviceTypeCommand> {

    List<IotDeviceTypeCommand> getCommandsByDeviceType(Long deviceTypeId);
}
