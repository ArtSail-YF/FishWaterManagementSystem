package com.artsail.production.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 生产任务实体类
 */
@Data
@TableName("prod_task")
@EqualsAndHashCode(callSuper = true)
public class ProdTask extends LogicDeleteEntity {

    /**
     * 来源计划ID
     */
    private Long planId;

    /**
     * 所属基地ID
     */
    private Long baseId;

    /**
     * 任务标题
     */
    private String taskTitle;

    /**
     * 目标类型
     */
    private String targetType;

    /**
     * 目标ID
     */
    private Long targetId;

    /**
     * 要求执行的具体时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime actionTime;

    /**
     * 最晚完成时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime deadlineTime;

    /**
     * 状态: pending, assigned, doing, done, skipped, expired
     */
    private String status;

    /**
     * 具体执行工人ID
     */
    private Long assigneeId;

    /**
     * 取消/跳过原因
     */
    private String cancelReason;

    /**
     * 关联 IoT 设备ID
     */
    private Long deviceId;

    /**
     * IoT 设备操作指令: read/on/off/set
     */
    private String deviceAction;

    /**
     * 优先级: low/medium/high/urgent
     */
    private String priority;

    /** 饲料品种 */
    private String feedVariety;

    /** 投喂量(kg) */
    private java.math.BigDecimal feedAmount;

    /** 药品名称 */
    private String drugName;

    /** 用量 */
    private String dosage;

    /** 休药期天数 */
    private Integer withdrawalDays;

    /** 气象要求 */
    private String weatherReq;

    /**
     * 操作说明/详细描述（发布时从计划复制）
     */
    @TableField(exist = false)
    private String contentDesc;


}
