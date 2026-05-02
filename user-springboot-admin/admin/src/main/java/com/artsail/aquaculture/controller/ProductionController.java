package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.service.ProductionService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 生产载体统一控制器
 * 策略模式 + Spring Map 注入
 */
@RestController
@RequestMapping("/api/production")
@RequiredArgsConstructor
@Validated
public class ProductionController {

    private final ProductionService productionService;

    /**
     * 查询载体详情
     */
    @GetMapping("/{type}/{id}")
    public Result<?> getById(
            @PathVariable @NotNull String type,
            @PathVariable @NotNull Long id) {
        return Result.success(productionService.executeGetById(type, id));
    }

    /**
     * 新增载体
     */
    @PostMapping("/{type}")
    public Result<Boolean> save(
            @PathVariable @NotNull String type,
            @RequestBody Object entity) {
        boolean success = productionService.executeSave(type, entity);
        if (!success) {
            return Result.error("新增失败");
        }
        return Result.success(success);
    }

    /**
     * 更新载体
     */
    @PutMapping("/{type}/{id}")
    public Result<Boolean> update(
            @PathVariable @NotNull String type,
            @PathVariable @NotNull Long id,
            @RequestBody Object entity) {
        boolean success = productionService.executeUpdateById(type, id, entity);
        return Result.success(success);
    }

    /**
     * 删除载体
     */
    @DeleteMapping("/{type}/{id}")
    public Result<Void> remove(
            @PathVariable @NotNull String type,
            @PathVariable @NotNull Long id) {
        boolean success = productionService.executeRemoveById(type, id);
        if (!success) {
            return Result.error("删除失败");
        }
        return Result.success(null);
    }

    /**
     * 分页查询
     */
    @GetMapping("/{type}/search")
    public <T, Q> Result<Page<T>> search(
            @PathVariable @NotNull String type,
            Page<T> page,
            @RequestParam(required = false) Q query) {
        return Result.success(productionService.executeSearch(type, page, query));
    }
}
