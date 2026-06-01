package com.artsail.production.service.impl;
import com.artsail.production.mapper.FeedingRecordMapper;
import com.artsail.production.model.domain.FeedingRecord;
import com.artsail.production.model.domain.Query.FeedingRecordQuery;
import com.artsail.production.service.FeedingRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class FeedingRecordServiceImpl extends ServiceImpl<FeedingRecordMapper, FeedingRecord> implements FeedingRecordService {
    private final FeedingRecordMapper mapper;
    @Override
    public Page<FeedingRecord> search(Page<FeedingRecord> page, FeedingRecordQuery query) {
        return mapper.searchWithNames(page, query);
    }
}
