package com.artsail.env.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 塘口水质快照（每个塘口一条）
 */
@Data
@TableName("env_wq")
public class EnvWq implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long pondId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;

    private Double dissolvedOxygen;

    private Double phValue;

    private Double waterTemperature;

    private Double ammoniaNitrogen;

    private Double nitrite;

    private Double turbidity;

    private Double salinity;

    private String dataSource;

    private Long lastOperatorId;

    private String doStatus;

    private String phStatus;

    @TableField(exist = false)
    private String pondName;

    @TableField(exist = false)
    private String baseName;
}
