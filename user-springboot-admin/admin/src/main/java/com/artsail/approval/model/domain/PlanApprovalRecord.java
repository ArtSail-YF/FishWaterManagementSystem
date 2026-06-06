package com.artsail.approval.model.domain;

import com.artsail.common.domain.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@TableName("plan_approval_record")
@EqualsAndHashCode(callSuper = true)
public class PlanApprovalRecord extends BaseEntity {
    private Long planId;
    private Long submitterId;
    private Long approverId;
    private String action;
    private String comment;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime actionTime;
}