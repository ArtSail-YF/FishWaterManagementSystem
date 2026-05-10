package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生产任务管理控制器
 * 管理从计划生成的具体执行任务
 */
@RestController
@RequestMapping("/task")
public class ProdTaskController extends BaseController<ProdTaskService, ProdTask, ProdTask, ProdTaskQuery> {

    @Autowired
    private ProdTaskService prodTaskService;

    @Override
    public Result<Page<ProdTask>> search(Page<ProdTask> page, ProdTaskQuery query) {
        return Result.success(prodTaskService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 查询待办任务
     * GET /task/pending
     * 查询 status='pending' 或 'assigned' 的任务
     */

    /**
     * 查询逾期任务
     * GET /task/expired
     * 查询 status='expired' 或 deadline_time < 当前时间的任务
     */

    /**
     * 查询我的任务
     * GET /task/my
     * 查询 assignee_id=当前登录用户的任务
     */

    /**
     * 分配任务
     * PUT /task/{id}/assign
     * 将任务分配给指定工人（更新 assignee_id）
     */

    /**
     * 开始执行任务
     * PUT /task/{id}/start
     * 将任务状态从 assigned 改为 doing
     */

    /**
     * 完成任务
     * PUT /task/{id}/complete
     * 将任务状态改为 done，并创建 prod_log
     */

    /**
     * 跳过任务
     * PUT /task/{id}/skip
     * 将任务状态改为 skipped，需填写 cancel_reason
     */

    /**
     * 批量分配任务
     * PUT /task/batch-assign
     * 批量将任务分配给指定工人
     */

    /**
     * 导出任务清单
     * GET /task/export
     * 导出 Excel：包含任务标题、目标、执行时间、状态、执行人等
     */

    /**
     * 查询任务执行率统计
     * GET /task/stats/completion-rate
     * 按工人/塘口统计任务完成率
     */
}
