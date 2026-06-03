package com.artsail.env.service;

import com.artsail.env.mapper.EnvWeatherMapper;
import com.artsail.env.model.domain.EnvWeather;
import com.artsail.aquaculture.model.domain.BaseInfo;
import com.artsail.aquaculture.service.BaseInfoService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HefengWeatherService {

    @Value("${hefeng.api-key:}")
    private String apiKey;

    private final BaseInfoService baseInfoService;
    private final EnvWeatherMapper envWeatherMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 定时同步：每30分钟同步一次（需要启用 @EnableScheduling）
     */
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void syncAll() {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("和风天气 API Key 未配置，跳过同步");
            return;
        }
        List<BaseInfo> bases = baseInfoService.lambdaQuery()
                .eq(BaseInfo::getIsDelete, 0)
                .isNotNull(BaseInfo::getLatitude)
                .isNotNull(BaseInfo::getLongitude)
                .list();
        log.info("开始同步 {} 个基地的天气数据", bases.size());
        for (BaseInfo base : bases) {
            try {
                syncSingle(base);
            } catch (Exception e) {
                log.error("同步基地 {} 天气失败: {}", base.getId(), e.getMessage());
            }
        }
    }

    /**
     * 同步单个基地的天气
     */
    public void syncSingle(BaseInfo base) {
        String url = String.format(
            "https://devapi.qweather.com/v7/weather/now?location=%s,%s&key=%s",
            base.getLongitude(), base.getLatitude(), apiKey
        );
        var response = restTemplate.getForObject(url, Map.class);
        if (response == null || !"200".equals(String.valueOf(response.get("code")))) {
            log.warn("和风天气 API 返回异常: base={}, resp={}", base.getId(), response);
            return;
        }
        Map<String, Object> now = (Map<String, Object>) response.get("now");
        if (now == null) return;

        // 构造实体
        EnvWeather weather = new EnvWeather();
        weather.setBaseId(base.getId());
        weather.setUpdateTime(LocalDateTime.now());
        weather.setAirTemperature(parseDouble(now.get("temp")));
        weather.setHumidity(parseDouble(now.get("humidity")));
        weather.setWindSpeed(parseDouble(now.get("windSpeed")));
        weather.setWindDirection(String.valueOf(now.getOrDefault("windDir", "")));
        weather.setRainfall(parseDouble(now.getOrDefault("precip", "0")));
        weather.setWeatherCondition(String.valueOf(now.getOrDefault("text", "")));
        weather.setDataSource("和风天气");

        // UPSERT: 每个基地只保留一条最新记录
        var existing = envWeatherMapper.selectOne(
            new LambdaQueryWrapper<EnvWeather>().eq(EnvWeather::getBaseId, base.getId())
        );
        if (existing != null) {
            weather.setId(existing.getId());
            envWeatherMapper.updateById(weather);
        } else {
            envWeatherMapper.insert(weather);
        }
        log.info("同步基地 {} ({}) 天气: {}C, {}%, {}m/s",
            base.getId(), base.getBaseName(),
            weather.getAirTemperature(), weather.getHumidity(), weather.getWindSpeed());
    }

    /**
     * 手动触发同步（返回成功条数）
     */
    public int syncNow() {
        List<BaseInfo> bases = baseInfoService.lambdaQuery()
                .eq(BaseInfo::getIsDelete, 0)
                .isNotNull(BaseInfo::getLatitude)
                .isNotNull(BaseInfo::getLongitude)
                .list();
        int count = 0;
        for (BaseInfo base : bases) {
            try {
                syncSingle(base);
                count++;
            } catch (Exception e) {
                log.error("手动同步基地 {} 失败: {}", base.getId(), e.getMessage());
            }
        }
        return count;
    }

    private Double parseDouble(Object val) {
        if (val == null) return null;
        try {
            return Double.parseDouble(val.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}