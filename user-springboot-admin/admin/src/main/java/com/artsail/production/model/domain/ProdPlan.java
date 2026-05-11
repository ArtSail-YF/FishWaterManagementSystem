package com.artsail.production.model.domain;

import com.artsail.aquaculture.model.domain.BaseEntity;
import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 生产计划实体类
 */
@Data
@TableName("prod_plan")
@EqualsAndHashCode(callSuper = true)
public class ProdPlan extends BaseEntity {

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
     * 状态: draft(草稿), published(已发布), active(进行中), completed(已完成), cancelled(已取消)
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

    /**
     * 是否删除: 0-正常, 1-已删除
     */
    @TableLogic
    private Integer isDelete;

    /**
     * 删除时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime deleteTime;
}

