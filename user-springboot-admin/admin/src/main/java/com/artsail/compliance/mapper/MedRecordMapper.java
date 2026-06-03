package com.artsail.compliance.mapper;

import com.artsail.compliance.model.domain.MedRecord;
import com.artsail.compliance.model.dto.MedRecordQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MedRecordMapper extends BaseMapper<MedRecord> {

    Page<MedRecord> searchWithNames(Page<MedRecord> page, @Param("query") MedRecordQuery query);

    /**
     * 查询指定塘口所有未过休药期的用药记录
     */
    List<MedRecord> selectActiveWithdrawals(@Param("pondId") Long pondId);

    /**
     * 查询指定塘口在指定日期后仍有休药期的记录
     */
    List<MedRecord> selectWithdrawalsAfter(@Param("pondId") Long pondId, @Param("date") java.time.LocalDate date);

    /**
     * 查询基地下所有塘口的休药期概览
     * 返回每个塘口最新的休药期信息
     */
    List<MedRecord> selectWithdrawalSummaryByBase(@Param("baseId") Long baseId);
}
