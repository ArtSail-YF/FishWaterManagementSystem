package com.artsail.aquaculture.strategy;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 生产载体策略接口（泛型约束）
 * @param <T> 实体类型
 * @param <Q> 查询 DTO 类型
 */
public interface ProductionStrategy<T, Q> {
    
    /**
     * 分页查询
     */
    Page<T> search(Page<T> page, Q query);
    
    /**
     * 根据 ID 查询
     */
    T getById(Long id);
    
    /**
     * 新增
     */
    boolean save(T entity);
    
    /**
     * 更新（带 ID）
     */
    boolean updateById(Long id, T entity);
    
    /**
     * 删除
     */
    boolean removeById(Long id);
}
