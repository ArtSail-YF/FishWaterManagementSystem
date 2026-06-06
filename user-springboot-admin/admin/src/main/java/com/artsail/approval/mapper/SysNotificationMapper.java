package com.artsail.approval.mapper;

import com.artsail.approval.model.domain.SysNotification;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface SysNotificationMapper extends BaseMapper<SysNotification> {

    /** 查询用户的未读通知 */
    @Select("SELECT * FROM sys_notification WHERE user_id = #{userId} AND is_read = 0 ORDER BY create_time DESC")
    List<SysNotification> selectUnreadByUserId(@Param("userId") Long userId);

    /** 统计用户的未读通知数 */
    @Select("SELECT COUNT(*) FROM sys_notification WHERE user_id = #{userId} AND is_read = 0")
    long countUnreadByUserId(@Param("userId") Long userId);

    /** 标记通知为已读 */
    @Update("UPDATE sys_notification SET is_read = 1 WHERE id = #{id}")
    int markAsRead(@Param("id") Long id);
}
