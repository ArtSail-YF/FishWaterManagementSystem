package com.artsail.compliance.service.impl;

import com.artsail.compliance.mapper.CertDetailMapper;
import com.artsail.compliance.mapper.CertInfoMapper;
import com.artsail.compliance.mapper.CertStrategyMapper;
import com.artsail.compliance.mapper.MedRecordMapper;
import com.artsail.compliance.model.domain.CertDetail;
import com.artsail.compliance.model.domain.CertInfo;
import com.artsail.compliance.model.domain.CertStrategy;
import com.artsail.compliance.model.dto.CertificateApplyDTO;
import com.artsail.compliance.model.dto.CertificateVO;
import com.artsail.compliance.model.dto.ComplianceResult;
import com.artsail.compliance.service.CertificateService;
import com.artsail.compliance.service.ComplianceService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertInfoMapper certInfoMapper;
    private final CertDetailMapper certDetailMapper;
    private final CertStrategyMapper certStrategyMapper;
    private final ComplianceService complianceService;
    private final MedRecordMapper medRecordMapper;

    private static final Random RANDOM = new Random();

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CertificateVO applyCertificate(CertificateApplyDTO dto) {
        // 1. 合规校验
        ComplianceResult check = complianceService.checkCertificateEligibility(
                dto.getPondId(), dto.getStrategyId(), dto.getHarvestRecordIds());
        if (!check.isPassed()) {
            throw new RuntimeException(String.join("; ", check.getReasons()));
        }

        // 2. 检查B类策略要求检测报告
        if (dto.getStrategyId() != null && dto.getStrategyId() == 2) {
            if (dto.getTestReportUrl() == null || dto.getTestReportUrl().isEmpty()) {
                throw new RuntimeException("B类合格证需要上传检测报告");
            }
        }

        // 3. 获取策略信息
        CertStrategy strategy = certStrategyMapper.selectById(dto.getStrategyId());
        if (strategy == null) {
            throw new RuntimeException("合格证策略不存在");
        }

        // 4. 生成合格证编号
        String certNo = generateCertNo(dto.getStrategyId());

        // 5. 创建cert_info
        CertInfo certInfo = new CertInfo();
        certInfo.setCertNo(certNo);
        certInfo.setStrategyId(dto.getStrategyId());
        certInfo.setIssueDate(LocalDate.now());
        certInfo.setStatus("valid");
        certInfoMapper.insert(certInfo);

        // 6. 创建cert_detail
        CertDetail detail = new CertDetail();
        detail.setCertId(certInfo.getId());
        detail.setTargetType("pond");
        detail.setTargetId(dto.getPondId());
        detail.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : BigDecimal.ZERO);
        // 检查休药期状态
        boolean withdrawalPassed = !complianceService.isPondWithdrawalLocked(dto.getPondId());
        detail.setIsWithdrawalPassed(withdrawalPassed ? 1 : 0);
        detail.setIsTestPassed(dto.getTestReportUrl() != null ? 1 : 0);
        detail.setTestReportUrl(dto.getTestReportUrl());
        certDetailMapper.insert(detail);

        // 7. 组装返回VO
        return buildCertificateVO(certInfo, strategy, List.of(detail));
    }

    @Override
    public CertificateVO getCertificateDetail(Long id) {
        CertInfo certInfo = certInfoMapper.selectById(id);
        if (certInfo == null) {
            throw new RuntimeException("合格证不存在");
        }
        CertStrategy strategy = certStrategyMapper.selectById(certInfo.getStrategyId());
        return buildCertificateVO(certInfo, strategy, new ArrayList<>());
    }

    @Override
    public Page<Map<String, Object>> searchCertificates(Page<?> page, String status) {
        return certInfoMapper.searchWithStrategy(page, status);
    }

    @Override
    public Map<String, Object> getCertificateStats() {
        return certInfoMapper.selectCertificateStats();
    }

    // ========== 私有方法 ==========

    private String generateCertNo(Long strategyId) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String strategyPart = strategyId != null ? String.format("%02d", strategyId) : "00";
        String randomPart = String.format("%04d", RANDOM.nextInt(10000));
        return "CERT-" + datePart + "-" + strategyPart + "-" + randomPart;
    }

    private CertificateVO buildCertificateVO(CertInfo info, CertStrategy strategy, List<CertDetail> details) {
        CertificateVO vo = new CertificateVO();
        vo.setId(info.getId());
        vo.setCertNo(info.getCertNo());
        vo.setStrategyId(info.getStrategyId());
        vo.setStrategyName(strategy != null ? strategy.getStrategyName() : null);
        vo.setSpecType(strategy != null ? strategy.getSpecType() : null);
        vo.setIssueDate(info.getIssueDate());
        vo.setStatus(info.getStatus());

        List<CertificateVO.CertDetailVO> detailVOs = new ArrayList<>();
        for (CertDetail d : details) {
            CertificateVO.CertDetailVO dv = new CertificateVO.CertDetailVO();
            dv.setId(d.getId());
            dv.setTargetType(d.getTargetType());
            dv.setTargetId(d.getTargetId());
            dv.setQuantity(d.getQuantity());
            dv.setWithdrawalPassed(d.getIsWithdrawalPassed() == 1);
            dv.setTestPassed(d.getIsTestPassed() == 1);
            dv.setTestReportUrl(d.getTestReportUrl());
            detailVOs.add(dv);
        }
        vo.setDetails(detailVOs);
        return vo;
    }
}
