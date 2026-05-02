package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.model.domain.Query.BaseQuery;
import com.artsail.aquaculture.service.BaseInfoService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/base")
@RequiredArgsConstructor
@Validated
public class BaseController {

    private final BaseInfoService baseInfoService;

    /**
     * 1. 查询基地详情
     */
    @GetMapping("/{id}")
    public Result<BaseInfo> getById(@PathVariable @NotNull Long id) {
        BaseInfo baseInfo = baseInfoService.getById(id);
        return Result.success(baseInfo);
    }

    /**
     * 2. 新增基地
     */
    @PostMapping
    public Result<Boolean> save(@RequestBody @Validated BaseInfo baseInfo) {
        boolean success = baseInfoService.save(baseInfo);
        if (!success) {
            return Result.error("新增基地失败");
        }
        return Result.success(success);
    }

    /**
     * 3. 更新基地
     */
    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable @NotNull Long id, @RequestBody @Validated BaseInfo baseInfo) {
        baseInfo.setId(id);
        boolean success = baseInfoService.updateById(baseInfo);
        return Result.success(success);
    }

    /**
     * 4. 删除基地
     */
    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable @NotNull Long id) {
        boolean success = baseInfoService.removeById(id);
        if (!success) {
            return Result.error("删除基地失败");
        }
        return Result.success(null);
    }

    /**
     * 5. 查询基地（支持分页和条件搜索）
     */
    @GetMapping("/search")
    public Result<Page<BaseInfo>> search(
            Page<BaseInfo> page,
            BaseQuery query) {
        return Result.success(baseInfoService.search(page, query));
    }
}
