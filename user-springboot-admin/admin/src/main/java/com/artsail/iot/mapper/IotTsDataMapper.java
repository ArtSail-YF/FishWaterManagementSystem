package com.artsail.iot.mapper;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.model.vo.WaterDataRawRow;
import com.artsail.iot.model.vo.WaterTrendRawRow;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IotTsDataMapper extends BaseMapper<IotTsData> {

    Page<IotTsData> searchWithDevice(Page<IotTsData> page, @Param("query") IotTsDataQuery query);

    List<IotTsData> selectLatestByDevice(@Param("query") IotTsDataQuery query);

    /** 查询所有塘口的最新水质指标 */
    List<WaterDataRawRow> selectLatestByPond();

    /** 查询指定塘口的近期水质趋势数据 */
    List<WaterTrendRawRow> selectTrendByPond(@Param("pondId") Long pondId);
}
