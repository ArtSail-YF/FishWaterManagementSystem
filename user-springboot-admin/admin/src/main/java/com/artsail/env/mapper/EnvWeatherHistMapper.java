package com.artsail.env.mapper;

import com.artsail.env.model.domain.EnvWeatherHist;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface EnvWeatherHistMapper extends BaseMapper<EnvWeatherHist> {
    List<EnvWeatherHist> selectHistoryWithNames(Map<String, Object> params);
}