package com.artsail.env.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("env_weather")
public class EnvWeather implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long baseId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;

    private Double airTemperature;
    private Double humidity;
    private Double windSpeed;
    private String windDirection;
    private Double rainfall;
    private String weatherCondition;
    private String dataSource;
    private Long lastOperatorId;

    @TableField(exist = false)
    private String baseName;
}