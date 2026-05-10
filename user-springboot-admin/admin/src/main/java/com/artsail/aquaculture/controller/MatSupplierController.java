package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.model.domain.MatSupplier;
import com.artsail.aquaculture.model.domain.Query.MatSupplierQuery;
import com.artsail.aquaculture.service.MatSupplierService;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/material/supplier")
public class MatSupplierController extends BaseController<MatSupplierService, MatSupplier, MatSupplier, MatSupplierQuery> {

    @Autowired
    private MatSupplierService matSupplierService;

    @Override
    public Result<Page<MatSupplier>> search(Page<MatSupplier> page, MatSupplierQuery query) {
        return Result.success(matSupplierService.search(page, query));
    }
}
