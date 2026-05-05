package com.artsail.aquaculture.service;

import com.artsail.aquaculture.model.domain.MatSupplier;
import com.artsail.aquaculture.model.domain.Query.MatSupplierQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface MatSupplierService extends IService<MatSupplier> {
    Page<MatSupplier> search(Page<MatSupplier> page, MatSupplierQuery query);
}
