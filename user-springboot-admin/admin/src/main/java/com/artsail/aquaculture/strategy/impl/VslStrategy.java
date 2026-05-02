package com.artsail.aquaculture.strategy.impl;

import com.artsail.aquaculture.model.domain.Query.VslQuery;
import com.artsail.aquaculture.model.domain.Vsl;
import com.artsail.aquaculture.service.VslService;
import com.artsail.aquaculture.strategy.ProductionStrategy;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 工船策略实现
 */
@Service("workboat")
@RequiredArgsConstructor
public class VslStrategy implements ProductionStrategy<Vsl, VslQuery> {
    
    private final VslService vslService;
    
    @Override
    public Page<Vsl> search(Page<Vsl> page, VslQuery query) {
        return vslService.search(page, query);
    }
    
    @Override
    public Vsl getById(Long id) {
        return vslService.getById(id);
    }
    
    @Override
    public boolean save(Vsl entity) {
        return vslService.save(entity);
    }
    
    @Override
    public boolean updateById(Long id, Vsl entity) {
        entity.setId(id);
        return vslService.updateById(entity);
    }
    
    @Override
    public boolean removeById(Long id) {
        return vslService.removeById(id);
    }
}
