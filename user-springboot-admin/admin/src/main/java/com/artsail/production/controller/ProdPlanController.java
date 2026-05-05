package com.artsail.production.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.service.ProdPlanService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生产计划管理控制器
 */
@RestController
@RequestMapping("/plan")
@RequiredArgsConstructor
public class ProdPlanController extends BaseAquacultureController<ProdPlanService, ProdPlan, ProdPlan, ProdPlanQuery> {

    private final ProdPlanService prodPlanService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<ProdPlan>> search(Page<ProdPlan> page, ProdPlanQuery query) {
        return Result.success(prodPlanService.search(page, query));
    }
}
