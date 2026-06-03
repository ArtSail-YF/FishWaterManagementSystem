package com.artsail.iot.service;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.model.vo.WaterDataVO;
import com.artsail.iot.model.vo.WaterTrendVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IotTsDataService extends IService<IotTsData> {

    Page<IotTsData> search(Page<IotTsData> page, IotTsDataQuery query);

    List<IotTsData> getLatestByDevice(IotTsDataQuery query);

    /** 获取所有塘口的最新水质指标 */
    List<WaterDataVO> getPondSummary();

    /** 获取指定塘口的水质趋势数据 */
    List<WaterTrendVO> getPondTrend(Long pondId);
}
