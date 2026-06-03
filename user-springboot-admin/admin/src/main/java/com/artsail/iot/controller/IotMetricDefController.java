package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotMetricDef;
import com.artsail.iot.service.IotMetricDefService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 指标定义
 */
@RestController
@RequestMapping("/iot/metric-def")
public class IotMetricDefController {

    @Autowired
    private IotMetricDefService iotMetricDefService;

    @GetMapping("/list")
    public Result<List<IotMetricDef>> list(@RequestParam(required = false) Long deviceTypeId) {
        if (deviceTypeId != null) {
            return Result.success(iotMetricDefService.getMetricsByDeviceType(deviceTypeId));
        }
        return Result.success(iotMetricDefService.list());
    }
}
