package com.artsail.approval.consumer;

import com.artsail.approval.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 计划审批请求消费者（通知服务）
 * 监听 plan.approval.request.queue，当有人提交审批时，通知审批人
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PlanApprovalRequestConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "plan.approval.request.queue")
    public void handleApprovalRequest(String message) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> msg = objectMapper.readValue(message, Map.class);
            Long planId = msg.get("planId") != null ? Long.valueOf(msg.get("planId").toString()) : null;
            Long submitterId = msg.get("submitterId") != null ? Long.valueOf(msg.get("submitterId").toString()) : null;
            Long approverId = msg.get("approverId") != null ? Long.valueOf(msg.get("approverId").toString()) : null;
            String planTitle = (String) msg.getOrDefault("planTitle", "");
            String planType = (String) msg.getOrDefault("planType", "");

            log.info("收到审批请求消息: planId={}, submitterId={}, approverId={}, title={}",
                    planId, submitterId, approverId, planTitle);

            // 通知审批人
            if (approverId != null && approverId > 0) {
                notificationService.createNotification(
                        approverId,
                        "审批提醒",
                        "您有一条待审批的计划「" + planTitle + "」，请及时处理",
                        "approval_request",
                        planId
                );
                log.info("已通知审批人: approverId={}, planId={}", approverId, planId);
            } else {
                log.warn("审批请求消息中无审批人ID，跳过通知: planId={}", planId);
            }

        } catch (Exception e) {
            log.error("处理审批请求消息失败: message={}", message, e);
        }
    }
}