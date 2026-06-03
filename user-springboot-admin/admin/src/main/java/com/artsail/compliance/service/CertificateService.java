package com.artsail.compliance.service;

import com.artsail.compliance.model.domain.CertInfo;
import com.artsail.compliance.model.domain.CertStrategy;
import com.artsail.compliance.model.dto.CertificateApplyDTO;
import com.artsail.compliance.model.dto.CertificateVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.Map;

/**
 * 合格证服务
 */
public interface CertificateService {

    /**
     * 申请生成合格证
     * @return 生成成功后的合格证完整信息
     */
    CertificateVO applyCertificate(CertificateApplyDTO dto);

    /**
     * 获取合格证详情（含明细）
     */
    CertificateVO getCertificateDetail(Long id);

    /**
     * 分页查询合格证列表
     */
    Page<Map<String, Object>> searchCertificates(Page<?> page, String status);

    /**
     * 合格证统计
     */
    Map<String, Object> getCertificateStats();
}
