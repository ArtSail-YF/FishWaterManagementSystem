package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceType;
import com.artsail.iot.service.IotDeviceTypeService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 设备类型管理
 */
@RestController
@RequestMapping("/iot/device-type")
public class IotDeviceTypeController extends BaseController<IotDeviceTypeService, IotDeviceType, IotDeviceType, IotDeviceType> {

    /**
     * 获取全部设备类型列表（下拉选择等场景）
     */
    @GetMapping("/list")
    public Result<List<IotDeviceType>> list() {
        return Result.success(baseService.list());
    }

    @Override
    @GetMapping("/search")
    public Result<Page<IotDeviceType>> search(Page<IotDeviceType> page, IotDeviceType query) {
        return Result.success(baseService.page(page));
    }
}
