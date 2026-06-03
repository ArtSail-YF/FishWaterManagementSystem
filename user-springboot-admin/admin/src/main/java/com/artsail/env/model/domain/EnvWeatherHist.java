package com.artsail.env.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@TableName("env_weather_hist")
public class EnvWeatherHist implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId(type = IdType.AUTO) private Long id;
    private Long baseId;
    private LocalDate statDate;
    private Double maxTemp;
    private Double minTemp;
    private Double totalRainfall;
    private Double maxWindSpeed;
    @TableField(exist = false) private String baseName;
}