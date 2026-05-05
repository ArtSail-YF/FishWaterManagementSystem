package com.artsail.aquaculture.mapper;

import com.artsail.aquaculture.model.domain.Pond;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.model.domain.VO.PondVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PondMapper extends BaseMapper<Pond> {
    
    /**
     * 多表关联查询塘口信息（带基地名称）
     */
    Page<PondVO> searchWithBase(Page<PondVO> page, @Param("query") PondQuery query);
}