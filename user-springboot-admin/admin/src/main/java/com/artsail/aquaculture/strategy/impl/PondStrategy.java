package com.artsail.aquaculture.strategy.impl;

import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.service.PondService;
import com.artsail.aquaculture.strategy.ProductionStrategy;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 塘口策略实现
 */
@Service("pond")
@RequiredArgsConstructor
public class PondStrategy implements ProductionStrategy<Pond, PondQuery> {
    
    private final PondService pondService;
    
    @Override
    public Page<Pond> search(Page<Pond> page, PondQuery query) {
        return pondService.search(page, query);
    }
    
    @Override
    public Pond getById(Long id) {
        return pondService.getById(id);
    }
    
    @Override
    public boolean save(Pond entity) {
        return pondService.save(entity);
    }
    
    @Override
    public boolean updateById(Long id, Pond entity) {
        entity.setId(id);
        return pondService.updateById(entity);
    }
    
    @Override
    public boolean removeById(Long id) {
        return pondService.removeById(id);
    }
}
