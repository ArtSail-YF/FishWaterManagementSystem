package com.artsail.production.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.ProdLog;
import com.artsail.production.model.domain.Query.ProdLogQuery;
import com.artsail.production.service.ProdLogService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/log")
@RequiredArgsConstructor
public class ProdLogController extends BaseAquacultureController<ProdLogService, ProdLog, ProdLog, ProdLogQuery> {

    private final ProdLogService prodLogService;

    @Override
    public Result<Page<ProdLog>> search(Page<ProdLog> page, ProdLogQuery query) {
        return Result.success(prodLogService.search(page, query));
    }
}
