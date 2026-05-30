package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.IotDevice;
import com.artsail.aquaculture.model.domain.Query.IotDeviceQuery;
import com.artsail.aquaculture.service.IotDeviceService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/iot/device")
public class IotDeviceController extends BaseController<IotDeviceService, IotDevice, IotDevice, IotDeviceQuery> {

    @Autowired
    private IotDeviceService iotDeviceService;

    @Override
    public Result<Page<IotDevice>> search(Page<IotDevice> page, IotDeviceQuery query) {
        return Result.success(iotDeviceService.search(page, query));
    }

    /** 根据基地ID获取在线设备列表（供发布弹窗下拉选择） */
    @GetMapping("/by-base/{baseId}")
    public Result<List<IotDevice>> getByBaseId(@PathVariable Long baseId) {
        return Result.success(iotDeviceService.getByBaseId(baseId));
    }

    /** 根据设备类型ID和基地获取设备 */
    @GetMapping("/by-type")
    public Result<List<IotDevice>> getByTypeAndBase(
            @RequestParam Long typeId,
            @RequestParam Long baseId) {
        return Result.success(iotDeviceService.getByTypeAndBase(typeId, baseId));
    }

    /** 启停设备 PUT /iot/device/{id}/status */
    @PutMapping("/{id}/status")
    public Result<Boolean> setStatus(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
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
}
