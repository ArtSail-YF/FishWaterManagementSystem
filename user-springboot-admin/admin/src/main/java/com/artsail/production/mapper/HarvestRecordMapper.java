package com.artsail.production.mapper;

import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface HarvestRecordMapper extends BaseMapper<HarvestRecord> {
    Page<HarvestRecord> searchWithNames(Page<HarvestRecord> page, @Param("query") HarvestRecordQuery query);
}
