package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotMetricDef;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface IotMetricDefMapper extends BaseMapper<IotMetricDef> {

    @Select("SELECT * FROM iot_metric_def WHERE device_type_id = #{deviceTypeId} AND is_active = 1")
    List<IotMetricDef> selectByDeviceTypeId(@Param("deviceTypeId") Long deviceTypeId);
}
