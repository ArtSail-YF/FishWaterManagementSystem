package com.artsail.production.service.impl;

import com.artsail.production.mapper.MedicationRecordMapper;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.artsail.production.service.MedicationRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * 用药记录Service实现
 */
@Service
public class MedicationRecordServiceImpl extends ServiceImpl<MedicationRecordMapper, MedicationRecord> implements MedicationRecordService {

    @Override
    public Page<MedicationRecord> search(Page<MedicationRecord> page, MedicationRecordQuery query) {
        return baseMapper.selectMedicationRecordPage(page, query);
    }
}
