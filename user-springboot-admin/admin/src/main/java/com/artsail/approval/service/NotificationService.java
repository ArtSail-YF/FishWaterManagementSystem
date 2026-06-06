package com.artsail.approval.service;

import com.artsail.approval.mapper.SysNotificationMapper;
import com.artsail.approval.model.domain.SysNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 系统通知服务
 * 负责创建和查询站内通知
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SysNotificationMapper sysNotificationMapper;

    /** 创建通知 */
    public void createNotification(Long userId, String title, String content, String type, Long relatedId) {
        SysNotification notification = new SysNotification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setRelatedId(relatedId);
        notification.setIsRead(false);
        sysNotificationMapper.insert(notification);
        log.info("已创建通知: userId={}, title={}, type={}, relatedId={}", userId, title, type, relatedId);
    }

    /** 查询用户未读通知 */
    public List<SysNotification> getUnreadNotifications(Long userId) {
        return sysNotificationMapper.selectUnreadByUserId(userId);
    }

    /** 统计用户未读通知数 */
    public long countUnread(Long userId) {
        return sysNotificationMapper.countUnreadByUserId(userId);
    }

    /** 标记通知为已读 */
    public void markAsRead(Long id) {
        sysNotificationMapper.markAsRead(id);
    }
}
