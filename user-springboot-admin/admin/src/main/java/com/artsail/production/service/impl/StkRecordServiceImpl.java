package com.artsail.production.service.impl;

import com.artsail.production.mapper.StkRecordMapper;
import com.artsail.production.model.domain.StkRecord;
import com.artsail.production.model.domain.Query.StkRecordQuery;
import com.artsail.production.service.StkRecordService;
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
public class StkRecordServiceImpl extends ServiceImpl<StkRecordMapper, StkRecord> implements StkRecordService {

    @Override
    public Page<StkRecord> search(Page<StkRecord> page, StkRecordQuery query) {
        LambdaQueryWrapper<StkRecord> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(StringUtils.isNotBlank(query.getRecordNo()), StkRecord::getRecordNo, query.getRecordNo())
               .eq(query.getBaseId() != null, StkRecord::getBaseId, query.getBaseId())
               .eq(query.getMatId() != null, StkRecord::getMatId, query.getMatId())
               .eq(StringUtils.isNotBlank(query.getBatchNo()), StkRecord::getBatchNo, query.getBatchNo())
               .eq(StringUtils.isNotBlank(query.getType()), StkRecord::getType, query.getType())
               .eq(query.getOperatorId() != null, StkRecord::getOperatorId, query.getOperatorId())
               .orderByDesc(StkRecord::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
