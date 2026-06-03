package com.artsail.compliance.service;

import com.artsail.compliance.model.dto.ComplianceResult;
import com.artsail.compliance.model.dto.WithdrawalStatus;
import com.artsail.compliance.model.dto.WithdrawalDrugInfo;

import java.util.List;

/**
 * 合规校验服务
 * 核心业务：休药期检查、合格证发放资格判定
 */
public interface ComplianceService {

    /**
     * 判断塘口是否在休药期内（锁定状态）
     */
    boolean isPondWithdrawalLocked(Long pondId);

    /**
     * 获取塘口休药期详细状态
     */
    WithdrawalStatus getPondWithdrawalStatus(Long pondId);

    /**
     * 获取基地下所有塘口的休药期概览
     */
    List<WithdrawalStatus> getBaseWithdrawalSummary(Long baseId);

    /**
     * 检查合格证发放资格
     * @param pondId 塘口ID
     * @param strategyId 合格证策略ID
     * @param harvestRecordIds 关联的收获记录ID列表
     * @return 校验结果，passed=false时reasons包含不通过原因
     */
    ComplianceResult checkCertificateEligibility(Long pondId, Long strategyId, List<Long> harvestRecordIds);
}
