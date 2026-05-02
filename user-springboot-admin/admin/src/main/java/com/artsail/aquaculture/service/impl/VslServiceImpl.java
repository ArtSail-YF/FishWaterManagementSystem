package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.VslMapper;
import com.artsail.aquaculture.model.domain.Query.VslQuery;
import com.artsail.aquaculture.model.domain.Vsl;
import com.artsail.aquaculture.service.VslService;
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
public class VslServiceImpl extends ServiceImpl<VslMapper, Vsl> implements VslService {

    @Override
    public Page<Vsl> search(Page<Vsl> page, VslQuery query) {
        LambdaQueryWrapper<Vsl> wrapper = new LambdaQueryWrapper<>();
        
        // 动态构建查询条件
        wrapper.like(StringUtils.isNotBlank(query.getVslCode()), Vsl::getVslCode, query.getVslCode())
               .like(StringUtils.isNotBlank(query.getVslName()), Vsl::getVslName, query.getVslName())
               .eq(query.getBreederId() != null, Vsl::getBreederId, query.getBreederId())
               .like(StringUtils.isNotBlank(query.getMmsi()), Vsl::getMmsi, query.getMmsi())
               .like(StringUtils.isNotBlank(query.getRegistryPort()), Vsl::getRegistryPort, query.getRegistryPort())
               .eq(query.getStatus() != null, Vsl::getStatus, query.getStatus())
               .orderByDesc(Vsl::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
