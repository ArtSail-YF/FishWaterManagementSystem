


-- ============================================
-- 水产养殖管理系统 - 数据库建表脚本（修正版）
-- 修正问题：
-- 1. 分区表移除外键约束
-- 2. 调整建表顺序，确保外键引用的表先创建
-- 数据库版本: MySQL 8.0+
-- 创建时间: 2026-04-04
-- ============================================

-- ============================================
-- 一、用户权限模块
-- ============================================

create table user
(
    user_name     varchar(256)                       null comment '用户昵称',
    id            bigint auto_increment comment 'id'
        primary key,
    user_account  varchar(256)                       null comment '账号',
    avatar_url    varchar(1024)                      null comment '用户头像',
    gender        tinyint                            null comment '性别',
    user_password varchar(512)                       null comment '密码',
    phone         varchar(128)                       null comment '电话',
    email         varchar(512)                       null comment '邮箱',
    user_status   int      default 0                 not null comment '状态 0 - 正常',
    create_time   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    update_time   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    is_delete     tinyint  default 0                 not null comment '是否删除',
    user_role     int      default 0                 null comment '角色 : 0=普通用户, 1= 管理员 ,2 =VIP'
)
    comment '用户';




INSERT INTO `user` (`userAccount`, `username`, `userPassword`, `phone`, `email`, `userStatus`, `role`) VALUES
    ('admin', '超级管理员', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lqkkO8rK29KcLd2QG', '13800138000', 'admin@aquaculture.com', 1, 1);
