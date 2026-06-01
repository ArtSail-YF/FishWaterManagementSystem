package com.artsail.production.service;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
public interface MedicationRecordService extends IService<MedicationRecord> {
    Page<MedicationRecord> search(Page<MedicationRecord> page, MedicationRecordQuery query);
}
