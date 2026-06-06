package com.artsail.iot.controller;

import com.artsail.iot.mapper.IotDeviceProtocolMapMapper;
import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.IotDeviceProtocolMap;
import com.artsail.iot.model.domain.IotDeviceTypeCommand;
import com.artsail.iot.service.IotAlertRuleService;
import com.artsail.iot.service.IotDeviceTypeCommandService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * IoT 品种配置管理（协议映射 + 指令 + 预警规则）
 * 统一入口：/iot/device-type-config
 */
@RestController
@RequestMapping("/iot/device-type-config")
public class IotDeviceTypeConfigController {

    // ──────────────────────────────
    // 协议映射 Protocol Map
    // ──────────────────────────────

    @Autowired
    private IotDeviceProtocolMapMapper iotDeviceProtocolMapMapper;

    @GetMapping("/protocol-maps")
    public Result<List<IotDeviceProtocolMap>> listProtocolMaps(
            @RequestParam(required = false) Long deviceTypeId,
            @RequestParam(required = false) String deviceSn) {
        LambdaQueryWrapper<IotDeviceProtocolMap> qw = new LambdaQueryWrapper<>();
        if (deviceTypeId != null) qw.eq(IotDeviceProtocolMap::getDeviceTypeId, deviceTypeId);
        if (deviceSn != null) qw.eq(IotDeviceProtocolMap::getDeviceSn, deviceSn);
        qw.orderByAsc(IotDeviceProtocolMap::getDeviceTypeId);
        return Result.success(iotDeviceProtocolMapMapper.selectList(qw));
    }

    @PostMapping("/protocol-maps")
    public Result<Boolean> createProtocolMap(@RequestBody IotDeviceProtocolMap map) {
        if (map.getDeviceTypeId() == null || map.getSourceField() == null || map.getMetricKey() == null) {
            return Result.error("设备类型、源字段、指标键不能为空");
        }
        return Result.success(iotDeviceProtocolMapMapper.insert(map) > 0);
    }

    @PutMapping("/protocol-maps/{id}")
    public Result<Boolean> updateProtocolMap(@PathVariable Long id, @RequestBody IotDeviceProtocolMap map) {
        map.setId(id);
        return Result.success(iotDeviceProtocolMapMapper.updateById(map) > 0);
    }

    @DeleteMapping("/protocol-maps/{id}")
    public Result<Void> deleteProtocolMap(@PathVariable Long id) {
        return iotDeviceProtocolMapMapper.deleteById(id) > 0
                ? Result.success(null) : Result.error("删除失败");
    }

    // ──────────────────────────────
    // 指令 Command
    // ──────────────────────────────

    @Autowired
    private IotDeviceTypeCommandService iotDeviceTypeCommandService;

    @GetMapping("/commands")
    public Result<List<IotDeviceTypeCommand>> listCommands(
            @RequestParam(required = false) Long deviceTypeId) {
        if (deviceTypeId != null) {
            return Result.success(iotDeviceTypeCommandService.getCommandsByDeviceType(deviceTypeId));
        }
        return Result.success(iotDeviceTypeCommandService.list());
    }

    @PostMapping("/commands")
    public Result<Boolean> createCommand(@RequestBody IotDeviceTypeCommand command) {
        if (command.getDeviceTypeId() == null || command.getCommandKey() == null) {
            return Result.error("设备类型和指令键不能为空");
        }
        return Result.success(iotDeviceTypeCommandService.save(command));
    }

    @PutMapping("/commands/{id}")
    public Result<Boolean> updateCommand(@PathVariable Long id, @RequestBody IotDeviceTypeCommand command) {
        command.setId(id);
        return Result.success(iotDeviceTypeCommandService.updateById(command));
    }

    @DeleteMapping("/commands/{id}")
    public Result<Void> deleteCommand(@PathVariable Long id) {
        return iotDeviceTypeCommandService.removeById(id)
                ? Result.success(null) : Result.error("删除失败");
    }

    // ──────────────────────────────
    // 预警规则 Alert Rule
    // ──────────────────────────────

    @Autowired
    private IotAlertRuleService iotAlertRuleService;

    @GetMapping("/alert-rules")
    public Result<List<IotAlertRule>> listAlertRules(
            @RequestParam(required = false) Long deviceTypeId) {
        LambdaQueryWrapper<IotAlertRule> qw = new LambdaQueryWrapper<>();
        if (deviceTypeId != null) qw.eq(IotAlertRule::getDeviceTypeId, deviceTypeId);
        qw.orderByAsc(IotAlertRule::getId);
        return Result.success(iotAlertRuleService.list(qw));
    }

    @PostMapping("/alert-rules")
    public Result<Boolean> createAlertRule(@RequestBody IotAlertRule rule) {
        if (rule.getDeviceTypeId() == null || rule.getMetricKey() == null) {
            return Result.error("设备类型和指标键不能为空");
        }
        return Result.success(iotAlertRuleService.save(rule));
    }

    @PutMapping("/alert-rules/{id}")
    public Result<Boolean> updateAlertRule(@PathVariable Long id, @RequestBody IotAlertRule rule) {
        rule.setId(id);
        return Result.success(iotAlertRuleService.updateById(rule));
    }

    @DeleteMapping("/alert-rules/{id}")
    public Result<Void> deleteAlertRule(@PathVariable Long id) {
        return iotAlertRuleService.removeById(id)
                ? Result.success(null) : Result.error("删除失败");
    }
}
