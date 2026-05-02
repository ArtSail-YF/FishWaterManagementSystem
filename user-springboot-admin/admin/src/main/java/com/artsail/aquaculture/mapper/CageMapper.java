package com.artsail.aquaculture.mapper;

import com.artsail.aquaculture.model.domain.Cage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CageMapper extends BaseMapper<Cage> {
}
