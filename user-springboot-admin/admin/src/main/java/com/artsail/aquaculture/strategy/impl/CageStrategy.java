package com.artsail.aquaculture.strategy.impl;

import com.artsail.aquaculture.model.domain.Cage;
import com.artsail.aquaculture.model.domain.Query.CageQuery;
import com.artsail.aquaculture.service.CageService;
import com.artsail.aquaculture.strategy.ProductionStrategy;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 网箱策略实现
 */
@Service("cage")
@RequiredArgsConstructor
public class CageStrategy implements ProductionStrategy<Cage, CageQuery> {
    
    private final CageService cageService;
    
    @Override
    public Page<Cage> search(Page<Cage> page, CageQuery query) {
        return cageService.search(page, query);
    }
    
    @Override
    public Cage getById(Long id) {
        return cageService.getById(id);
    }
    
    @Override
    public boolean save(Cage entity) {
        return cageService.save(entity);
    }
    
    @Override
    public boolean updateById(Long id, Cage entity) {
        entity.setId(id);
        return cageService.updateById(entity);
    }
    
    @Override
    public boolean removeById(Long id) {
        return cageService.removeById(id);
    }
}
