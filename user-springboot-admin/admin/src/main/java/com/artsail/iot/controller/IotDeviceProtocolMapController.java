package com.artsail.iot.controller;

import com.artsail.iot.model.domain.IotDeviceProtocolMap;
import com.artsail.iot.mapper.IotDeviceProtocolMapMapper;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 设备协议字段映射管理
 */
@RestController
@RequestMapping("/iot/protocol-map")
public class IotDeviceProtocolMapController {

    @Autowired
    private IotDeviceProtocolMapMapper iotDeviceProtocolMapMapper;

    /**
     * 按设备类型获取映射列表
     */
    @GetMapping("/list")
    public Result<List<IotDeviceProtocolMap>> list(
            @RequestParam(required = false) Long deviceTypeId,
            @RequestParam(required = false) String deviceSn) {
        LambdaQueryWrapper<IotDeviceProtocolMap> qw = new LambdaQueryWrapper<>();
        if (deviceTypeId != null) {
            qw.eq(IotDeviceProtocolMap::getDeviceTypeId, deviceTypeId);
        }
        if (deviceSn != null) {
            qw.eq(IotDeviceProtocolMap::getDeviceSn, deviceSn);
        }
        qw.orderByAsc(IotDeviceProtocolMap::getDeviceTypeId);
        return Result.success(iotDeviceProtocolMapMapper.selectList(qw));
    }

    /**
     * 新增映射
     */
    @PostMapping
    public Result<Boolean> save(@RequestBody IotDeviceProtocolMap map) {
        if (map.getDeviceTypeId() == null || map.getSourceField() == null || map.getMetricKey() == null) {
            return Result.error("设备类型、源字段、指标键不能为空");
        }
        return Result.success(iotDeviceProtocolMapMapper.insert(map) > 0);
    }

    /**
     * 更新映射
     */
    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody IotDeviceProtocolMap map) {
        map.setId(id);
        return Result.success(iotDeviceProtocolMapMapper.updateById(map) > 0);
    }

    /**
     * 删除映射
     */
    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id) {
        boolean ok = iotDeviceProtocolMapMapper.deleteById(id) > 0;
        return ok ? Result.success(null) : Result.error("删除失败");
    }
}
