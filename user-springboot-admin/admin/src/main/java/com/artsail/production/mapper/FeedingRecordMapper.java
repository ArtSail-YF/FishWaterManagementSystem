package com.artsail.production.mapper;
import com.artsail.production.model.domain.FeedingRecord;
import com.artsail.production.model.domain.Query.FeedingRecordQuery;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FeedingRecordMapper extends BaseMapper<FeedingRecord> {
    Page<FeedingRecord> searchWithNames(Page<FeedingRecord> page, @Param("query") FeedingRecordQuery query);
}
