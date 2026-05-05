package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.MatSupplierMapper;
import com.artsail.aquaculture.model.domain.MatSupplier;
import com.artsail.aquaculture.model.domain.Query.MatSupplierQuery;
import com.artsail.aquaculture.service.MatSupplierService;
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
public class MatSupplierServiceImpl extends ServiceImpl<MatSupplierMapper, MatSupplier> implements MatSupplierService {

    @Override
    public Page<MatSupplier> search(Page<MatSupplier> page, MatSupplierQuery query) {
        LambdaQueryWrapper<MatSupplier> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(StringUtils.isNotBlank(query.getSupplierCode()), MatSupplier::getSupplierCode, query.getSupplierCode())
               .like(StringUtils.isNotBlank(query.getSupplierName()), MatSupplier::getSupplierName, query.getSupplierName())
               .eq(StringUtils.isNotBlank(query.getContactPerson()), MatSupplier::getContactPerson, query.getContactPerson())
               .eq(StringUtils.isNotBlank(query.getPhone()), MatSupplier::getPhone, query.getPhone())
               .eq(query.getStatus() != null, MatSupplier::getStatus, query.getStatus())
               .orderByDesc(MatSupplier::getCreateTime);
        
        return this.page(page, wrapper);
    }
}
