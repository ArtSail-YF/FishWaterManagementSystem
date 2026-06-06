package com.artsail.production.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;
import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.math.BigDecimal;

/**
 * 生产计划实体类
 */
@Data
@TableName("prod_plan")
@EqualsAndHashCode(callSuper = true)
public class ProdPlan extends LogicDeleteEntity {

    /**
     * 所属基地ID
     */
    private Long baseId;

    /**
     * 父计划ID
     */
    private Long parentPlanId;

    /**
     * 目标类型: pond(塘口), cage(网箱), vsl(工船)
     */
    private String targetType;

    /**
     * 目标实体ID
     */
    private Long targetId;

    /**
     * 类型: feeding(投喂), medication(用药), harvest(收获), maintenance(维护)
     */
    private String planType;

    /**
     * 计划标题
     */
    private String title;

    /**
     * 详细描述/操作指南
     */
    private String contentDesc;

    /**
     * 计划开始时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime startTime;

    /**
     * 计划结束时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime endTime;

    /**
     * 循环规则
     */
    private String cycleRule;

    /**
     * 状态: draft(草稿), published(已发布), active(执行中), completed(已完成), cancelled(已取消),
     * pending_approval(待审批), approved(已审批), rejected(已驳回)
     */
    private String status;

    /**
     * 制定人/管理员ID
     */
    private Long ownerId;

    /**
     * 指派给哪个班组/角色
     */
    private Long assigneeGroupId;

    /** ====== 审批相关字段 ====== */

    /**
     * 审批人ID
     */
    private Long approverId;

    /**
     * 审批意见
     */
    private String approveComment;

    /**
     * 审批时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime approveTime;

    /** 饲料品种 */
    private String feedVariety;
    /** 计划投喂量(kg) */
    private BigDecimal feedAmount;
    /** 药品名称 */
    private String drugName;
    /** 用量 */
    private String dosage;
    /** 休药期天数 */
    private Integer withdrawalDays;
    /** 气象要求 */
    private String weatherReq;
    /** 预计产量 */
    private BigDecimal estYield;
}
