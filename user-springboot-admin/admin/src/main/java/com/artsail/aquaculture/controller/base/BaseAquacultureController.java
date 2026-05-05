package com.artsail.aquaculture.controller.base;

import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 通用控制器基类，封装了标准的增删改查及分页查询逻辑
 * @author 13372
 * @param <S> Service层接口，需继承IService<E>
 * @param <E> 实体类类型（用于 CRUD 操作）
 * @param <V> VO类型（用于查询返回，可与 E 相同）
 * @param <Q> 查询条件对象类型
 */
@RestController // 声明为RestController，子类无需重复声明
@RequiredArgsConstructor // 使用Lombok生成构造器，用于注入final字段
public abstract class BaseAquacultureController<S extends IService<E>, E, V, Q> {


    protected S baseService;

    /**
     * 根据ID查询单个实体
     */
    @GetMapping("/{id}")
    public Result<E> getById(@PathVariable @NotNull Long id) {
        E entity = baseService.getById(id);
        return Result.success(entity);
    }

    /**
     * 新增实体
     */
    @PostMapping
    public Result<Boolean> save(@RequestBody @Validated E entity) {
        boolean success = baseService.save(entity);
        if (!success) {
            return Result.error("新增失败");
        }
        return Result.success(success);
    }

    /**
     * 根据ID更新实体
     */
    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable @NotNull Long id, @RequestBody @Validated E entity) {
        // 假设实体类有setId方法，这里通过反射或统一接口设置ID
        // 如果你的实体类没有统一的 setId 方式，这个方法可能需要子类重写
        try {
            java.lang.reflect.Method setIdMethod = entity.getClass().getMethod("setId", Long.class);
            setIdMethod.invoke(entity, id);
        } catch (Exception e) {
            // 如果无法设置ID，返回错误
            return Result.error("无法设置实体ID");
        }

        boolean success = baseService.updateById(entity);
        return Result.success(success);
    }

    /**
     * 根据ID删除实体
     */
    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable @NotNull Long id) {
        boolean success = baseService.removeById(id);
        if (!success) {
            return Result.error("删除失败");
        }
        return Result.success(null);
    }

    /**
     * 分页及条件查询
     * 注意：此方法需要子类实现，因为每个实体的查询逻辑不同
     */
    @GetMapping("/search")
    public abstract Result<Page<V>> search(Page<V> page, Q query);
}