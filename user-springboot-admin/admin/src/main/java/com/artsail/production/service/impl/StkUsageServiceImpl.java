package com.artsail.production.service.impl;

import com.artsail.production.mapper.StkUsageMapper;
import com.artsail.production.model.domain.StkUsage;
import com.artsail.production.model.domain.Query.StkUsageQuery;
import com.artsail.production.service.StkUsageService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * 物资使用记录 Service 实现类
 */
@Service
public class StkUsageServiceImpl extends ServiceImpl<StkUsageMapper, StkUsage> implements StkUsageService {

    @Override
    public Page<StkUsage> search(Page<StkUsage> page, StkUsageQuery query) {
        return baseMapper.selectStkUsagePage(page, query);
    }
}
