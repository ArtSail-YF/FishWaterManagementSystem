package com.artsail.env.mapper;

import com.artsail.env.model.domain.EnvWq;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EnvWqMapper extends BaseMapper<EnvWq> {

    /**
     * 查询所有塘口水质，带塘口名称和基地名称
     */
    List<EnvWq> selectAllWithNames();
}
