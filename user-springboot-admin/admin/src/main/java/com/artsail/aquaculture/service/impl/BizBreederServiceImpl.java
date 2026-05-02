package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.mapper.BizBreederMapper;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.service.BizBreederService;
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
public class BizBreederServiceImpl extends ServiceImpl<BizBreederMapper, BizBreeder> implements BizBreederService {

    @Override
    public Page<BizBreeder> search(Page<BizBreeder> page, BreederQuery query) {
        LambdaQueryWrapper<BizBreeder> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.like(StringUtils.isNotBlank(query.getBreederCode()), BizBreeder::getBreederCode, query.getBreederCode())
               .like(StringUtils.isNotBlank(query.getBreederName()), BizBreeder::getBreederName, query.getBreederName())
               .like(StringUtils.isNotBlank(query.getLegalPerson()), BizBreeder::getLegalPerson, query.getLegalPerson())
               .like(StringUtils.isNotBlank(query.getPhone()), BizBreeder::getPhone, query.getPhone())
               .eq(query.getStatus() != null, BizBreeder::getStatus, query.getStatus())
               .orderByDesc(BizBreeder::getCreateTime);
        
        return this.page(page, wrapper);
    }
}

