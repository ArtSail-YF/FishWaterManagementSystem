package com.artsail.admin.controller.base;

import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;

@RestController
@RequiredArgsConstructor
@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
public abstract class BaseAdminController<S extends IService<T>, T, Q> {

    @Autowired
    protected S baseService;

    @GetMapping("/{id}")
    public Result<T> getById(@PathVariable Long id) {
        return Result.success(baseService.getById(id));
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody T entity) {
        return Result.success(baseService.save(entity));
    }

    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody T entity) {
        try {
            Field idField = entity.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException("设置ID失败", e);
        }
        return Result.success(baseService.updateById(entity));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> remove(@PathVariable Long id) {
        return Result.success(baseService.removeById(id));
    }

    @GetMapping("/list")
    public abstract Result<Page<T>> list(Page<T> page, Q query);
}
