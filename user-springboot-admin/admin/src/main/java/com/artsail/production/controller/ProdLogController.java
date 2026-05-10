package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.artsail.production.service.ProdLogService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 生产日志管理控制器
 * 统一记录投喂、用药、水质检测、捕捞等所有生产作业日志
 */
@RestController
@RequestMapping("/log")
public class ProdLogController extends BaseController<ProdLogService, ProdLog, ProdLog, ProdLogQuery> {

    @Autowired
    private ProdLogService prodLogService;

    @Override
    public Result<Page<ProdLog>> search(Page<ProdLog> page, ProdLogQuery query) {
        return Result.success(prodLogService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 按作业类型统计日志数量
     * GET /log/stats/by-type
     * 返回各类型日志（feeding/medication/water_check/harvest）的数量统计
     */

    /**
     * 按基地统计日志数量
     * GET /log/stats/by-base
     * 返回各基地的日志数量分布
     */

    /**
     * 查询塘口作业历史
     * GET /log/pond/{pondId}/history
     * 按时间倒序返回该塘口所有作业记录（投喂、用药、水质等）
     */

    /**
     * 审核生产日志
     * PUT /log/{id}/verify
     * 更新 verify_status（auto/pending/rejected）
     */

    /**
     * 批量审核日志
     * PUT /log/batch-verify
     * 批量更新多条日志的审核状态
     */

    /**
     * 导出生产日志
     * GET /log/export
     * 导出 Excel：包含作业类型、时间、数量、操作人、GPS 位置等
     */

    /**
     * 查询异常日志
     * GET /log/abnormal
     * 查询 status_flag='abnormal' 或 verify_status='rejected' 的日志
     */

    /**
     * 查询补录日志
     * GET /log/backfilled
     * 查询 is_backfilled=true 的事后补录日志
     */
}
