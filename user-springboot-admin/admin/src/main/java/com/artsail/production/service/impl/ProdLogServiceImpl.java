package com.artsail.production.service.impl;

import com.artsail.production.mapper.ProdLogMapper;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.artsail.production.service.ProdLogService;
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
public class ProdLogServiceImpl extends ServiceImpl<ProdLogMapper, ProdLog> implements ProdLogService {

    @Override
    public Page<ProdLog> search(Page<ProdLog> page, ProdLogQuery query) {
        LambdaQueryWrapper<ProdLog> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(query.getTaskId() != null, ProdLog::getTaskId, query.getTaskId())
               .eq(query.getPlanId() != null, ProdLog::getPlanId, query.getPlanId())
               .eq(query.getBaseId() != null, ProdLog::getBaseId, query.getBaseId())
               .eq(StringUtils.isNotBlank(query.getTargetType()), ProdLog::getTargetType, query.getTargetType())
               .eq(query.getTargetId() != null, ProdLog::getTargetId, query.getTargetId())
               .eq(StringUtils.isNotBlank(query.getLogType()), ProdLog::getLogType, query.getLogType())
               .eq(StringUtils.isNotBlank(query.getSource()), ProdLog::getSource, query.getSource())
               .orderByDesc(ProdLog::getActionTime);
        
        return this.page(page, wrapper);
    }
}
