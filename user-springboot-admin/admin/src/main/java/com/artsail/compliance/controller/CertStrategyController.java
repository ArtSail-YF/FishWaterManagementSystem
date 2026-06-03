package com.artsail.compliance.controller;

import com.artsail.compliance.model.domain.CertStrategy;
import com.artsail.compliance.service.CertStrategyService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 合格证策略管理
 */
@RestController
@RequestMapping("/cert-strategy")
public class CertStrategyController {

    @Autowired
    private CertStrategyService certStrategyService;

    @GetMapping("/search")
    public Result<Page<CertStrategy>> search(@RequestParam(defaultValue = "1") long current,
                                              @RequestParam(defaultValue = "20") long pageSize) {
        Page<CertStrategy> page = new Page<>(current, pageSize);
        return Result.success(certStrategyService.page(page));
    }

    @GetMapping("/list-all")
    public Result<List<CertStrategy>> listAll() {
        return Result.success(certStrategyService.list());
    }

    @GetMapping("/{id}")
    public Result<CertStrategy> getById(@PathVariable Long id) {
        return Result.success(certStrategyService.getById(id));
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody CertStrategy entity) {
        return Result.success(certStrategyService.save(entity));
    }

    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody CertStrategy entity) {
        entity.setId(id);
        return Result.success(certStrategyService.updateById(entity));
    }

    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id) {
        certStrategyService.removeById(id);
        return Result.success(null);
    }
}
