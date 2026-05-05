package com.artsail.production.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.service.ProdTaskService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class ProdTaskController extends BaseAquacultureController<ProdTaskService, ProdTask, ProdTask, ProdTaskQuery> {

    private final ProdTaskService prodTaskService;

    @Override
    public Result<Page<ProdTask>> search(Page<ProdTask> page, ProdTaskQuery query) {
        return Result.success(prodTaskService.search(page, query));
    }
}
