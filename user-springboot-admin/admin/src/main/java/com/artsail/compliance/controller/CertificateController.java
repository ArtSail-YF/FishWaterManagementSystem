package com.artsail.compliance.controller;

import com.artsail.compliance.model.dto.CertificateApplyDTO;
import com.artsail.compliance.model.dto.CertificateVO;
import com.artsail.compliance.service.CertificateService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 合格证管理控制器
 */
@RestController
@RequestMapping("/certificate")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    /**
     * 申请生成合格证
     */
    @PostMapping("/apply")
    public Result<CertificateVO> apply(@RequestBody CertificateApplyDTO dto) {
        try {
            CertificateVO vo = certificateService.applyCertificate(dto);
            return Result.success("合格证生成成功", vo);
        } catch (RuntimeException e) {
            return Result.error(400, e.getMessage());
        }
    }

    /**
     * 获取合格证详情
     */
    @GetMapping("/{id}")
    public Result<CertificateVO> getDetail(@PathVariable Long id) {
        try {
            return Result.success(certificateService.getCertificateDetail(id));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    /**
     * 分页查询合格证列表
     */
    @GetMapping("/search")
    public Result<Page<Map<String, Object>>> search(@RequestParam(defaultValue = "1") long current,
                                                     @RequestParam(defaultValue = "20") long pageSize,
                                                     @RequestParam(required = false) String status) {
        Page<Map<String, Object>> page = new Page<>(current, pageSize);
        return Result.success(certificateService.searchCertificates(page, status));
    }

    /**
     * 合格证统计
     */
    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.success(certificateService.getCertificateStats());
    }

    /**
     * 合格证预览（返回完整结构化数据用于前端渲染卡片）
     */
    @GetMapping("/{id}/preview")
    public Result<CertificateVO> preview(@PathVariable Long id) {
        return getDetail(id);
    }
}
