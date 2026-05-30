package com.artsail.aquaculture.mapper;

import com.artsail.aquaculture.model.domain.BizBreeder;
import com.artsail.aquaculture.model.domain.Query.BreederQuery;
import com.artsail.aquaculture.model.domain.VO.BizBreederVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizBreederMapper extends BaseMapper<BizBreeder> {

    Page<BizBreederVO> searchWithNames(Page<BizBreederVO> page, @Param("query") BreederQuery query);

    void insertBreederPonds(@Param("breederId") Long breederId, @Param("pondIds") List<Long> pondIds);

    void deleteBreederPonds(@Param("breederId") Long breederId);
}
