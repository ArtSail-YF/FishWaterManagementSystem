package com.artsail.compliance.service;

import com.artsail.compliance.model.domain.MedRecord;
import com.artsail.compliance.model.dto.MedRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface MedRecordService extends IService<MedRecord> {
    Page<MedRecord> search(Page<MedRecord> page, MedRecordQuery query);
}
