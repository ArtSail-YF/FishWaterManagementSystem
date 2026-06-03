package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.artsail.production.service.HarvestRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.artsail.compliance.service.ComplianceService;
import com.artsail.compliance.model.dto.WithdrawalStatus;

@RestController
@RequestMapping("/harvest-record")
public class HarvestRecordController extends BaseController<HarvestRecordService, HarvestRecord, HarvestRecord, HarvestRecordQuery> {

    @Autowired
    private HarvestRecordService harvestRecordService;

    @Autowired
    private ComplianceService complianceService;

    @Override
    public Result<Page<HarvestRecord>> search(Page<HarvestRecord> page, HarvestRecordQuery query) {
        return Result.success(harvestRecordService.search(page, query));
    }

    /**
     * 收获前合规校验：检查塘口是否在休药期内
     */
    @GetMapping("/check-compliance")
    public Result<WithdrawalStatus> checkCompliance(@RequestParam Long pondId) {
        WithdrawalStatus status = complianceService.getPondWithdrawalStatus(pondId);
        if (status.isLocked()) {
            return Result.error(400, "该塘口休药期未过（剩余 " + status.getRemainingDays() + " 天），禁止生成合格证");
        }
        return Result.success(status);
    }
}
