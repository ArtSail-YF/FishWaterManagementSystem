package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface IotDeviceTypeCommandMapper extends BaseMapper<IotDeviceTypeCommand> {

    @Select("SELECT * FROM iot_device_type_command WHERE device_type_id = #{deviceTypeId} AND is_active = 1 ORDER BY sort_order ASC")
    List<IotDeviceTypeCommand> selectByDeviceType(@Param("deviceTypeId") Long deviceTypeId);
}
