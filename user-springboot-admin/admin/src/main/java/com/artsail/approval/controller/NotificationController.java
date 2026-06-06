package com.artsail.approval.controller;

import com.artsail.approval.model.domain.SysNotification;
import com.artsail.approval.service.NotificationService;
import com.artsail.common.domain.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 系统通知接口
 */
@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** 查询当前用户的未读通知 */
    @GetMapping("/unread/{userId}")
    public Result<List<SysNotification>> getUnreadNotifications(@PathVariable Long userId) {
        return Result.success(notificationService.getUnreadNotifications(userId));
    }

    /** 统计当前用户的未读通知数 */
    @GetMapping("/unread/count/{userId}")
    public Result<Map<String, Long>> countUnread(@PathVariable Long userId) {
        long count = notificationService.countUnread(userId);
        return Result.success(Map.of("count", count));
    }

    /** 标记通知为已读 */
    @PutMapping("/read/{id}")
    public Result<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Result.success();
    }

    /** 批量标记为已读 */
    @PutMapping("/read/batch")
    public Result<Void> markBatchAsRead(@RequestBody List<Long> ids) {
        ids.forEach(notificationService::markAsRead);
        return Result.success();
    }
}
