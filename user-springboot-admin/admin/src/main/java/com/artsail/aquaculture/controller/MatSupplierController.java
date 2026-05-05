package com.artsail.aquaculture.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.aquaculture.model.domain.MatSupplier;
import com.artsail.aquaculture.model.domain.Query.MatSupplierQuery;
import com.artsail.aquaculture.service.MatSupplierService;
import com.artsail.common.domain.Result;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/material/supplier")
@RequiredArgsConstructor
public class MatSupplierController extends BaseAquacultureController<MatSupplierService, MatSupplier, MatSupplier, MatSupplierQuery> {

    private final MatSupplierService matSupplierService;

    @Override
    public Result<Page<MatSupplier>> search(Page<MatSupplier> page, MatSupplierQuery query) {
        return Result.success(matSupplierService.search(page, query));
    }
}
