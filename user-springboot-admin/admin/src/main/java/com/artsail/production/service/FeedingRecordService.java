package com.artsail.production.service;
import com.artsail.production.model.domain.FeedingRecord;
import com.artsail.production.model.domain.Query.FeedingRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
public interface FeedingRecordService extends IService<FeedingRecord> {
    Page<FeedingRecord> search(Page<FeedingRecord> page, FeedingRecordQuery query);
}
