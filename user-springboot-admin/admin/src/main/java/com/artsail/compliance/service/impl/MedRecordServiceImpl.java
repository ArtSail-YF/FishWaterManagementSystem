package com.artsail.compliance.service.impl;

import com.artsail.compliance.mapper.MedRecordMapper;
import com.artsail.compliance.model.domain.MedRecord;
import com.artsail.compliance.model.dto.MedRecordQuery;
import com.artsail.compliance.service.MedRecordService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedRecordServiceImpl extends ServiceImpl<MedRecordMapper, MedRecord> implements MedRecordService {

    private final MedRecordMapper mapper;

    @Override
    public Page<MedRecord> search(Page<MedRecord> page, MedRecordQuery query) {
        return mapper.searchWithNames(page, query);
    }
}
