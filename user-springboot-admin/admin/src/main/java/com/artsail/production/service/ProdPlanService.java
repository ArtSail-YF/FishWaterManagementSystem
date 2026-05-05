package com.artsail.production.service;

import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 生产计划服务接口
 */
public interface ProdPlanService extends IService<ProdPlan> {
    
    /**
     * 分页查询生产计划
     */
    Page<ProdPlan> search(Page<ProdPlan> page, ProdPlanQuery query);
}
