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

    @GetMapping("/options")
    public Result<List<IotDevice>> getDeviceOptions(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long typeId) {
        return Result.success(iotDeviceService.getDeviceOptions(baseId, typeId));
    }

    @PutMapping("/{id}/status")
    public Result<Boolean> setStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        if (status == null || (status != 0 && status != 1 && status != 2)) {
            return Result.error("状态值无效，仅支持0(离线)/1(在线)/2(维护中)");
        }
        IotDevice device = iotDeviceService.getById(id);
        if (device == null) {
            return Result.error("设备不存在");
        }
        device.setStatus(status);
        boolean ok = iotDeviceService.updateById(device);
        return ok ? Result.success(true) : Result.error("操作失败");
    }

    @PostMapping("/{id}/command")
    public Result<String> sendCommand(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String command = body.get("command");
        if (command == null || command.isEmpty()) {
            return Result.error("命令不能为空");
        }
        boolean ok = mqttPublishService.publishCommand(id, command);
        return ok ? Result.success("命令已发送") : Result.error("发送失败，检查设备是否存在或 MQTT 连接");
    }
}
