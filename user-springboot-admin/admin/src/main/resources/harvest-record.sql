-- 捕捞记录表
CREATE TABLE IF NOT EXISTS harvest_record (
    id bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
    record_no varchar(50) DEFAULT NULL COMMENT '记录编号',
    base_id bigint DEFAULT NULL COMMENT '基地ID',
    pond_id bigint DEFAULT NULL COMMENT '塘口ID',
    species varchar(50) DEFAULT NULL COMMENT '品种',
    weight decimal(10,2) DEFAULT NULL COMMENT '重量',
    unit varchar(10) DEFAULT 'kg' COMMENT '单位',
    method varchar(20) DEFAULT NULL COMMENT '捕捞方式',
    team_name varchar(50) DEFAULT NULL COMMENT '作业班组',
    operator_name varchar(50) DEFAULT NULL COMMENT '操作人',
    status varchar(20) DEFAULT 'completed' COMMENT '状态',
    remark varchar(500) DEFAULT NULL COMMENT '备注',
    harvest_time datetime DEFAULT NULL COMMENT '捕捞时间',
    create_time datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捕捞记录';

-- 示例数据
INSERT INTO harvest_record (record_no, base_id, pond_id, species, weight, unit, method, team_name, operator_name, status, remark, harvest_time) VALUES
('HR-001', 1, 1, '鲈鱼', 1500.00, 'kg', 'net', '捕捞一组', '张三', 'completed', '正常捕捞，鱼体健康', '2026-05-20 08:00:00'),
('HR-002', 1, 2, '石斑鱼', 800.00, 'kg', 'net', '捕捞二组', '李四', 'completed', '网箱捕捞，规格均匀', '2026-05-22 09:30:00'),
('HR-003', 1, 3, '南美白对虾', 500.00, 'kg', 'trap', '捕捞三组', '王五', 'in_progress', '虾塘捕捞中', '2026-06-01 06:00:00'),
('HR-004', 2, 5, '大黄鱼', 2000.00, 'kg', 'net', '宁德捕捞队', '赵六', 'planned', '深海网箱计划捕捞', '2026-06-05 07:00:00');