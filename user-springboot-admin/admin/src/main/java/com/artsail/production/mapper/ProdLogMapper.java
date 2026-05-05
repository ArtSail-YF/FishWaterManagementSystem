package com.artsail.production.mapper;

import com.artsail.production.model.domain.ProdLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProdLogMapper extends BaseMapper<ProdLog> {
}
