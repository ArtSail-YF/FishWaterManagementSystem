package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.service.IotTsDataService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 采集数据
 */

@RestController
@RequestMapping("/iot/ts-data")
public class IotTsDataController extends BaseController<IotTsDataService, IotTsData, IotTsData, IotTsDataQuery> {

    @Autowired
    private IotTsDataService iotTsDataService;

    @Override
    public Result<Page<IotTsData>> search(Page<IotTsData> page, IotTsDataQuery query) {
        return Result.success(iotTsDataService.search(page, query));
    }
}
