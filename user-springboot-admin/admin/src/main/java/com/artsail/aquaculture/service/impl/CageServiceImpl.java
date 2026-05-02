package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.CageMapper;
import com.artsail.aquaculture.model.domain.Cage;
import com.artsail.aquaculture.model.domain.Query.CageQuery;
import com.artsail.aquaculture.service.CageService;
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
public class CageServiceImpl extends ServiceImpl<CageMapper, Cage> implements CageService {

    @Override
    public Page<Cage> search(Page<Cage> page, CageQuery query) {
        LambdaQueryWrapper<Cage> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.like(StringUtils.isNotBlank(query.getCageCode()), Cage::getCageCode, query.getCageCode())
               .like(StringUtils.isNotBlank(query.getCageName()), Cage::getCageName, query.getCageName())
               .eq(query.getBaseId() != null, Cage::getBaseId, query.getBaseId())
               .eq(query.getBreederId() != null, Cage::getBreederId, query.getBreederId())
               .like(StringUtils.isNotBlank(query.getSeaAreaName()), Cage::getSeaAreaName, query.getSeaAreaName())
               .eq(query.getStatus() != null, Cage::getStatus, query.getStatus())
               .eq(StringUtils.isNotBlank(query.getCageType()), Cage::getCageType, query.getCageType())
               .orderByDesc(Cage::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
