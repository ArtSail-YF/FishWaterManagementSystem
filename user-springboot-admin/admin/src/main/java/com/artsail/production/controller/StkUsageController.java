package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.Query.StkUsageQuery;
import com.artsail.production.model.domain.StkUsage;
import com.artsail.production.service.StkUsageService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 物资使用记录管理控制器
 * 统一管理投喂、用药等所有物资消耗记录
 */
@RestController
@RequestMapping("/production/input")
public class StkUsageController extends BaseController<StkUsageService, StkUsage, StkUsage, StkUsageQuery> {

    @Override
    public Result<Page<StkUsage>> search(Page<StkUsage> page, StkUsageQuery query) {
        return Result.success(baseService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 新增物资使用记录
     * POST /production/input/with-log
     * 1. 先创建 prod_log (log_type='feeding'/'medication')
     * 2. 获取 prod_log.id
     * 3. 创建 stk_usage (关联 task_id)
     * 4. 扣减库存 (stk_inventory)
     * 5. 记录流水 (stk_record)
     */

    /**
     * 查询物资使用记录详情
     * GET /production/input/{id}/detail
     * 返回 VO 包含：使用记录 + 物资详情 + 塘口信息 + 关联日志
     */

    /**
     * 统计指定塘口的物资消耗成本
     * GET /production/input/pond/{pondId}/cost
     * 汇总 use_qty * unit_price，按物资分类统计
     */

    /**
     * 统计指定时间段的物资消耗趋势
     * GET /production/input/trend
     * 按天/周/月统计物资消耗量和金额
     */

    /**
     * 导出物资使用记录
     * GET /production/input/export
     * 导出 Excel：包含物资名称、分类、规格、数量、单价、总价、塘口、时间等
     */

    /**
     * 批量录入物资使用记录
     * POST /production/input/batch
     * 一次性录入多条使用记录（如：一次投喂涉及多种饲料）
     */
}
