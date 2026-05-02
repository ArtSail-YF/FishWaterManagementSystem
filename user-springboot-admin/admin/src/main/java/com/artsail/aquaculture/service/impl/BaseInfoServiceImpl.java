package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.mapper.BaseInfoMapper;
import com.artsail.aquaculture.model.domain.Query.BaseQuery;
import com.artsail.aquaculture.service.BaseInfoService;
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
public class BaseInfoServiceImpl extends ServiceImpl<BaseInfoMapper, BaseInfo> implements BaseInfoService {

    @Override
    public Page<BaseInfo> search(Page<BaseInfo> page, BaseQuery query) {
        LambdaQueryWrapper<BaseInfo> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.like(StringUtils.isNotBlank(query.getBaseCode()), BaseInfo::getBaseCode, query.getBaseCode())
               .like(StringUtils.isNotBlank(query.getBaseName()), BaseInfo::getBaseName, query.getBaseName())
               .eq(query.getBreederId() != null, BaseInfo::getBreederId, query.getBreederId())
               .eq(query.getDeptId() != null, BaseInfo::getDeptId, query.getDeptId())
               .eq(query.getStatus() != null, BaseInfo::getStatus, query.getStatus())
               .like(StringUtils.isNotBlank(query.getAddress()), BaseInfo::getAddress, query.getAddress())
               .orderByDesc(BaseInfo::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
