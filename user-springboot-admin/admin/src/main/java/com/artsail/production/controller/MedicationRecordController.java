package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.artsail.production.service.MedicationRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用药记录管理控制器
 * 注：用药记录是生产日志的扩展，实际使用时需先创建 prod_log (log_type='medication')
 */
@RestController
@RequestMapping("/production/medication")
public class MedicationRecordController extends BaseController<MedicationRecordService, MedicationRecord, MedicationRecord, MedicationRecordQuery> {

    @Override
    public Result<Page<MedicationRecord>> search(Page<MedicationRecord> page, MedicationRecordQuery query) {
        return Result.success(baseService.search(page, query));
    }

    // ========== 待实现的业务方法 ==========

    /**
     * 新增用药记录（含关联 prod_log）
     * POST /production/medication/with-log
     * 1. 先创建 prod_log (log_type='medication')
     * 2. 获取 prod_log.id
     * 3. 创建 med_record (log_id = prod_log.id)
     * 4. 更新库存 (stk_record, stk_inventory)
     */

    /**
     * 查询用药记录详情（含关联药品信息、生产日志）
     * GET /production/medication/{id}/detail
     * 返回 VO 包含：用药记录 + 药品详情 + 塘口信息
     */

    /**
     * 查询塘口用药历史
     * GET /production/medication/pond/{pondId}/history
     * 按时间倒序返回该塘口所有用药记录
     */

    /**
     * 查询即将过休药期的记录
     * GET /production/medication/expiring-soon
     * 查询 ban_harvest_until <= 当前日期 + N 天的记录
     */

    /**
     * 审核用药记录
     * PUT /production/medication/{id}/verify
     * 更新 prod_log.verify_status 和 med_record 相关状态
     */



    /**
     * 导出用药记录
     * GET /production/medication/export
     * 导出 Excel：包含药品名称、用量、休药期、禁采日期等
     */

    /**
     * 批量录入用药记录
     * POST /production/medication/batch
     * 一次性录入多条用药记录（如：一次用药涉及多种药品）
     */

    /**
     * 统计指定塘口的用药成本
     * GET /production/medication/pond/{pondId}/cost
     * 汇总 usage_qty * mat_info.unit_price
     */


}
