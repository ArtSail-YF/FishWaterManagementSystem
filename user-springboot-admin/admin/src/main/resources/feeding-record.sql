-- 投喂记录表
CREATE TABLE IF NOT EXISTS feeding_record (
    id bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
    task_id bigint DEFAULT NULL COMMENT '关联任务ID',
    plan_id bigint DEFAULT NULL COMMENT '关联计划ID',
    base_id bigint DEFAULT NULL COMMENT '基地ID',
    target_type varchar(20) DEFAULT NULL COMMENT '目标类型(pond/cage/vsl)',
    target_id bigint DEFAULT NULL COMMENT '目标ID(塘口/网箱/工船)',
    quantity decimal(10,2) DEFAULT NULL COMMENT '投喂量',
    unit varchar(10) DEFAULT 'kg' COMMENT '单位',
    feed_type varchar(50) DEFAULT NULL COMMENT '饲料类型',
    source varchar(20) DEFAULT 'admin' COMMENT '来源(app/admin/system)',
    photo_urls varchar(2000) DEFAULT NULL COMMENT '照片URL(逗号分隔)',
    actual_worker_id bigint DEFAULT NULL COMMENT '实际执行人ID',
    verify_status varchar(20) DEFAULT 'auto' COMMENT '审核状态(auto/pending/approved/rejected)',
    remark varchar(500) DEFAULT NULL COMMENT '备注',
    action_time datetime DEFAULT NULL COMMENT '操作时间',
    create_time datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    KEY idx_base_id (base_id),
    KEY idx_target (target_type,target_id),
    KEY idx_action_time (action_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投喂记录';

-- 示例数据
INSERT INTO feeding_record (task_id, plan_id, base_id, target_type, target_id, quantity, unit, feed_type, source, actual_worker_id, verify_status, remark, action_time) VALUES
(1, 1, 1, 'pond', 1, 150.00, 'kg', '配合饲料', 'app', 2, 'auto', '1号塘常规投喂', '2026-05-20 08:00:00'),
(2, 1, 1, 'pond', 2, 200.00, 'kg', '膨化饲料', 'app', 2, 'auto', '2号塘鲈鱼投喂', '2026-05-20 16:30:00'),
(3, 2, 1, 'pond', 3, 120.00, 'kg', '虾料', 'admin', 3, 'pending', '对虾塘投喂', '2026-05-21 07:00:00'),
(4, 2, 2, 'cage', 5, 350.00, 'kg', '冰鲜杂鱼', 'app', 4, 'auto', '宁德大黄鱼投喂', '2026-05-22 08:30:00'),
(5, 3, 1, 'pond', 1, 160.00, 'kg', '配合饲料', 'app', 2, 'approved', '1号塘下午投喂', '2026-05-23 17:00:00'),
(6, 3, 1, 'pond', 4, 90.00, 'kg', '虾料', 'app', 3, 'auto', '4号塘南美白对虾投喂', '2026-05-24 06:30:00');
