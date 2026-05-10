package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.service.ProdPlanService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生产计划管理控制器
 * 管理投喂、用药、捕捞、维护等生产计划
 */
@RestController
@RequestMapping("/plan")
public class ProdPlanController extends BaseController<ProdPlanService, ProdPlan, ProdPlan, ProdPlanQuery> {

    @Autowired
    private ProdPlanService prodPlanService;

    /**
     * 实现父类定义的抽象查询方法
     */
    @Override
    public Result<Page<ProdPlan>> search(Page<ProdPlan> page, ProdPlanQuery query) {
        return Result.success(prodPlanService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 创建生产计划
     * POST /plan
     * 创建投喂/用药/捕捞/维护计划，同时可创建 prod_plan_detail
     */

    /**
     * 发布计划
     * PUT /plan/{id}/publish
     * 将计划状态从 draft 改为 published，并生成 prod_task
     */

    /**
     * 生成任务
     * POST /plan/{id}/generate-tasks
     * 根据计划的 cycle_rule 生成 prod_task 任务列表
     */

    /**
     * 查询计划详情（含明细）
     * GET /plan/{id}/detail
     * 返回计划信息 + prod_plan_detail（投喂量、药品名称等）
     */

    /**
     * 查询塘口计划列表
     * GET /plan/pond/{pondId}/list
     * 查询指定塘口的所有计划（按时间排序）
     */

    /**
     * 取消计划
     * PUT /plan/{id}/cancel
     * 将计划状态改为 cancelled，并取消关联任务
     */

    /**
     * 复制计划
     * POST /plan/{id}/copy
     * 基于现有计划创建新计划（用于周期性重复计划）
     */

    /**
     * 导出计划
     * GET /plan/export
     * 导出 Excel：包含计划类型、目标、时间、状态、执行人等
     */
}
