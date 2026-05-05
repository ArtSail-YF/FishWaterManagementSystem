package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.MatCategory;
import com.artsail.aquaculture.model.domain.Query.MatCategoryQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface MatCategoryService extends IService<MatCategory> {
    Page<MatCategory> search(Page<MatCategory> page, MatCategoryQuery query);
}
