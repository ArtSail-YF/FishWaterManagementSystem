package com.artsail.approval.model.domain;

import com.artsail.common.domain.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统通知实体
 */
@Data
@TableName("sys_notification")
@EqualsAndHashCode(callSuper = true)
public class SysNotification extends BaseEntity {

    /** 接收用户ID */
    private Long userId;

    /** 通知标题 */
    private String title;

    /** 通知内容 */
    private String content;

    /** 通知类型: approval_request-审批提醒 approval_result-审批结果 */
    private String type;

    /** 关联业务ID(如planId) */
    private Long relatedId;

    /** 是否已读: 0-未读 1-已读 */
    private Boolean isRead;
}
