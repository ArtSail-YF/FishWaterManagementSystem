package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdTaskMapper;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProdTaskServiceImpl extends ServiceImpl<ProdTaskMapper, ProdTask> implements ProdTaskService {

    @Override
    public Page<ProdTask> search(Page<ProdTask> page, ProdTaskQuery query) {
        LambdaQueryWrapper<ProdTask> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(query.getPlanId() != null, ProdTask::getPlanId, query.getPlanId())
               .eq(query.getBaseId() != null, ProdTask::getBaseId, query.getBaseId())
               .eq(StringUtils.isNotBlank(query.getTargetType()), ProdTask::getTargetType, query.getTargetType())
               .eq(query.getTargetId() != null, ProdTask::getTargetId, query.getTargetId())
               .eq(StringUtils.isNotBlank(query.getStatus()), ProdTask::getStatus, query.getStatus())
               .eq(query.getAssigneeId() != null, ProdTask::getAssigneeId, query.getAssigneeId())
               .orderByDesc(ProdTask::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
