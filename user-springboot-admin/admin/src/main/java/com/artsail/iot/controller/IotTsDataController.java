package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.model.vo.WaterDataVO;
import com.artsail.iot.model.vo.WaterTrendVO;
import com.artsail.iot.service.IotTsDataService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采集数据 + 塘口水质聚合
 */
@RestController
@RequestMapping("/iot/ts-data")
public class IotTsDataController extends BaseController<IotTsDataService, IotTsData, IotTsData, IotTsDataQuery> {

    @Autowired
    private IotTsDataService iotTsDataService;

    @GetMapping("/latest")
    public Result<List<IotTsData>> latest(IotTsDataQuery query) {
        return Result.success(iotTsDataService.getLatestByDevice(query));
    }

    @Override
    public Result<Page<IotTsData>> search(Page<IotTsData> page, IotTsDataQuery query) {
        return Result.success(iotTsDataService.search(page, query));
    }

    /**
     * 获取所有塘口的最新水质指标（用于总览看板）
     */
    @GetMapping("/pond-summary")
    public Result<List<WaterDataVO>> pondSummary() {
        return Result.success(iotTsDataService.getPondSummary());
    }

    /**
     * 获取指定塘口的水质趋势数据
     */
    @GetMapping("/pond-trend/{pondId}")
    public Result<List<WaterTrendVO>> pondTrend(@PathVariable Long pondId) {
        return Result.success(iotTsDataService.getPondTrend(pondId));
    }
}
