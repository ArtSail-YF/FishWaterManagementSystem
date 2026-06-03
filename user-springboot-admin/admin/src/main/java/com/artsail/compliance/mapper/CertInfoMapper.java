package com.artsail.compliance.mapper;

import com.artsail.compliance.model.domain.CertInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface CertInfoMapper extends BaseMapper<CertInfo> {

    /**
     * 分页查询合格证（关联策略名称）
     */
    Page<Map<String, Object>> searchWithStrategy(Page<?> page, @Param("status") String status);

    /**
     * 合格证统计
     */
    Map<String, Object> selectCertificateStats();
}
