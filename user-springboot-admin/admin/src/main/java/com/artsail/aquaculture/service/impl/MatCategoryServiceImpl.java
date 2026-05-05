package com.artsail.aquaculture.service.impl;

import com.artsail.aquaculture.mapper.MatCategoryMapper;
import com.artsail.aquaculture.model.domain.MatCategory;
import com.artsail.aquaculture.model.domain.Query.MatCategoryQuery;
import com.artsail.aquaculture.service.MatCategoryService;
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
public class MatCategoryServiceImpl extends ServiceImpl<MatCategoryMapper, MatCategory> implements MatCategoryService {

    @Override
    public Page<MatCategory> search(Page<MatCategory> page, MatCategoryQuery query) {
        LambdaQueryWrapper<MatCategory> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(StringUtils.isNotBlank(query.getCatCode()), MatCategory::getCatCode, query.getCatCode())
               .like(StringUtils.isNotBlank(query.getCatName()), MatCategory::getCatName, query.getCatName())
               .eq(query.getParentId() != null, MatCategory::getParentId, query.getParentId())
               .eq(query.getStatus() != null, MatCategory::getStatus, query.getStatus())
               .orderByAsc(MatCategory::getSortOrder);
        
        return this.page(page, wrapper);
    }
}
