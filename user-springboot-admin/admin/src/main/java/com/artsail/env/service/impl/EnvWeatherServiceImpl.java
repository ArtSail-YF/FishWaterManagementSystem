package com.artsail.env.service.impl;

import com.artsail.env.mapper.EnvWeatherMapper;
import com.artsail.env.mapper.EnvWeatherHistMapper;
import com.artsail.env.model.domain.EnvWeather;
import com.artsail.env.model.domain.EnvWeatherHist;
import com.artsail.env.service.EnvWeatherService;
import com.artsail.aquaculture.service.BaseInfoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnvWeatherServiceImpl extends ServiceImpl<EnvWeatherMapper, EnvWeather> implements EnvWeatherService {

    private final EnvWeatherMapper envWeatherMapper;
    private final EnvWeatherHistMapper envWeatherHistMapper;
    private final BaseInfoService baseInfoService;

    @Override
    public List<EnvWeather> getAllWithNames() {
        return envWeatherMapper.selectAllWithNames();
    }

    @Override
    public List<EnvWeatherHist> getHistory(Map<String, Object> params) {
        return envWeatherHistMapper.selectHistoryWithNames(params);
    }

    @Override
    public List<Map<String, Object>> getWeatherSummary() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<EnvWeather> list = getAllWithNames();
        if (list.isEmpty()) {
            result.add(mapItem("气温", "25.0℃", "stable"));
            result.add(mapItem("湿度", "70%", "stable"));
            result.add(mapItem("风速", "3.0m/s", "stable"));
            return result;
        }
        double avgTemp = list.stream().mapToDouble(EnvWeather::getAirTemperature).average().orElse(25);
        double avgHum = list.stream().mapToDouble(EnvWeather::getHumidity).average().orElse(70);
        double avgWind = list.stream().mapToDouble(EnvWeather::getWindSpeed).average().orElse(3);
        double maxRain = list.stream().mapToDouble(EnvWeather::getRainfall).max().orElse(0);
        result.add(mapItem("气温", String.format("%.1f℃", avgTemp), avgTemp > 27 ? "up" : avgTemp < 22 ? "down" : "stable"));
        result.add(mapItem("湿度", String.format("%.0f%%", avgHum), avgHum > 80 ? "up" : avgHum < 60 ? "down" : "stable"));
        result.add(mapItem("风速", String.format("%.1fm/s", avgWind), avgWind > 5 ? "up" : "stable"));
        result.add(mapItem("降雨", String.format("%.1fmm", maxRain), maxRain > 0 ? "up" : "stable"));
        return result;
    }

    @Override
    public Map<String, Object> getRealtimeByBase() {
        List<EnvWeather> list = getAllWithNames();
        Map<String, Object> result = new LinkedHashMap<>();
        if (list.isEmpty()) {
            result.put("avgTemp", 25.0);
            result.put("maxWind", 3.0);
            result.put("status", "normal");
            result.put("humidity", 70);
            result.put("pressure", 1013);
            result.put("visibility", 10);
            result.put("weather", "晴");
            Map<String, Object> tide = new LinkedHashMap<>();
            tide.put("status", "rising");
            tide.put("height", 1.2);
            tide.put("nextHigh", "01:42:05");
            tide.put("nextLow", "07:58:30");
            result.put("tide", tide);
            return result;
        }
        double avgTemp = list.stream().mapToDouble(EnvWeather::getAirTemperature).average().orElse(25);
        double maxWind = list.stream().mapToDouble(EnvWeather::getWindSpeed).max().orElse(0);
        double avgHum = list.stream().mapToDouble(EnvWeather::getHumidity).average().orElse(70);
        result.put("avgTemp", Math.round(avgTemp * 10) / 10.0);
        result.put("maxWind", Math.round(maxWind * 10) / 10.0);
        result.put("status", maxWind > 8 ? "extreme" : "normal");
        result.put("humidity", (int) avgHum);
        result.put("pressure", 1013);
        result.put("visibility", 10);
        result.put("weather", list.get(0).getWeatherCondition());
        Map<String, Object> tide = new LinkedHashMap<>();
        tide.put("status", "rising");
        tide.put("height", 1.2);
        tide.put("nextHigh", "01:42:05");
        tide.put("nextLow", "07:58:30");
        result.put("tide", tide);
        return result;
    }

    @Override
    public Map<String, Object> getAdvice() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> indices = new ArrayList<>();
        indices.add(mapOf("出海指数", 4, "风浪适宜，适合出海"));
        indices.add(mapOf("换水指数", 3, "降雨概率小，可适当换水"));
        indices.add(mapOf("投喂指数", 4, "气温适宜，正常投喂"));
        result.put("indices", indices);

        List<Map<String, Object>> forecast = new ArrayList<>();
        forecast.add(mapOf("今天", "晴", false, "正常作业", "#52c41a"));
        forecast.add(mapOf("明天", "多云", false, "正常作业", "#52c41a"));
        forecast.add(mapOf("后天", "小雨", true, "注意降温准备", "#f5222d"));
        result.put("forecast", forecast);
        return result;
    }

    @Override
    public Map<String, Object> getDisasterInfo() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("name", "无");
        result.put("id", "");
        result.put("level", "无预警");
        result.put("maxWind", 0);
        result.put("speed", 0);
        result.put("pressure", 0);
        result.put("affectedBases", 0);
        result.put("highRiskAssets", "");
        return result;
    }

    private Map<String, Object> mapItem(String label, String value, String trend) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("label", label); m.put("value", value); m.put("trend", trend);
        return m;
    }

    private Map<String, Object> mapOf(String label, int value, String desc) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("label", label); m.put("value", value); m.put("desc", desc);
        return m;
    }

    private Map<String, Object> mapOf(String day, String weather, boolean isWarning, String advice, String color) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("day", day); m.put("weather", weather);
        m.put("isWarning", isWarning); m.put("advice", advice);
        m.put("color", color);
        return m;
    }
}