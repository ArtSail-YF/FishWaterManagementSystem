package com.artsail.production.controller;
import com.artsail.common.controller.BaseController;
import com.artsail.common.domain.Result;
import com.artsail.production.model.domain.FeedingRecord;
import com.artsail.production.model.domain.Query.FeedingRecordQuery;
import com.artsail.production.service.FeedingRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/feeding-record")
public class FeedingRecordController extends BaseController<FeedingRecordService, FeedingRecord, FeedingRecord, FeedingRecordQuery> {
    @Autowired private FeedingRecordService feedingRecordService;
    @Override
    public Result<Page<FeedingRecord>> search(Page<FeedingRecord> page, FeedingRecordQuery query) {
        return Result.success(feedingRecordService.search(page, query));
    }
}
