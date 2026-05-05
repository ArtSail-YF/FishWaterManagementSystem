//package com.artsail.aquaculture.service;
//
//import com.artsail.aquaculture.enums.ProductionCategory;
//import com.artsail.aquaculture.strategy.ProductionStrategy;
//import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//
///**
// * 生产载体服务（策略上下文）
// */
//@Service
//@RequiredArgsConstructor
//public class ProductionService {
//
//    // Spring 自动注入所有 ProductionStrategy 实现，key 为 Bean 名称
//    private final Map<String, ProductionStrategy<?, ?>> strategyMap;
//
//    /**
//     * 执行分页查询
//     */
//    @SuppressWarnings("unchecked")
//    public <T, Q> Page<T> executeSearch(ProductionCategory category, Page<T> page, Q query) {
//        ProductionStrategy<T, Q> strategy = (ProductionStrategy<T, Q>) strategyMap.get(category.getCode());
//        if (strategy == null) {
//            throw new UnsupportedOperationException("不支持的载体类型: " + category.getDesc());
//        }
//        return strategy.search(page, query);
//    }
//
//    /**
//     * 根据 ID 查询
//     */
//    @SuppressWarnings("unchecked")
//    public <T> T executeGetById(ProductionCategory category, Long id) {
//        ProductionStrategy<T, ?> strategy = (ProductionStrategy<T, ?>) strategyMap.get(category.getCode());
//        if (strategy == null) {
//            throw new UnsupportedOperationException("不支持的载体类型: " + category.getDesc());
//        }
//        return strategy.getById(id);
//    }
//
//    /**
//     * 新增
//     */
//    @SuppressWarnings("unchecked")
//    public <T> boolean executeSave(ProductionCategory category, T entity) {
//        ProductionStrategy<T, ?> strategy = (ProductionStrategy<T, ?>) strategyMap.get(category.getCode());
//        if (strategy == null) {
//            throw new UnsupportedOperationException("不支持的载体类型: " + category.getDesc());
//        }
//        return strategy.save(entity);
//    }
//
//    /**
//     * 更新
//     */
//    @SuppressWarnings("unchecked")
//    public <T> boolean executeUpdateById(ProductionCategory category, Long id, T entity) {
//        ProductionStrategy<T, ?> strategy = (ProductionStrategy<T, ?>) strategyMap.get(category.getCode());
//        if (strategy == null) {
//            throw new UnsupportedOperationException("不支持的载体类型: " + category.getDesc());
//        }
//        // 在策略层设置 ID
//        return strategy.updateById(id, entity);
//    }
//
//    /**
//     * 删除
//     */
//    public boolean executeRemoveById(ProductionCategory category, Long id) {
//        ProductionStrategy<?, ?> strategy = strategyMap.get(category.getCode());
//        if (strategy == null) {
//            throw new UnsupportedOperationException("不支持的载体类型: " + category.getDesc());
//        }
//        return strategy.removeById(id);
//    }
//}
