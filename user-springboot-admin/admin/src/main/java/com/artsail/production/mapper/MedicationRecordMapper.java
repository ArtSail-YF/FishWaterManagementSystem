package com.artsail.production.mapper;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MedicationRecordMapper extends BaseMapper<MedicationRecord> {
    Page<MedicationRecord> searchWithNames(Page<MedicationRecord> page, @Param("query") MedicationRecordQuery query);
}
