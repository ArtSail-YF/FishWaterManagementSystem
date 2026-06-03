package com.artsail.compliance.service.impl;

import com.artsail.compliance.mapper.MedRecordMapper;
import com.artsail.compliance.model.domain.MedRecord;
import com.artsail.compliance.model.dto.ComplianceResult;
import com.artsail.compliance.model.dto.WithdrawalDrugInfo;
import com.artsail.compliance.model.dto.WithdrawalStatus;
import com.artsail.compliance.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 合规校验服务实现
 * 核心逻辑：休药期校验、合格证发放资格判定
 */
@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl implements ComplianceService {

    private final MedRecordMapper medRecordMapper;

    @Override
    public boolean isPondWithdrawalLocked(Long pondId) {
        LocalDate today = LocalDate.now();
        List<MedRecord> activeRecords = medRecordMapper.selectWithdrawalsAfter(pondId, today);
        return !activeRecords.isEmpty();
    }

    @Override
    public WithdrawalStatus getPondWithdrawalStatus(Long pondId) {
        WithdrawalStatus status = new WithdrawalStatus();
        status.setPondId(pondId);

        LocalDate today = LocalDate.now();
        List<MedRecord> activeRecords = medRecordMapper.selectWithdrawalsAfter(pondId, today);

        if (activeRecords.isEmpty()) {
            status.setLocked(false);
            status.setRemainingDays(0);
            status.setLockedUntil(null);
            status.setRelatedDrugs(new ArrayList<>());
            return status;
        }

        // 取最晚的休药期截止日作为锁定截止日
        MedRecord latest = activeRecords.stream()
                .max(Comparator.comparing(MedRecord::getBanHarvestUntil))
                .orElse(activeRecords.get(0));

        status.setPondName(latest.getPondName());
        status.setLocked(true);
        status.setLockedUntil(latest.getBanHarvestUntil());
        status.setRemainingDays(ChronoUnit.DAYS.between(today, latest.getBanHarvestUntil()));

        List<WithdrawalDrugInfo> drugs = activeRecords.stream().map(r -> {
            WithdrawalDrugInfo info = new WithdrawalDrugInfo();
            info.setDrugName(r.getMedicineName());
            info.setAdminDate(r.getAdminDate());
            info.setWithdrawalDays(r.getWithdrawalDays());
            info.setBanHarvestUntil(r.getBanHarvestUntil());
            return info;
        }).collect(Collectors.toList());
        status.setRelatedDrugs(drugs);

        return status;
    }

    @Override
    public List<WithdrawalStatus> getBaseWithdrawalSummary(Long baseId) {
        List<MedRecord> records = medRecordMapper.selectWithdrawalSummaryByBase(baseId);

        // 按pondId分组，取每个塘口最新的休药期记录
        Map<Long, List<MedRecord>> grouped = records.stream()
                .collect(Collectors.groupingBy(MedRecord::getPondId));

        List<WithdrawalStatus> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Map.Entry<Long, List<MedRecord>> entry : grouped.entrySet()) {
            WithdrawalStatus ws = new WithdrawalStatus();
            ws.setPondId(entry.getKey());

            List<MedRecord> pondRecords = entry.getValue();
            MedRecord latest = pondRecords.stream()
                    .max(Comparator.comparing(MedRecord::getBanHarvestUntil))
                    .orElse(pondRecords.get(0));

            ws.setPondName(latest.getPondName());
            ws.setLocked(true);
            ws.setLockedUntil(latest.getBanHarvestUntil());
            ws.setRemainingDays(ChronoUnit.DAYS.between(today, latest.getBanHarvestUntil()));

            List<WithdrawalDrugInfo> drugs = pondRecords.stream().map(r -> {
                WithdrawalDrugInfo info = new WithdrawalDrugInfo();
                info.setDrugName(r.getMedicineName());
                info.setAdminDate(r.getAdminDate());
                info.setWithdrawalDays(r.getWithdrawalDays());
                info.setBanHarvestUntil(r.getBanHarvestUntil());
                return info;
            }).collect(Collectors.toList());
            ws.setRelatedDrugs(drugs);

            result.add(ws);
        }

        return result;
    }

    @Override
    public ComplianceResult checkCertificateEligibility(Long pondId, Long strategyId, List<Long> harvestRecordIds) {
        List<String> reasons = new ArrayList<>();

        // 1. 检查休药期
        LocalDate today = LocalDate.now();
        List<MedRecord> activeRecords = medRecordMapper.selectWithdrawalsAfter(pondId, today);
        if (!activeRecords.isEmpty()) {
            MedRecord latest = activeRecords.stream()
                    .max(Comparator.comparing(MedRecord::getBanHarvestUntil))
                    .orElse(activeRecords.get(0));
            long remainingDays = ChronoUnit.DAYS.between(today, latest.getBanHarvestUntil());
            reasons.add("该塘口休药期未过（剩余 " + remainingDays + " 天），截止日期：" + latest.getBanHarvestUntil()
                    + "，涉及药品：" + activeRecords.get(0).getMedicineName());
        }

        // 2. 检查策略要求（仅B类需要检测报告）
        // 策略ID=2 为B类（检测合格），需要检测报告
        if (strategyId != null && strategyId == 2) {
            // 本阶段，前端传入的testReportUrl在CertificateApplyDTO中
            // 如果调用方没有提供检测报告URL，这里标记为缺少
            // 实际检测报告的检查在Controller层完成
        }

        if (reasons.isEmpty()) {
            return new ComplianceResult(true, reasons);
        }
        return new ComplianceResult(false, reasons);
    }
}
