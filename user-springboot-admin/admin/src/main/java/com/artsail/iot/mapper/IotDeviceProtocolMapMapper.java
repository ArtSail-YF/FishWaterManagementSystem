package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotDeviceProtocolMap;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface IotDeviceProtocolMapMapper extends BaseMapper<IotDeviceProtocolMap> {

    @Select("SELECT * FROM iot_device_protocol_map WHERE device_type_id = #{deviceTypeId}" +
            " AND (device_sn IS NULL OR device_sn = #{deviceSn})")
    List<IotDeviceProtocolMap> selectByDeviceTypeAndSn(
            @Param("deviceTypeId") Long deviceTypeId,
            @Param("deviceSn") String deviceSn);
}
