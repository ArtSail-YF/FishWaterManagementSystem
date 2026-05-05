package com.artsail.aquaculture.mapper;

import com.artsail.aquaculture.model.domain.MatInfo;
import com.artsail.aquaculture.model.domain.Query.MatInfoQuery;
import com.artsail.aquaculture.model.domain.VO.MatInfoVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MatInfoMapper extends BaseMapper<MatInfo> {
    
    /**
     * 多表关联查询物资信息（带分类名称和供应商名称）
     */
    Page<MatInfoVO> searchWithCategory(Page<MatInfoVO> page, @Param("query") MatInfoQuery query);
}
