package com.artsail.production.mapper;

import com.artsail.production.model.domain.StkUsage;
import com.artsail.production.model.domain.Query.StkUsageQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 物资使用记录 Mapper
 */
@Mapper
public interface StkUsageMapper extends BaseMapper<StkUsage> {

    /**
     * 分页查询物资使用记录（多表关联）
     */
    Page<StkUsage> selectStkUsagePage(@Param("page") Page<StkUsage> page, @Param("query") StkUsageQuery query);
}
