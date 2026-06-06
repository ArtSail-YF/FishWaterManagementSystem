package com.artsail.approval.consumer;

import com.artsail.approval.service.NotificationService;
import com.artsail.production.mapper.ProdPlanMapper;
import com.artsail.production.model.domain.ProdPlan;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 计划审批结果消费者（日志服务）
 * 监听 plan.approval.result.queue，记录审批结果并通知提交人
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PlanApprovalResultConsumer {

    private final NotificationService notificationService;
    private final ProdPlanMapper prodPlanMapper;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "plan.approval.result.queue")
    public void handleApprovalResult(String message) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> msg = objectMapper.readValue(message, Map.class);
            Long planId = msg.get("planId") != null ? Long.valueOf(msg.get("planId").toString()) : null;
            Long approverId = msg.get("approverId") != null ? Long.valueOf(msg.get("approverId").toString()) : null;
            String action = (String) msg.getOrDefault("action", "");
            String comment = (String) msg.getOrDefault("comment", "");

            log.info("收到审批结果消息: planId={}, approverId={}, action={}, comment={}",
                    planId, approverId, action, comment);

            if (planId == null) {
                log.warn("审批结果消息缺少planId，跳过处理");
                return;
            }

            // 查询计划详情以获取标题和提交人
            ProdPlan plan = prodPlanMapper.selectById(planId);
            if (plan == null) {
                log.warn("审批结果消息关联的计划不存在: planId={}", planId);
                return;
            }

            String planTitle = plan.getTitle() != null ? plan.getTitle() : "";
            Long submitterId = plan.getOwnerId();

            if ("approve".equals(action)) {
                log.info("计划「{}」(ID={}) 已审批通过，审批人={}", planTitle, planId, approverId);
                // 通知提交人
                if (submitterId != null) {
                    notificationService.createNotification(
                            submitterId,
                            "审批通过",
                            "您的计划「" + planTitle + "」已通过审批",
                            "approval_result",
                            planId
                    );
                }
            } else if ("reject".equals(action)) {
                log.info("计划「{}」(ID={}) 被驳回，审批人={}，原因={}", planTitle, planId, approverId, comment);
                // 通知提交人
                if (submitterId != null) {
                    String content = "您的计划「" + planTitle + "」已被驳回";
                    if (comment != null && !comment.isEmpty()) {
                        content += "，原因：" + comment;
                    }
                    notificationService.createNotification(
                            submitterId,
                            "审批驳回",
                            content,
                            "approval_result",
                            planId
                    );
                }
            } else {
                log.warn("未知的审批动作: {}", action);
            }

        } catch (Exception e) {
            log.error("处理审批结果消息失败: message={}", message, e);
        }
    }
}