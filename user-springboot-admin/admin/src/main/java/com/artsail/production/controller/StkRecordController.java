package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.StkRecord;
import com.artsail.production.model.domain.Query.StkRecordQuery;
import com.artsail.production.service.StkRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 库存流水记录管理控制器
 * 记录物资入库、出库、盘点调整等库存变动流水
 */
@RestController
@RequestMapping("/stock/record")
public class StkRecordController extends BaseController<StkRecordService, StkRecord, StkRecord, StkRecordQuery> {

    @Autowired
    private StkRecordService stkRecordService;

    @Override
    public Result<Page<StkRecord>> search(Page<StkRecord> page, StkRecordQuery query) {
        return Result.success(stkRecordService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 物资入库
     * POST /stock/record/in
     * 记录物资入库，增加库存 (stk_inventory)
     */

    /**
     * 物资出库
     * POST /stock/record/out
     * 记录物资出库，扣减库存 (stk_inventory)
     */

    /**
     * 库存盘点调整
     * POST /stock/record/adjust
     * 盘点后发现库存不符，进行调整 (type='ADJUST')
     */

    /**
     * 查询物资流水
     * GET /stock/record/mat/{matId}/history
     * 查询指定物资的所有出入库流水记录
     */

    /**
     * 查询基地库存变动趋势
     * GET /stock/record/trend
     * 按天/周/月统计物资出入库数量
     */

    /**
     * 导出库存流水
     * GET /stock/record/export
     * 导出 Excel：包含流水单号、物资名称、变动类型、数量、操作人、时间等
     */
}
