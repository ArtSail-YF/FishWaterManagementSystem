package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.query.IotAlertQuery;
import com.artsail.iot.service.IotAlertService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 告警管理
 */
@RestController
@RequestMapping("/iot/alert")
public class IotAlertController extends BaseController<IotAlertService, IotAlert, IotAlert, IotAlertQuery> {

    @Autowired
    private IotAlertService iotAlertService;

    @Override
    public Result<Page<IotAlert>> search(Page<IotAlert> page, IotAlertQuery query) {
        return Result.success(iotAlertService.search(page, query));
    }

    @PutMapping("/{id}/handle")
    public Result<Boolean> handle(@PathVariable Long id, @RequestBody Map<String, String> body) {
        IotAlert alert = iotAlertService.getById(id);
        if (alert == null) {
            return Result.error("告警不存在");
        }
        alert.setStatus("HANDLED");
        alert.setHandleTime(LocalDateTime.now());
        alert.setHandleNote(body.getOrDefault("handleNote", ""));
        return Result.success(iotAlertService.updateById(alert));
    }
}
