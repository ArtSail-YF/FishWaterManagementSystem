package com.artsail.production.service;

import com.artsail.production.model.domain.StkUsage;
import com.artsail.production.model.domain.Query.StkUsageQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 物资使用记录 Service
 */
public interface StkUsageService extends IService<StkUsage> {

    /**
     * 分页查询物资使用记录
     */
    Page<StkUsage> search(Page<StkUsage> page, StkUsageQuery query);
}
