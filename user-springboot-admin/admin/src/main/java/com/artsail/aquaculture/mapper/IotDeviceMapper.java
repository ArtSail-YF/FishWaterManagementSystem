package com.artsail.aquaculture.mapper;

import com.artsail.aquaculture.model.domain.IotDevice;
import com.artsail.aquaculture.model.domain.Query.IotDeviceQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IotDeviceMapper extends BaseMapper<IotDevice> {

    /** 联表分页查询（填充 typeName/typeCode/baseName/pondName） */
    Page<IotDevice> searchWithNames(Page<IotDevice> page, @Param("query") IotDeviceQuery query);

    /** 根据基地ID查询在线设备（带 typeName/typeCode） */
    List<IotDevice> selectByBaseId(@Param("baseId") Long baseId);
}
