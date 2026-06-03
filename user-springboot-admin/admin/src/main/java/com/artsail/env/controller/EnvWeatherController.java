package com.artsail.env.controller;

import com.artsail.env.model.domain.EnvWeather;
import com.artsail.env.model.domain.EnvWeatherHist;
import com.artsail.env.service.EnvWeatherService;
import com.artsail.common.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/weather")
public class EnvWeatherController {

    @Autowired
    private EnvWeatherService envWeatherService;

    @GetMapping("/summary")
    public Result<List<Map<String, Object>>> summary() {
        return Result.success(envWeatherService.getWeatherSummary());
    }

    @GetMapping("/realtime")
    public Result<Map<String, Object>> realtime() {
        return Result.success(envWeatherService.getRealtimeByBase());
    }

    @GetMapping("/advice")
    public Result<Map<String, Object>> advice() {
        return Result.success(envWeatherService.getAdvice());
    }

    @GetMapping("/history")
    public Result<List<EnvWeatherHist>> history(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        if (baseId != null) params.put("baseId", baseId);
        if (startDate != null) params.put("startDate", startDate);
        if (endDate != null) params.put("endDate", endDate);
        return Result.success(envWeatherService.getHistory(params));
    }

    @GetMapping("/bases")
    public Result<List<EnvWeather>> bases() {
        return Result.success(envWeatherService.getAllWithNames());
    }

    @GetMapping("/disaster")
    public Result<Map<String, Object>> disaster() {
        return Result.success(envWeatherService.getDisasterInfo());
    }
}