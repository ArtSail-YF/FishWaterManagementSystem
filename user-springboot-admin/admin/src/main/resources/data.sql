-- ----------------------------
-- 1. 字典类型表数据 (sys_dict_type)
-- ----------------------------
INSERT INTO `sys_dict_type` (`id`, `dict_name`, `dict_type`, `status`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                     (1, '用户性别', 'sys_user_sex', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (2, '菜单状态', 'sys_show_hide', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (3, '系统开关', 'sys_normal_disable', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (4, '任务状态', 'sys_job_status', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (5, '任务分组', 'sys_job_group', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (6, '系统是否', 'sys_yes_no', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (7, '通知类型', 'sys_notice_type', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (8, '操作类型', 'sys_oper_type', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (9, '系统状态', 'sys_common_status', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (10, '养殖状态', 'pond_status', 1, NOW(), NOW(), 0, NULL),
                                                                                                                                     (11, '网箱类型', 'cage_type', 1, NOW(), NOW(), 0, NULL),
-- 修复点：这里给 status 加上了反引号
                                                                                                                                     (12, '告警级别', 'warn_severity', 1, NOW(), NOW(), 0, NULL);

-- ----------------------------
-- 2. 字典数据表数据 (sys_dict_data)
-- ----------------------------
-- 用户性别 (sys_user_sex)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (1, '男', '0', 'sys_user_sex', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (2, '女', '1', 'sys_user_sex', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (3, '未知', '2', 'sys_user_sex', 1, 1, NOW(), 0, NULL);

-- 菜单状态 (sys_show_hide)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (4, '显示', '0', 'sys_show_hide', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (5, '隐藏', '1', 'sys_show_hide', 1, 1, NOW(), 0, NULL);

-- 系统开关 (sys_normal_disable)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (6, '正常', '0', 'sys_normal_disable', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (7, '停用', '1', 'sys_normal_disable', 1, 1, NOW(), 0, NULL);

-- 任务状态 (sys_job_status)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (8, '正常', '0', 'sys_job_status', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (9, '暂停', '1', 'sys_job_status', 1, 1, NOW(), 0, NULL);

-- 任务分组 (sys_job_group)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (10, '系统', 'DEFAULT', 'sys_job_group', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (11, '全链', 'QUANLIAN', 'sys_job_group', 1, 1, NOW(), 0, NULL);

-- 系统是否 (sys_yes_no)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (12, '是', 'Y', 'sys_yes_no', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (13, '否', 'N', 'sys_yes_no', 1, 1, NOW(), 0, NULL);

-- 通知类型 (sys_notice_type)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (14, '通知', '1', 'sys_notice_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (15, '公告', '2', 'sys_notice_type', 1, 1, NOW(), 0, NULL);

-- 操作类型 (sys_oper_type)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (16, '其它', '0', 'sys_oper_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (17, '新增', '1', 'sys_oper_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (18, '修改', '2', 'sys_oper_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (19, '删除', '3', 'sys_oper_type', 1, 1, NOW(), 0, NULL);

-- 系统状态 (sys_common_status)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (20, '成功', '0', 'sys_common_status', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (21, '失败', '1', 'sys_common_status', 1, 1, NOW(), 0, NULL);

-- 塘口/养殖状态 (pond_status)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (22, '养殖中', '1', 'pond_status', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (23, '空闲', '2', 'pond_status', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (24, '废弃', '0', 'pond_status', 1, 1, NOW(), 0, NULL);

-- 网箱类型 (cage_type)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (25, '重力式', 'gravity', 'cage_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (26, '张力腿', 'tension_leg', 'cage_type', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (27, '升降式', 'submersible', 'cage_type', 1, 1, NOW(), 0, NULL);

-- 告警级别 (warn_severity)
INSERT INTO `sys_dict_data` (`id`, `dict_label`, `dict_value`, `dict_type`, `sort_order`, `status`, `create_time`, `is_delete`, `delete_time`) VALUES
                                                                                                                                                   (28, '低', 'low', 'warn_severity', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (29, '中', 'medium', 'warn_severity', 1, 1, NOW(), 0, NULL),
                                                                                                                                                   (30, '高', 'high', 'warn_severity', 1, 1, NOW(), 0, NULL);


-- 先插入养殖户，确保 ID 1001 存在
INSERT INTO `biz_breeder` (
    `id`, `breeder_code`, `breeder_name`, `legal_person`,
    `phone`, `email`, `id_card`, `status`
) VALUES (
             1001, 'BREEDER_001', '陈大海', '陈大海',
             '13800138000', 'chen@example.com', '35010119800101001X', 1
         );



-- 开启事务，确保数据一致性
START TRANSACTION;

-- ----------------------------
-- 1. 部门基础数据 (sys_dept)
-- ----------------------------
-- 解决 base_info 中 dept_id 的外键约束
INSERT INTO `sys_dept` (`id`, `dept_name`, `dept_code`, `status`, `create_time`, `update_time`)
VALUES
    (101, '厦门示范基地管理部', 'DEPT_XM', 1, NOW(), NOW()),
    (102, '宁德深海养殖运营部', 'DEPT_ND', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `dept_name` = VALUES(`dept_name`);


-- ----------------------------
-- 3. 基地基础档案数据 (base_info)
-- ----------------------------
-- 依赖：dept_id (101, 102) 和 breeder_id (1001) 必须已存在
INSERT INTO `base_info` (
    `id`, `base_code`, `base_name`, `breeder_id`, `dept_id`,
    `address`, `longitude`, `latitude`,
    `total_area`, `water_area`,
    `water_source`, `water_quality_grade`,
    `soil_type`, `ph_value`,
    `power_supply`, `transformer_capacity`,
    `road_condition`, `drainage_system`,
    `is_pollution_free`, `taiwan_cooperation`,
    `deep_sea_certified`,
    `status`, `create_time`, `update_time`,
    `is_delete`, `delete_time`
) VALUES
-- 基地 1: 厦门 (归属部门 101)
(1, 'BASE_XM2026', '厦门蓝海现代渔业示范基地', 1001, 101,
 '福建省厦门市翔安区大嶝街道', 118.2654321, 24.5678901,
 500.00, 420.50,
 '海水', '一类',
 '泥沙质', 7.8,
 '双回路供电', 500,
 '硬化沥青路直达', '生态化三级过滤系统',
 1, 0,
 0,
 1, '2026-05-03 08:00:00', '2026-05-03 08:00:00',
 0, NULL),

-- 基地 2: 宁德 (归属部门 102)
(2, 'BASE_ND2026', '宁德三都澳深海大黄鱼产业园', 1001, 102,
 '福建省宁德市蕉城区三都镇海域', 119.7543210, 26.5812345,
 1200.00, 1150.00,
 '深海海水', '一类',
 '深海沉积物', 8.1,
 '海上风力发电+柴油发电机', 800,
 '快艇接驳', '深海自循环系统',
 1, 1,
 1,
 1, '2026-05-03 09:00:00', '2026-05-03 09:00:00',
 0, NULL)
ON DUPLICATE KEY UPDATE `base_name` = VALUES(`base_name`);


-- 补充更新 ID=1 (厦门基地) 的缺失字段
UPDATE `base_info`
SET
    `green_certification` = '绿色食品认证 A 级',
    `certification_img` = '/upload/cert/xm_green_2025.jpg',
    `sea_area_license` = '国海证 101002026001 号',
    `environmental_assessment` = '厦环审 [2025] 056 号',
    `remark` = '厦门市级现代农业产业园，重点发展石斑鱼工厂化养殖',
    `update_time` = '2026-05-04 00:10:00'
WHERE `id` = 1;

-- 补充更新 ID=2 (宁德基地) 的缺失字段
UPDATE `base_info`
SET
    `green_certification` = '有机产品认证',
    `certification_img` = '/upload/cert/nd_organic_2025.jpg',
    `sea_area_license` = '国海证 102002026008 号',
    `environmental_assessment` = '闽环审 [2025] 112 号',
    `remark` = '国家级海洋牧场示范区，配备 5G 网络覆盖',
    `update_time` = '2026-05-04 00:10:00'
WHERE `id` = 2;
-- ----------------------------
-- 4. 塘口基础档案数据 (pond_info) - 厦门基地
-- ----------------------------
-- 依赖：base_id (1) 必须已存在
INSERT INTO `pond_info` (
    `id`, `pond_code`, `pond_name`, `base_id`,
    `area`, `depth_avg`, `depth_max`,
    `shape_type`, `bottom_type`,
    `inlet_count`, `outlet_count`,
    `aeration_type`, `aeration_count`, `aeration_power`,
    `has_circulating`, `has_monitoring`,
    `current_species`, `stocking_date`,
    `estimated_output`,
    `status`, `create_time`, `update_time`,
    `is_delete`, `delete_time`
) VALUES
      (1, 'POND_XM_001', '1号鲍鱼育苗车间', 1, 5.00, 1.50, 2.00, '矩形', '混凝土', 2, 2, '纯氧微孔', 10, 15.5, 1, 1, '皱纹盘鲍', '2026-04-01', 5000.00, 1, '2026-05-03 08:10:00', '2026-05-03 08:10:00', 0, NULL),
      (2, 'POND_XM_002', '2号石斑鱼高位池', 1, 20.00, 2.50, 3.00, '圆形', '铺膜', 1, 1, '叶轮式', 4, 12.0, 1, 1, '东星斑', '2026-03-15', 15000.00, 1, '2026-05-03 08:10:00', '2026-05-03 08:10:00', 0, NULL),
      (3, 'POND_XM_003', '3号南美白对虾塘', 1, 100.00, 1.80, 2.20, '不规则', '泥沙', 3, 3, '水车式', 6, 18.0, 0, 1, '南美白对虾', '2026-04-20', 50000.00, 1, '2026-05-03 08:10:00', '2026-05-03 08:10:00', 0, NULL),
      (4, 'POND_XM_004', '4号螠蛏滩涂', 1, 295.50, 0.50, 1.00, '不规则', '沙质', 0, 0, '自然潮汐', 0, 0.0, 0, 0, '螠蛏', '2025-11-01', 100000.00, 1, '2026-05-03 08:10:00', '2026-05-03 08:10:00', 0, NULL)
ON DUPLICATE KEY UPDATE `pond_name` = VALUES(`pond_name`);

-- ----------------------------
-- 5. 塘口基础档案数据 (pond_info) - 宁德基地
-- ----------------------------
-- 依赖：base_id (2) 必须已存在
INSERT INTO `pond_info` (
    `id`, `pond_code`, `pond_name`, `base_id`,
    `area`, `depth_avg`, `depth_max`,
    `shape_type`, `bottom_type`,
    `inlet_count`, `outlet_count`,
    `aeration_type`, `aeration_count`, `aeration_power`,
    `has_circulating`, `has_monitoring`,
    `current_species`, `stocking_date`,
    `estimated_output`,
    `status`, `create_time`, `update_time`,
    `is_delete`, `delete_time`
) VALUES
      (5, 'POND_ND_001', '1号深海抗风浪网箱', 2, 800.00, 8.00, 12.00, '圆形', 'HDPE浮筒', 0, 0, '底部微孔增氧', 20, 25.0, 1, 1, '大黄鱼', '2026-02-15', 200000.00, 1, '2026-05-03 09:10:00', '2026-05-03 09:10:00', 0, NULL),
      (6, 'POND_ND_002', '2号金鲳鱼养殖区', 2, 600.00, 7.50, 10.00, '多边形', '尼龙网衣', 0, 0, '水车式(浮动)', 8, 15.0, 0, 1, '金鲳鱼', '2026-03-01', 120000.00, 1, '2026-05-03 09:10:00', '2026-05-03 09:10:00', 0, NULL),
      (7, 'POND_ND_003', '3号黑鮶深水网箱', 2, 500.00, 9.00, 13.00, '圆形', '钢制框架', 0, 0, '纯氧锥', 4, 10.0, 1, 1, '黑鮶', '2026-01-10', 80000.00, 1, '2026-05-03 09:10:00', '2026-05-03 09:10:00', 0, NULL),
      (8, 'POND_ND_004', '岸基苗种暂养池A', 2, 50.00, 2.00, 2.50, '矩形', '混凝土', 2, 2, '罗茨风机', 4, 5.5, 1, 1, '大黄鱼苗', '2026-04-25', 5000.00, 1, '2026-05-03 09:10:00', '2026-05-03 09:10:00', 0, NULL)
ON DUPLICATE KEY UPDATE `pond_name` = VALUES(`pond_name`);

-- 提交事务
COMMIT;



-- 插入 网箱 (Cage) 数据
-- 场景：2026年5月3日，厦门近海，大黄鱼养殖
INSERT INTO `cage_info` (
    `cage_code`, `cage_name`, `breeder_id`, `base_id`,
    `longitude`, `latitude`, `sea_area_name`, `water_depth`,
    `cage_type`, `shape`, `volume`, `net_bag_depth`,
    `material`, `status`, `create_time`
) VALUES (
             'CAGE-XM-202605',          -- 网箱编码
             '厦门深海一号网箱',         -- 网箱名称
             1001,                          -- 归属主体ID (厦门海洋渔业集团)
             1,                         -- 挂靠基地ID
             118.123456,                 -- 经度 (厦门海域典型经度)
             24.456789,                  -- 纬度 (厦门海域典型纬度)
             '台湾海峡西部',             -- 所在海域
             30.5,                       -- 水深 30.5米
             '升降式',                   -- 类型 (应对台风季)
             '圆形',                     -- 形状
             15000.00,                   -- 养殖水体 1.5万立方米
             15.00,                      -- 网衣深度 15米
             'HDPE',                     -- 材质
             1,                          -- 状态：1-正常
             '2026-05-03 08:00:00'       -- 创建时间 (今日早晨)
         );


-- 插入 船舶 (VSL) 数据
-- 场景：2026年5月3日，养殖工船在厦门港锚泊
INSERT INTO `vsl_info` (
    `vsl_code`, `vsl_name`, `breeder_id`, `mmsi`,
    `registry_port`, `length_overall`, `width`,
    `breeding_volume`, `production_capacity`,
    `engine_power`, `max_speed`, `has_processing`,
    `status`, `create_time`
) VALUES (
             'VSL-XM-001',               -- 船舶编号
             '国信先锋号',               -- 船名
             1001,                          -- 归属主体ID
             '412999888',                -- MMSI码 (模拟数据)
             '厦门',                     -- 船籍港
             249.90,                     -- 总长 249.9米
             40.00,                      -- 型宽 40米
             80000.00,                   -- 养殖水体 8万立方米
             3000.00,                    -- 年产能力 3000吨
             6800,                       -- 主机功率 6800kw
             15.0,                       -- 航速 15节
             1,                          -- 是否有加工车间：1-是
             2,                          -- 状态：2-锚泊 (今日停靠厦门)
             '2026-05-03 12:00:00'       -- 记录时间 (今日中午)
         );




INSERT INTO prod_plan (base_id, parent_plan_id, target_type, target_id, plan_type, title, content_desc, start_time, end_time, cycle_rule, status, owner_id, assignee_group_id) VALUES
                                                                                                                                                                                   (1, NULL, 'pond', 101, 'feeding', '5月常规投喂计划', '每日早晚各一次，根据天气调整投喂量', '2026-05-05 06:00:00', '2026-05-31 20:00:00', 'Every Day', 'active', 1001, 201),
                                                                                                                                                                                   (1, NULL, 'cage', 205, 'medication', '网箱杀菌消毒专项', '使用二氧化氯进行水体消毒，注意佩戴手套', '2026-05-06 08:00:00', '2026-05-06 12:00:00', NULL, 'published', 1001, 202),
                                                                                                                                                                                   (2, NULL, 'vsl', 301, 'maintenance', '工船发电机月度维保', '检查机油液位，更换空气滤芯', '2026-05-10 09:00:00', '2026-05-10 17:00:00', NULL, 'draft', 1002, 203),
                                                                                                                                                                                   (1, 1, 'pond', 102, 'feeding', '102号塘加餐计划', '针对生长较快的鱼群增加10%投喂量', '2026-05-07 07:00:00', '2026-05-07 18:00:00', NULL, 'completed', 1001, 201),
                                                                                                                                                                                   (2, NULL, 'pond', 105, 'harvest', '成鱼捕捞上市计划', '准备捕捞网具，联系运输车辆', '2026-05-15 04:00:00', '2026-05-15 10:00:00', NULL, 'cancelled', 1002, 201);


INSERT INTO prod_task (plan_id, base_id, task_title, target_type, target_id, action_time, deadline_time, status, assignee_id, cancel_reason) VALUES
                                                                                                                                                 (1, 1, '101号塘早间投喂', 'pond', 101, '2026-05-05 07:00:00', '2026-05-05 09:00:00', 'done', 5001, NULL),
                                                                                                                                                 (1, 1, '101号塘晚间投喂', 'pond', 101, '2026-05-05 17:00:00', '2026-05-05 19:00:00', 'assigned', 5002, NULL),
                                                                                                                                                 (2, 1, '205号网箱消毒作业', 'cage', 205, '2026-05-06 08:30:00', '2026-05-06 11:30:00', 'pending', 5003, NULL),
                                                                                                                                                 (3, 2, '301工船发电机维保', 'vsl', 301, '2026-05-10 09:00:00', '2026-05-10 16:00:00', 'doing', 5004, NULL),
                                                                                                                                                 (5, 2, '105号塘捕捞作业', 'pond', 105, '2026-05-15 05:00:00', '2026-05-15 09:00:00', 'expired', 5001, '因台风天气取消');


INSERT INTO prod_log (task_id, plan_id, base_id, target_type, target_id, log_type, action_time, quantity, photo_urls, gps_lat, gps_lng, source, created_by, actual_worker_id, is_backfilled, backfill_reason, verify_status) VALUES
                                                                                                                                                                                                                                 (1, 1, 1, 'pond', 101, 'feeding', '2026-05-05 07:15:00', 50.5, '/upload/2026/05/feed_01.jpg,/upload/2026/05/feed_02.jpg', 24.567890, 118.123456, 'app', 5001, 5001, 0, NULL, 'auto'),
                                                                                                                                                                                                                                 (1, 1, 1, 'pond', 101, 'feeding', '2026-05-05 17:30:00', 48.0, '/upload/2026/05/feed_evening.jpg', 24.567895, 118.123460, 'app', 5002, 5002, 1, '忘记打卡，下班前补录', 'pending'),
                                                                                                                                                                                                                                 (2, 1, 1, 'pond', 101, 'water_check', '2026-05-05 08:00:00', NULL, '/upload/2026/05/water_quality.jpg', 24.567892, 118.123458, 'admin', 1001, 5001, 0, NULL, 'auto'),
                                                                                                                                                                                                                                 (4, 3, 2, 'vsl', 301, 'maintenance', '2026-05-10 10:30:00', 5.0, '/upload/2026/05/generator_oil.jpg', 25.123456, 119.765432, 'app', 5004, 5004, 0, NULL, 'auto');


INSERT INTO prod_plan_detail (plan_id, feed_amount, feed_variety, drug_name, dosage, withdrawal_days, longitude, latitude, weather_req, est_yield) VALUES
                                                                                                                                                       (1, 1200.00, '深海石斑鱼专用饲料', NULL, NULL, NULL, 118.123456, 24.567890, '风力<4级', 50000.00),
                                                                                                                                                       (2, NULL, NULL, '二氧化氯', '200g/亩', 7, 118.125000, 24.569000, '晴天无雨', NULL),
                                                                                                                                                       (5, 200.00, '配合饲料', NULL, NULL, NULL, 119.760000, 25.120000, '无特殊要求', 12000.00);


-- 1.1 捕捞计划
INSERT INTO prod_plan (base_id, target_type, target_id, plan_type, title, content_desc, start_time, end_time, status, owner_id, assignee_group_id) VALUES
    (1, 'pond', 103, 'harvest', '103号塘成鱼上市捕捞', '联系收购商王老板，规格大于1kg的挑出来高价卖', '2026-05-20 04:00:00', '2026-05-20 12:00:00', 'published', 1001, 201);

-- 1.2 捕捞任务
INSERT INTO prod_task (plan_id, base_id, task_title, target_type, target_id, action_time, deadline_time, status, assignee_id) VALUES
    (3, 1, '103号塘拉网捕捞', 'pond', 103, '2026-05-20 05:00:00', '2026-05-20 10:00:00', 'assigned', 5001);

-- 假设 ID=3 是刚才插入的日志
INSERT INTO prod_log (task_id, plan_id, base_id, target_type, target_id, log_type, action_time, quantity, photo_urls, gps_lat, gps_lng, source, created_by, actual_worker_id, water_temp, device_id, extra_cost, bio_change_type, bio_quantity, avg_weight) VALUES
    (3, 3, 1, 'pond', 103, 'harvest', '2026-05-20 08:30:00', 2500.0, '/photos/harvest_103.jpg', 24.567000, 118.123000, 'app', 5001, 5001, 24.0, 'IMEI_888888', 500.0, 'output', 2500.0, 1.2);


-- 假设 mat_id=4 是恩诺沙星(粉剂)，mat_id=5 是聚维酮碘(液体)


-- 2.1 治疗计划
INSERT INTO prod_plan (base_id, target_type, target_id, plan_type, title, content_desc, start_time, end_time, status, owner_id, assignee_group_id) VALUES
    (1, 'pond', 104, 'medication', '104号塘出血病综合治疗', '连续3天，内服恩诺沙星，外泼聚维酮碘', '2026-05-21 08:00:00', '2026-05-23 18:00:00', 'published', 1001, 202);

-- 2.2 第一天治疗任务
INSERT INTO prod_task (plan_id, base_id, task_title, target_type, target_id, action_time, deadline_time, status, assignee_id) VALUES
    (4, 1, '104号塘投药(第1天)', 'pond', 104, '2026-05-21 09:00:00', '2026-05-21 11:00:00', 'assigned', 5002);



-- 假设 ID=4 是刚才插入的日志
INSERT INTO prod_log (task_id, plan_id, base_id, target_type, target_id, log_type, action_time, quantity, photo_urls, gps_lat, gps_lng, source, created_by, actual_worker_id, water_temp, dissolved_oxygen, device_id) VALUES
    (4, 4, 1, 'pond', 104, 'medication', '2026-05-21 09:30:00', 0, '/photos/drug_mix.jpg', 24.568000, 118.124000, 'app', 5002, 5002, 28.5, 3.2, 'IMEI_999999');


-- 消耗药品A
INSERT INTO stk_usage (usage_no, base_id, pond_id, task_id, mat_id, use_qty, unit_price, total_price, operator_id, use_time, log_id) VALUES
    ('USE_DRUG_A_001', 1, 104, 4, 4, 0.5, 120.0, 60.0, 5002, '2026-05-21 09:30:00', 4);

-- 消耗药品B
INSERT INTO stk_usage (usage_no, base_id, pond_id, task_id, mat_id, use_qty, unit_price, total_price, operator_id, use_time, log_id) VALUES
    ('USE_DRUG_B_001', 1, 104, 4, 5, 2.0, 45.0, 90.0, 5002, '2026-05-21 09:30:00', 4);



-- 记录药品A的休药期 (假设恩诺沙星休药期较长，设为500度日或固定天数)
INSERT INTO med_record (base_id, pond_id, drug_mat_id, usage_qty, admin_date, withdrawal_days, ban_harvest_until,
                        log_id, create_time)
VALUES (1, 104, 4, 0.5, '2026-05-21', 14, '2026-06-04', 4, NOW());

-- 记录药品B的休药期 (聚维酮碘通常较短，设为5天)
INSERT INTO med_record (base_id, pond_id, drug_mat_id, usage_qty, admin_date, withdrawal_days, ban_harvest_until,
                        log_id, create_time)
VALUES (1, 104, 5, 2.0, '2026-05-21', 5, '2026-05-26', 4, NOW());