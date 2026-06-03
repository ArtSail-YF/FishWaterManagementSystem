package com.artsail.env.mapper;

import com.artsail.env.model.domain.EnvWeather;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface EnvWeatherMapper extends BaseMapper<EnvWeather> {
    List<EnvWeather> selectAllWithNames();
}