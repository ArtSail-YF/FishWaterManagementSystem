package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdPlanMapper;
import com.artsail.production.model.domain.ProdPlan;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.service.ProdPlanService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
 * 生产计划服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProdPlanServiceImpl extends ServiceImpl<ProdPlanMapper, ProdPlan> implements ProdPlanService {

    @Override
    public Page<ProdPlan> search(Page<ProdPlan> page, ProdPlanQuery query) {
        LambdaQueryWrapper<ProdPlan> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.eq(query.getBaseId() != null, ProdPlan::getBaseId, query.getBaseId())
               .eq(StringUtils.isNotBlank(query.getTargetType()), ProdPlan::getTargetType, query.getTargetType())
               .eq(query.getTargetId() != null, ProdPlan::getTargetId, query.getTargetId())
               .eq(StringUtils.isNotBlank(query.getPlanType()), ProdPlan::getPlanType, query.getPlanType())
               .eq(StringUtils.isNotBlank(query.getStatus()), ProdPlan::getStatus, query.getStatus())
               .like(StringUtils.isNotBlank(query.getTitle()), ProdPlan::getTitle, query.getTitle())
               .orderByDesc(ProdPlan::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
