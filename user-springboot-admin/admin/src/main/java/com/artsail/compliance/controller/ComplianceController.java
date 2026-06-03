package com.artsail.compliance.controller;

import com.artsail.compliance.model.dto.ComplianceResult;
import com.artsail.compliance.model.dto.WithdrawalStatus;
import com.artsail.compliance.service.ComplianceService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 合规校验控制器
 * 休药期查询、合格证资格校验
 */
@RestController
@RequestMapping("/compliance")
public class ComplianceController {

    @Autowired
    private ComplianceService complianceService;

    /**
     * 查询指定塘口当前休药期状态
     */
    @GetMapping("/withdrawal-status")
    public Result<WithdrawalStatus> getWithdrawalStatus(@RequestParam Long pondId) {
        return Result.success(complianceService.getPondWithdrawalStatus(pondId));
    }

    /**
     * 查询基地下所有塘口的休药期概览
     */
    @GetMapping("/withdrawal-summary")
    public Result<List<WithdrawalStatus>> getWithdrawalSummary(@RequestParam Long baseId) {
        return Result.success(complianceService.getBaseWithdrawalSummary(baseId));
    }

    /**
     * 检查合格证发放资格
     */
    @GetMapping("/check-cert-eligibility")
    public Result<ComplianceResult> checkCertEligibility(@RequestParam Long pondId,
                                                          @RequestParam Long strategyId,
                                                          @RequestParam(required = false) List<Long> harvestRecordIds) {
        return Result.success(complianceService.checkCertificateEligibility(pondId, strategyId, harvestRecordIds));
    }
}
