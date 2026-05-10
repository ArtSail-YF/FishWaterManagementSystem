package com.artsail.production.mapper;

import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用药记录Mapper
 */
@Mapper
public interface MedicationRecordMapper extends BaseMapper<MedicationRecord> {

    /**
     * 分页查询用药记录（关联药品信息）
     */
    Page<MedicationRecord> selectMedicationRecordPage(
        @Param("page") Page<MedicationRecord> page,
        @Param("query") MedicationRecordQuery query
    );
}
