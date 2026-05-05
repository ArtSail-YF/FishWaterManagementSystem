package com.artsail.production.controller;

import com.artsail.aquaculture.controller.base.BaseAquacultureController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.StkRecord;
import com.artsail.production.model.domain.Query.StkRecordQuery;
import com.artsail.production.service.StkRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stock/record")
@RequiredArgsConstructor
public class StkRecordController extends BaseAquacultureController<StkRecordService, StkRecord, StkRecord, StkRecordQuery> {

    private final StkRecordService stkRecordService;

    @Override
    public Result<Page<StkRecord>> search(Page<StkRecord> page, StkRecordQuery query) {
        return Result.success(stkRecordService.search(page, query));
    }
}
