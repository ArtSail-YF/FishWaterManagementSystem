-- 用药记录表
CREATE TABLE IF NOT EXISTS medication_record (
    id bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
    task_id bigint DEFAULT NULL COMMENT '关联任务ID',
    plan_id bigint DEFAULT NULL COMMENT '关联计划ID',
    base_id bigint DEFAULT NULL COMMENT '基地ID',
    target_type varchar(20) DEFAULT NULL COMMENT '目标类型(pond/cage/vsl)',
    target_id bigint DEFAULT NULL COMMENT '目标ID(塘口/网箱/工船)',
    drug_name varchar(100) DEFAULT NULL COMMENT '药物名称',
    dosage decimal(10,2) DEFAULT NULL COMMENT '用量',
    unit varchar(20) DEFAULT NULL COMMENT '单位(kg/ml/g/包)',
    method varchar(50) DEFAULT NULL COMMENT '用药方式(泼洒/拌饵/浸泡)',
    withdrawal_days int DEFAULT 0 COMMENT '休药期(天)',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用药记录';

-- 示例数据
INSERT INTO medication_record (task_id, plan_id, base_id, target_type, target_id, drug_name, dosage, unit, method, withdrawal_days, source, actual_worker_id, verify_status, remark, action_time) VALUES
(1, 1, 1, 'pond', 1, '聚维酮碘', 500.00, 'ml', '泼洒', 3, 'app', 2, 'auto', '1号塘常规消毒', '2026-05-18 09:00:00'),
(2, 1, 1, 'pond', 2, '恩诺沙星', 1000.00, 'g', '拌饵', 10, 'admin', 3, 'pending', '2号塘肠炎治疗', '2026-05-19 14:00:00'),
(3, 2, 1, 'pond', 3, '二氧化氯', 300.00, 'g', '泼洒', 2, 'app', 2, 'auto', '3号塘预防性消毒', '2026-05-20 10:00:00'),
(4, 2, 2, 'cage', 5, '氟苯尼考', 800.00, 'g', '拌饵', 15, 'app', 4, 'auto', '宁德大黄鱼烂鳃病治疗', '2026-05-22 08:00:00'),
(5, 3, 1, 'pond', 1, '大蒜素', 200.00, 'ml', '泼洒', 1, 'admin', 3, 'approved', '1号塘预防肠炎', '2026-05-25 07:30:00'),
(6, 3, 1, 'pond', 4, '维生素C', 100.00, 'g', '泼洒', 0, 'app', 2, 'auto', '4号塘抗应激处理', '2026-05-26 16:00:00');
