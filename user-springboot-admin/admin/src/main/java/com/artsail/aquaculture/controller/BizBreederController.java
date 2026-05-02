package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.service.BizBreederService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/breeder")
@RequiredArgsConstructor
@Validated
public class BizBreederController {

    private final BizBreederService breederService;

    /**
     * 查询养殖户详情
     */
    @GetMapping("/{id}")
    public Result<BizBreeder> getById(@PathVariable @NotNull Long id) {
        BizBreeder breeder = breederService.getById(id);
        return Result.success(breeder);
    }

    /**
     * 新增养殖户
     */
    @PostMapping
    public Result<Boolean> save(@RequestBody @Validated BizBreeder breeder) {
        boolean success = breederService.save(breeder);
        if (!success) {
            return Result.error("新增养殖户失败");
        }
        return Result.success(success);
    }

    /**
     * 更新养殖户
     */
    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable @NotNull Long id, @RequestBody @Validated BizBreeder breeder) {
        breeder.setId(id);
        boolean success = breederService.updateById(breeder);
        return Result.success(success);
    }

    /**
     * 删除养殖户
     */
    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable @NotNull Long id) {
        boolean success = breederService.removeById(id);
        if (!success) {
            return Result.error("删除养殖户失败");
        }
        return Result.success(null);
    }

    /**
     * 查询养殖户（支持分页和条件搜索）
     */
    @GetMapping("/search")
    public Result<Page<BizBreeder>> search(
            Page<BizBreeder> page,
            BreederQuery query) {
        return Result.success(breederService.search(page, query));
    }
}
