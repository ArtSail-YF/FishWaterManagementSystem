package com.artsail.production.controller;

import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.artsail.production.service.HarvestRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/harvest-record")
public class HarvestRecordController extends BaseController<HarvestRecordService, HarvestRecord, HarvestRecord, HarvestRecordQuery> {

    @Autowired
    private HarvestRecordService harvestRecordService;

    @Override
    public Result<Page<HarvestRecord>> search(Page<HarvestRecord> page, HarvestRecordQuery query) {
        return Result.success(harvestRecordService.search(page, query));
    }
}
