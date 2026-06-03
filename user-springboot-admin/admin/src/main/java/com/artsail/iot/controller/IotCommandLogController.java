package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotCommandLog;
import com.artsail.iot.service.IotCommandLogService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 指令执行记录
 */
@RestController
@RequestMapping("/iot/command-log")
public class IotCommandLogController {

    @Autowired
    private IotCommandLogService iotCommandLogService;

    @GetMapping
    public Result<List<IotCommandLog>> list(@RequestParam Long deviceId) {
        return Result.success(iotCommandLogService.getLogsByDeviceId(deviceId));
    }
}
