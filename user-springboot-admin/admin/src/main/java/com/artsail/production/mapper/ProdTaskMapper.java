package com.artsail.production.mapper;

import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.model.domain.VO.ProdTaskVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProdTaskMapper extends BaseMapper<ProdTask> {

    /**
     * 多表关联查询任务列表（带基地名称、目标名称）
     */
    Page<ProdTaskVO> searchWithNames(Page<ProdTaskVO> page, @Param("query") ProdTaskQuery query);
}
