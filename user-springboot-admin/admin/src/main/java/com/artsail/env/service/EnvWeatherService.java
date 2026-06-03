package com.artsail.env.service;

import com.artsail.env.model.domain.EnvWeather;
import com.artsail.env.model.domain.EnvWeatherHist;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.Map;

public interface EnvWeatherService extends IService<EnvWeather> {
    List<EnvWeather> getAllWithNames();
    List<EnvWeatherHist> getHistory(Map<String, Object> params);
    List<Map<String, Object>> getWeatherSummary();
    Map<String, Object> getRealtimeByBase();
    Map<String, Object> getAdvice();
    Map<String, Object> getDisasterInfo();
}