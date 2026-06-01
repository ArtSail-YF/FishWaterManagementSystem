package com.artsail.production.service.impl;
import com.artsail.production.mapper.MedicationRecordMapper;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.artsail.production.service.MedicationRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class MedicationRecordServiceImpl extends ServiceImpl<MedicationRecordMapper, MedicationRecord> implements MedicationRecordService {
    private final MedicationRecordMapper mapper;
    @Override
    public Page<MedicationRecord> search(Page<MedicationRecord> page, MedicationRecordQuery query) {
        return mapper.searchWithNames(page, query);
    }
}
