package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDevice;
import com.artsail.iot.model.domain.query.IotDeviceQuery;
import com.artsail.iot.service.IotDeviceService;
import com.artsail.iot.service.MqttPublishService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 设备管理
 */
@RestController
@RequestMapping("/iot/device")
public class IotDeviceController extends BaseController<IotDeviceService, IotDevice, IotDevice, IotDeviceQuery> {

    @Autowired
    private IotDeviceService iotDeviceService;

    @Autowired
    private MqttPublishService mqttPublishService;

    @Override
    public Result<Page<IotDevice>> search(Page<IotDevice> page, IotDeviceQuery query) {
        return Result.success(iotDeviceService.search(page, query));
    }

    @GetMapping("/by-base/{baseId}")
    public Result<List<IotDevice>> getByBaseId(@PathVariable Long baseId) {
        return Result.success(iotDeviceService.getByBaseId(baseId));
    }

    @GetMapping("/by-type")
    public Result<List<IotDevice>> getByTypeAndBase(
            @RequestParam Long typeId,
            @RequestParam Long baseId) {
        return Result.success(iotDeviceService.getByTypeAndBase(typeId, baseId));
    }

    @PutMapping("/{id}/status")
    public Result<Boolean> setStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        if (status == null || (status != 0 && status != 1 && status != 2)) {
            return Result.error("状态值无效，仅支持 0(离线)/1(在线)/2(维护中)");
        }
        IotDevice device = iotDeviceService.getById(id);
        if (device == null) {
            return Result.error("设备不存在");
        }
        device.setStatus(status);
        boolean ok = iotDeviceService.updateById(device);
        return ok ? Result.success(true) : Result.error("操作失败");
    }

    @PostMapping("/{id}/publish-test")
    public Result<String> publishTest(@PathVariable Long id) {
        boolean ok = mqttPublishService.publishTestData(id);
        if (ok) {
            return Result.success("测试数据已发送，请刷新页面查看");
        } else {
            return Result.error("发送失败，请检查 EMQX 是否运行");
        }
    }
}