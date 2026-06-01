package com.artsail.production.service.impl;

import com.artsail.production.mapper.HarvestRecordMapper;
import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.artsail.production.service.HarvestRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HarvestRecordServiceImpl extends ServiceImpl<HarvestRecordMapper, HarvestRecord> implements HarvestRecordService {

    private final HarvestRecordMapper harvestRecordMapper;

    @Override
    public Page<HarvestRecord> search(Page<HarvestRecord> page, HarvestRecordQuery query) {
        return harvestRecordMapper.searchWithNames(page, query);
    }
}
