package com.artsail.production.mapper;

import com.artsail.production.model.domain.ProdPlan;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 生产计划 Mapper
 */
@Mapper
public interface ProdPlanMapper extends BaseMapper<ProdPlan> {
}
