package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.PondMapper;
import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.service.PondService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PondServiceImpl extends ServiceImpl<PondMapper, Pond> implements PondService {

    @Override
    public Page<Pond> search(Page<Pond> page, PondQuery query) {
        LambdaQueryWrapper<Pond> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.like(StringUtils.isNotBlank(query.getPondCode()), Pond::getPondCode, query.getPondCode())
               .like(StringUtils.isNotBlank(query.getPondName()), Pond::getPondName, query.getPondName())
               .eq(query.getBaseId() != null, Pond::getBaseId, query.getBaseId())
               .eq(query.getStatus() != null, Pond::getStatus, query.getStatus())
               .like(StringUtils.isNotBlank(query.getCurrentSpecies()), Pond::getCurrentSpecies, query.getCurrentSpecies())
               .ge(query.getMinArea() != null, Pond::getArea, query.getMinArea())
               .le(query.getMaxArea() != null, Pond::getArea, query.getMaxArea())
               .orderByDesc(Pond::getCreateTime);
        
        return this.page(page, wrapper);
    }
}