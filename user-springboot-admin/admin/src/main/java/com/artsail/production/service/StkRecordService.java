package com.artsail.production.service;

import com.artsail.production.model.domain.StkRecord;
import com.artsail.production.model.domain.Query.StkRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface StkRecordService extends IService<StkRecord> {
    Page<StkRecord> search(Page<StkRecord> page, StkRecordQuery query);
}
