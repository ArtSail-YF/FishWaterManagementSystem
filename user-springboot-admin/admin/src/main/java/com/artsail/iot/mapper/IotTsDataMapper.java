package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IotTsDataMapper extends BaseMapper<IotTsData> {

    Page<IotTsData> searchWithDevice(Page<IotTsData> page, @Param("query") IotTsDataQuery query);
}
