package com.artsail.production.mapper;

import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.model.domain.VO.ProdPlanVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 * 生产计划 Mapper
 */
@Mapper
public interface ProdPlanMapper extends BaseMapper<ProdPlan> {

    /**
     * 多表关联查询计划列表（带基地名称、目标名称）
     */
    Page<ProdPlanVO> searchWithNames(Page<ProdPlanVO> page, @Param("query") ProdPlanQuery query);

}
