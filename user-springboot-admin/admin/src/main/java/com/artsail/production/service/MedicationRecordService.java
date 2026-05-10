package com.artsail.production.service;

import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 用药记录Service
 */
public interface MedicationRecordService extends IService<MedicationRecord> {

    /**
     * 分页查询用药记录
     */
    Page<MedicationRecord> search(Page<MedicationRecord> page, MedicationRecordQuery query);
}
