package com.artsail.production.service;

import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface HarvestRecordService extends IService<HarvestRecord> {
    Page<HarvestRecord> search(Page<HarvestRecord> page, HarvestRecordQuery query);
}
