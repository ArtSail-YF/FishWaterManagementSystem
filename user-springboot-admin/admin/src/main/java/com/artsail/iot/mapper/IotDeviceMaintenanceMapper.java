package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotDeviceMaintenance;
import com.artsail.iot.model.domain.query.IotDeviceMaintenanceQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IotDeviceMaintenanceMapper extends BaseMapper<IotDeviceMaintenance> {

    Page<IotDeviceMaintenance> searchWithDevice(Page<IotDeviceMaintenance> page, @Param("query") IotDeviceMaintenanceQuery query);
}
