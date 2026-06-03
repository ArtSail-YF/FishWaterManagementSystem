package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotDevice;
import com.artsail.iot.model.domain.query.IotDeviceQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IotDeviceMapper extends BaseMapper<IotDevice> {

    Page<IotDevice> searchWithNames(Page<IotDevice> page, @Param("query") IotDeviceQuery query);

    List<IotDevice> selectDeviceOptions(@Param("baseId") Long baseId, @Param("typeId") Long typeId);
}