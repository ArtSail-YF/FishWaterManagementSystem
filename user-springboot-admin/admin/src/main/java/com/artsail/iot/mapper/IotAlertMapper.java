package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IotAlertMapper extends BaseMapper<IotAlert> {

    Page<IotAlert> searchWithDevice(Page<IotAlert> page, @Param("query") IotAlertQuery query);
}
