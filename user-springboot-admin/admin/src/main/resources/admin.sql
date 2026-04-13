


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



-- 1.2 养殖户备案表
CREATE TABLE `breeder_registration` (
                                        `id` VARCHAR(32) NOT NULL COMMENT '备案编号',
                                        `user_id` BIGINT NOT NULL COMMENT '关联用户ID',
                                        `company_name` VARCHAR(200) NOT NULL COMMENT '企业/合作社名称',
                                        `legal_representative` VARCHAR(50) NOT NULL COMMENT '法定代表人',
                                        `business_license` VARCHAR(100) NOT NULL COMMENT '营业执照编号',
                                        `business_license_image` VARCHAR(255) DEFAULT NULL COMMENT '营业执照图片',
                                        `registration_date` DATE NOT NULL COMMENT '备案日期',
                                        `address` VARCHAR(200) DEFAULT NULL COMMENT '详细地址',
                                        `business_scope` TEXT COMMENT '经营范围',
                                        `status` VARCHAR(10) DEFAULT 'pending' COMMENT '状态: pending-待审核, approved-已通过, rejected-已拒绝',
                                        `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
                                        `audit_user_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
                                        `audit_remark` TEXT COMMENT '审核备注',
                                        `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                        `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                        PRIMARY KEY (`id`),
                                        KEY `idx_user_id` (`user_id`),
                                        KEY `idx_company_name` (`company_name`),
                                        KEY `idx_status` (`status`),
                                        CONSTRAINT `fk_br_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `fk_br_audit_user` FOREIGN KEY (`audit_user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='养殖户备案表';

-- ============================================
-- 二、基础信息模块
-- ============================================

-- 2.1 养殖基地表
CREATE TABLE `base` (
                        `id` VARCHAR(32) NOT NULL COMMENT '基地编号',
                        `name` VARCHAR(100) NOT NULL COMMENT '基地名称',
                        `address` VARCHAR(200) NOT NULL COMMENT '详细地址',
                        `area` DECIMAL(10,2) NOT NULL COMMENT '占地面积（亩）',
                        `manager` VARCHAR(50) NOT NULL COMMENT '负责人',
                        `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
                        `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
                        `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
                        `description` TEXT COMMENT '基地描述',
                        `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态: active-启用, inactive-禁用',
                        `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                        `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                        PRIMARY KEY (`id`),
                        KEY `idx_name` (`name`),
                        KEY `idx_manager` (`manager`),
                        KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='养殖基地表';

-- 2.2 塘口信息表
CREATE TABLE `pond` (
                        `id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                        `base_id` VARCHAR(32) NOT NULL COMMENT '所属基地编号',
                        `name` VARCHAR(100) NOT NULL COMMENT '塘口名称',
                        `area` DECIMAL(10,2) NOT NULL COMMENT '塘口面积（亩）',
                        `depth` DECIMAL(5,2) DEFAULT NULL COMMENT '平均水深（米）',
                        `water_source` VARCHAR(50) DEFAULT NULL COMMENT '水源类型: river-河水, well-井水, reservoir-水库',
                        `shape` VARCHAR(20) DEFAULT NULL COMMENT '塘口形状: rectangle-矩形, circle-圆形, irregular-不规则',
                        `bottom_type` VARCHAR(20) DEFAULT NULL COMMENT '塘底类型: mud-泥底, sand-沙底, concrete-水泥底',
                        `stocking_capacity` DECIMAL(10,2) DEFAULT NULL COMMENT '放养容量（尾/亩）',
                        `description` TEXT COMMENT '塘口描述',
                        `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态: active-启用, inactive-禁用',
                        `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                        `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                        PRIMARY KEY (`id`),
                        KEY `idx_base_id` (`base_id`),
                        KEY `idx_name` (`name`),
                        KEY `idx_status` (`status`),
                        CONSTRAINT `fk_pond_base` FOREIGN KEY (`base_id`) REFERENCES `base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='塘口信息表';

-- ============================================
-- 三、物资管理模块（调整顺序，先创建被引用的表）
-- ============================================

-- 3.1 物资分类表
CREATE TABLE `material_category` (
                                     `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类编号',
                                     `code` VARCHAR(20) NOT NULL COMMENT '分类代码',
                                     `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
                                     `parent_id` INT DEFAULT 0 COMMENT '父级分类编号',
                                     `level` INT DEFAULT 1 COMMENT '层级',
                                     `description` TEXT COMMENT '描述',
                                     `sort_order` INT DEFAULT 0 COMMENT '排序',
                                     `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态: active-启用, inactive-禁用',
                                     `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                     `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                     PRIMARY KEY (`id`),
                                     KEY `idx_code` (`code`),
                                     KEY `idx_parent_id` (`parent_id`),
                                     KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物资分类表';

-- 3.2 供应商表
CREATE TABLE `supplier` (
                            `id` VARCHAR(32) NOT NULL COMMENT '供应商编号',
                            `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
                            `category` VARCHAR(50) DEFAULT NULL COMMENT '供应商类别: feed-饲料, medicine-药品, equipment-设备',
                            `contact_person` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
                            `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
                            `email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
                            `address` VARCHAR(200) DEFAULT NULL COMMENT '详细地址',
                            `business_license` VARCHAR(100) DEFAULT NULL COMMENT '营业执照编号',
                            `qualification_certificate` VARCHAR(255) DEFAULT NULL COMMENT '资质证书',
                            `credit_rating` VARCHAR(10) DEFAULT NULL COMMENT '信用等级: A-优秀, B-良好, C-一般',
                            `cooperation_status` VARCHAR(10) DEFAULT 'active' COMMENT '合作状态: active-合作中, suspended-暂停, terminated-终止',
                            `description` TEXT COMMENT '描述',
                            `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态: active-启用, inactive-禁用',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            PRIMARY KEY (`id`),
                            KEY `idx_name` (`name`),
                            KEY `idx_category` (`category`),
                            KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- 3.3 物资信息表
CREATE TABLE `material` (
                            `id` VARCHAR(32) NOT NULL COMMENT '物资编号',
                            `category_id` INT NOT NULL COMMENT '分类编号',
                            `supplier_id` VARCHAR(32) DEFAULT NULL COMMENT '供应商编号',
                            `name` VARCHAR(100) NOT NULL COMMENT '物资名称',
                            `specification` VARCHAR(100) DEFAULT NULL COMMENT '规格型号',
                            `unit` VARCHAR(20) NOT NULL COMMENT '单位',
                            `stock_quantity` DECIMAL(10,2) DEFAULT 0 COMMENT '库存数量',
                            `min_stock` DECIMAL(10,2) DEFAULT 0 COMMENT '最低库存',
                            `max_stock` DECIMAL(10,2) DEFAULT 0 COMMENT '最高库存',
                            `purchase_price` DECIMAL(10,2) DEFAULT NULL COMMENT '采购价格',
                            `retail_price` DECIMAL(10,2) DEFAULT NULL COMMENT '零售价格',
                            `brand` VARCHAR(100) DEFAULT NULL COMMENT '品牌',
                            `manufacturer` VARCHAR(200) DEFAULT NULL COMMENT '生产厂家',
                            `production_date` DATE DEFAULT NULL COMMENT '生产日期',
                            `expiry_date` DATE DEFAULT NULL COMMENT '有效期至',
                            `approval_no` VARCHAR(100) DEFAULT NULL COMMENT '批准文号',
                            `certificate_no` VARCHAR(100) DEFAULT NULL COMMENT '证书编号',
                            `storage_condition` VARCHAR(100) DEFAULT NULL COMMENT '储存条件',
                            `description` TEXT COMMENT '描述',
                            `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态: active-启用, inactive-禁用',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            PRIMARY KEY (`id`),
                            KEY `idx_category_id` (`category_id`),
                            KEY `idx_supplier_id` (`supplier_id`),
                            KEY `idx_name` (`name`),
                            KEY `idx_status` (`status`),
                            CONSTRAINT `fk_material_category` FOREIGN KEY (`category_id`) REFERENCES `material_category` (`id`) ON DELETE RESTRICT,
                            CONSTRAINT `fk_material_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物资信息表';

-- ============================================
-- 四、环境监测模块
-- ============================================

-- 4.1 水质历史数据表（关键修正：主键包含分区列，移除外键）
CREATE TABLE `water_quality_history` (
                                         `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录编号',
                                         `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号（逻辑外键，关联pond.id）',
                                         `timestamp` DATETIME NOT NULL COMMENT '记录时间',
                                         `ph` DECIMAL(4,2) DEFAULT NULL COMMENT 'pH值',
                                         `do` DECIMAL(5,2) DEFAULT NULL COMMENT '溶解氧（mg/L）',
                                         `temperature` DECIMAL(5,2) DEFAULT NULL COMMENT '水温（℃）',
                                         `nh3_n` DECIMAL(5,2) DEFAULT NULL COMMENT '氨氮（mg/L）',
                                         `no2_n` DECIMAL(5,2) DEFAULT NULL COMMENT '亚硝酸盐（mg/L）',
                                         `no3_n` DECIMAL(5,2) DEFAULT NULL COMMENT '硝酸盐（mg/L）',
                                         `cod` DECIMAL(5,2) DEFAULT NULL COMMENT '化学需氧量（mg/L）',
                                         `turbidity` DECIMAL(5,2) DEFAULT NULL COMMENT '浊度（NTU）',
                                         `salinity` DECIMAL(5,2) DEFAULT NULL COMMENT '盐度（‰）',
                                         `alkalinity` DECIMAL(5,2) DEFAULT NULL COMMENT '碱度（mg/L）',
                                         `hardness` DECIMAL(5,2) DEFAULT NULL COMMENT '硬度（mg/L）',
                                         `data_source` VARCHAR(20) DEFAULT 'manual' COMMENT '数据来源: manual-手动, auto-自动',
                                         `operator` VARCHAR(50) DEFAULT NULL COMMENT '记录人',
                                         `remark` TEXT COMMENT '备注',
                                         `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                         PRIMARY KEY (`id`, `timestamp`),  -- ✅ 包含分区列
                                         KEY `idx_pond_id` (`pond_id`),
                                         KEY `idx_phtimestamp` (`pond_id`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='水质历史数据表'
    PARTITION BY RANGE (YEAR(timestamp) * 100 + MONTH(timestamp)) (
        PARTITION p202401 VALUES LESS THAN (202402),
        PARTITION p202402 VALUES LESS THAN (202403),
        PARTITION p202403 VALUES LESS THAN (202404),
        PARTITION p202404 VALUES LESS THAN (202405),
        PARTITION p202405 VALUES LESS THAN (202406),
        PARTITION p202406 VALUES LESS THAN (202407),
        PARTITION p202407 VALUES LESS THAN (202408),
        PARTITION p202408 VALUES LESS THAN (202409),
        PARTITION p202409 VALUES LESS THAN (202410),
        PARTITION p202410 VALUES LESS THAN (202411),
        PARTITION p202411 VALUES LESS THAN (202412),
        PARTITION p202412 VALUES LESS THAN (202501),
        PARTITION p202501 VALUES LESS THAN (202502),
        PARTITION p202502 VALUES LESS THAN (202503),
        PARTITION p202503 VALUES LESS THAN (202504),
        PARTITION p202504 VALUES LESS THAN (202505),
        PARTITION p202505 VALUES LESS THAN (202506),
        PARTITION p202506 VALUES LESS THAN (202507),
        PARTITION p202507 VALUES LESS THAN (202508),
        PARTITION p202508 VALUES LESS THAN (202509),
        PARTITION p202509 VALUES LESS THAN (202510),
        PARTITION p202510 VALUES LESS THAN (202511),
        PARTITION p202511 VALUES LESS THAN (202512),
        PARTITION p202512 VALUES LESS THAN (202601),
        PARTITION p202601 VALUES LESS THAN (202602),
        PARTITION p202602 VALUES LESS THAN (202603),
        PARTITION p202603 VALUES LESS THAN (202604),
        PARTITION p202604 VALUES LESS THAN (202605),
        PARTITION p202605 VALUES LESS THAN (202606),
        PARTITION p202606 VALUES LESS THAN (202607),
        PARTITION p202607 VALUES LESS THAN (202608),
        PARTITION p202608 VALUES LESS THAN (202609),
        PARTITION p202609 VALUES LESS THAN (202610),
        PARTITION p202610 VALUES LESS THAN (202611),
        PARTITION p202611 VALUES LESS THAN (202612),
        PARTITION p202612 VALUES LESS THAN (202701),
        PARTITION pmax VALUES LESS THAN MAXVALUE
        );

-- 4.2 水质实时监测表
CREATE TABLE `water_quality_monitor` (
                                         `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '监测编号',
                                         `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                                         `monitor_time` DATETIME NOT NULL COMMENT '监测时间',
                                         `ph` DECIMAL(4,2) DEFAULT NULL COMMENT 'pH值',
                                         `do` DECIMAL(5,2) DEFAULT NULL COMMENT '溶解氧（mg/L）',
                                         `temperature` DECIMAL(5,2) DEFAULT NULL COMMENT '水温（℃）',
                                         `nh3_n` DECIMAL(5,2) DEFAULT NULL COMMENT '氨氮（mg/L）',
                                         `no2_n` DECIMAL(5,2) DEFAULT NULL COMMENT '亚硝酸盐（mg/L）',
                                         `alarm_status` VARCHAR(10) DEFAULT 'normal' COMMENT '报警状态: normal-正常, warning-警告, danger-危险',
                                         `alarm_reason` TEXT COMMENT '报警原因',
                                         `status` VARCHAR(10) DEFAULT 'active' COMMENT '状态',
                                         `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                         `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                         PRIMARY KEY (`id`),
                                         KEY `idx_pond_id` (`pond_id`),
                                         KEY `idx_monitor_time` (`monitor_time`),
                                         KEY `idx_alarm_status` (`alarm_status`),
                                         CONSTRAINT `fk_wqm_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='水质实时监测表';

-- 4.3 气象历史数据表
CREATE TABLE `weather_history` (
                                   `id` VARCHAR(32) NOT NULL COMMENT '记录编号',
                                   `base_id` VARCHAR(32) NOT NULL COMMENT '基地编号',
                                   `log_time` DATETIME NOT NULL COMMENT '记录时间',
                                   `temperature` DECIMAL(5,2) DEFAULT NULL COMMENT '气温（℃）',
                                   `humidity` DECIMAL(5,2) DEFAULT NULL COMMENT '湿度（%）',
                                   `wind_speed` DECIMAL(5,2) DEFAULT NULL COMMENT '风速（m/s）',
                                   `wind_direction` VARCHAR(20) DEFAULT NULL COMMENT '风向',
                                   `weather_condition` VARCHAR(50) DEFAULT NULL COMMENT '天气状况',
                                   `rainfall` DECIMAL(6,2) DEFAULT NULL COMMENT '降水量（mm）',
                                   `air_pressure` DECIMAL(6,2) DEFAULT NULL COMMENT '气压（hPa）',
                                   `uv_index` DECIMAL(3,1) DEFAULT NULL COMMENT '紫外线指数',
                                   `data_source` VARCHAR(20) DEFAULT 'api' COMMENT '数据来源',
                                   `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   PRIMARY KEY (`id`),
                                   KEY `idx_base_id` (`base_id`),
                                   KEY `idx_log_time` (`log_time`),
                                   CONSTRAINT `fk_wh_base` FOREIGN KEY (`base_id`) REFERENCES `base` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='气象历史数据表';

-- 4.4 潮汐数据表
CREATE TABLE `tide_data` (
                             `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录编号',
                             `location` VARCHAR(100) NOT NULL COMMENT '地点名称',
                             `tide_date` DATE NOT NULL COMMENT '日期',
                             `high_tide_time` TIME DEFAULT NULL COMMENT '高潮时间',
                             `high_tide_height` DECIMAL(5,2) DEFAULT NULL COMMENT '高潮高度（米）',
                             `low_tide_time` TIME DEFAULT NULL COMMENT '低潮时间',
                             `low_tide_height` DECIMAL(5,2) DEFAULT NULL COMMENT '低潮高度（米）',
                             `tide_range` DECIMAL(5,2) DEFAULT NULL COMMENT '潮差（米）',
                             `data_source` VARCHAR(50) DEFAULT NULL COMMENT '数据来源',
                             `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `uk_location_date` (`location`, `tide_date`),
                             KEY `idx_tide_date` (`tide_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='潮汐数据表';

-- ============================================
-- 五、物联网模块
-- ============================================

-- 5.1 IoT节点表
CREATE TABLE `iot_node` (
                            `id` VARCHAR(32) NOT NULL COMMENT '节点编号',
                            `pond_id` VARCHAR(32) NOT NULL COMMENT '所属塘口编号',
                            `node_type` VARCHAR(50) NOT NULL COMMENT '节点类型: water_quality-水质, weather-气象, camera-摄像头',
                            `node_name` VARCHAR(100) NOT NULL COMMENT '节点名称',
                            `install_location` VARCHAR(200) DEFAULT NULL COMMENT '安装位置',
                            `device_id` VARCHAR(100) DEFAULT NULL COMMENT '设备ID',
                            `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
                            `mac_address` VARCHAR(50) DEFAULT NULL COMMENT 'MAC地址',
                            `status` VARCHAR(10) DEFAULT 'online' COMMENT '状态: online-在线, offline-离线, maintenance-维护中',
                            `install_date` DATE DEFAULT NULL COMMENT '安装日期',
                            `last_maintenance_date` DATE DEFAULT NULL COMMENT '最后维护日期',
                            `next_maintenance_date` DATE DEFAULT NULL COMMENT '下次维护日期',
                            `description` TEXT COMMENT '节点描述',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            PRIMARY KEY (`id`),
                            KEY `idx_pond_id` (`pond_id`),
                            KEY `idx_node_type` (`node_type`),
                            KEY `idx_status` (`status`),
                            CONSTRAINT `fk_iot_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='IoT节点表';

-- 5.2 传感器数据表
CREATE TABLE `sensor_data` (
                               `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '数据编号',
                               `node_id` VARCHAR(32) NOT NULL COMMENT '节点编号',
                               `data_type` VARCHAR(50) NOT NULL COMMENT '数据类型: temperature-温度, ph-pH, do-溶解氧',
                               `data_value` DECIMAL(10,3) NOT NULL COMMENT '数据值',
                               `collect_time` DATETIME NOT NULL COMMENT '采集时间',
                               `unit` VARCHAR(20) DEFAULT NULL COMMENT '单位',
                               `status` VARCHAR(10) DEFAULT 'normal' COMMENT '状态',
                               `alarm_flag` TINYINT DEFAULT 0 COMMENT '是否报警: 0-否, 1-是',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               PRIMARY KEY (`id`),
                               KEY `idx_node_id` (`node_id`),
                               KEY `idx_collect_time` (`collect_time`),
                               KEY `idx_data_type` (`data_type`),
                               CONSTRAINT `fk_sd_node` FOREIGN KEY (`node_id`) REFERENCES `iot_node` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器数据表';

-- ============================================
-- 六、生产管理模块
-- ============================================

-- 6.1 投入品记录表（现在material表已创建，可以引用）
CREATE TABLE `input_record` (
                                `id` VARCHAR(32) NOT NULL COMMENT '记录编号',
                                `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                                `material_id` VARCHAR(32) NOT NULL COMMENT '物资编号',
                                `record_date` DATE NOT NULL COMMENT '记录日期',
                                `type` VARCHAR(10) NOT NULL COMMENT '记录类型: purchase-采购, usage-使用, inventory-库存',
                                `quantity` DECIMAL(10,2) NOT NULL COMMENT '数量',
                                `unit` VARCHAR(20) NOT NULL COMMENT '单位',
                                `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
                                `remark` TEXT COMMENT '备注',
                                `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                PRIMARY KEY (`id`),
                                KEY `idx_pond_id` (`pond_id`),
                                KEY `idx_material_id` (`material_id`),
                                KEY `idx_record_date` (`record_date`),
                                KEY `idx_type` (`type`),
                                CONSTRAINT `fk_ir_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE,
                                CONSTRAINT `fk_ir_material` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投入品记录表';

-- 6.2 投入品使用表
CREATE TABLE `input_usage` (
                               `id` VARCHAR(32) NOT NULL COMMENT '使用编号',
                               `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                               `input_type` VARCHAR(20) NOT NULL COMMENT '投入品类型: feed-饲料, medicine-药品, fertilizer-肥料',
                               `material_name` VARCHAR(100) NOT NULL COMMENT '物资名称',
                               `usage_date` DATE NOT NULL COMMENT '使用日期',
                               `quantity` DECIMAL(10,2) NOT NULL COMMENT '使用数量',
                               `unit` VARCHAR(20) NOT NULL COMMENT '单位',
                               `purpose` TEXT COMMENT '使用目的',
                               `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
                               `batch_no` VARCHAR(100) DEFAULT NULL COMMENT '批次号',
                               `remark` TEXT COMMENT '备注',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                               PRIMARY KEY (`id`),
                               KEY `idx_pond_id` (`pond_id`),
                               KEY `idx_input_type` (`input_type`),
                               KEY `idx_usage_date` (`usage_date`),
                               KEY `idx_operator` (`operator`),
                               CONSTRAINT `fk_iu_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投入品使用表';

-- 6.3 生产日志表
CREATE TABLE `production_log` (
                                  `id` VARCHAR(32) NOT NULL COMMENT '日志编号',
                                  `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                                  `type` VARCHAR(20) NOT NULL COMMENT '日志类型: feeding-投喂, cleaning-清塘, inspection-巡检',
                                  `content` TEXT NOT NULL COMMENT '日志内容',
                                  `log_date` DATE NOT NULL COMMENT '记录日期',
                                  `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
                                  `attachment` VARCHAR(255) DEFAULT NULL COMMENT '附件地址',
                                  `remark` TEXT COMMENT '备注',
                                  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  PRIMARY KEY (`id`),
                                  KEY `idx_pond_id` (`pond_id`),
                                  KEY `idx_type` (`type`),
                                  KEY `idx_log_date` (`log_date`),
                                  KEY `idx_operator` (`operator`),
                                  CONSTRAINT `fk_pl_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='生产日志表';

-- 6.4 任务计划表
CREATE TABLE `task` (
                        `id` VARCHAR(32) NOT NULL COMMENT '任务编号',
                        `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                        `type` VARCHAR(20) NOT NULL COMMENT '任务类型: routine-日常, emergency-紧急, maintenance-维护',
                        `task_name` VARCHAR(100) NOT NULL COMMENT '任务名称',
                        `task_content` TEXT NOT NULL COMMENT '任务内容',
                        `plan_start_time` DATETIME NOT NULL COMMENT '计划开始时间',
                        `plan_end_time` DATETIME NOT NULL COMMENT '计划结束时间',
                        `actual_start_time` DATETIME DEFAULT NULL COMMENT '实际开始时间',
                        `actual_end_time` DATETIME DEFAULT NULL COMMENT '实际结束时间',
                        `status` VARCHAR(10) DEFAULT 'pending' COMMENT '状态: pending-待执行, executing-执行中, completed-已完成, cancelled-已取消',
                        `assignee` VARCHAR(50) NOT NULL COMMENT '指派人',
                        `executor` VARCHAR(50) DEFAULT NULL COMMENT '执行人',
                        `priority` INT DEFAULT 3 COMMENT '优先级: 1-高, 2-中, 3-低',
                        `completion_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '完成率（%）',
                        `remark` TEXT COMMENT '备注',
                        `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                        `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                        PRIMARY KEY (`id`),
                        KEY `idx_pond_id` (`pond_id`),
                        KEY `idx_status` (`status`),
                        KEY `idx_assignee` (`assignee`),
                        KEY `idx_plan_start_time` (`plan_start_time`),
                        CONSTRAINT `fk_task_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务计划表';

-- 6.5 产品合格证表
CREATE TABLE `certificate` (
                               `id` VARCHAR(32) NOT NULL COMMENT '合格证编号',
                               `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                               `issue_time` DATETIME NOT NULL COMMENT '发证时间',
                               `certificate_no` VARCHAR(100) NOT NULL COMMENT '合格证编号',
                               `product_name` VARCHAR(100) NOT NULL COMMENT '产品名称',
                               `species` VARCHAR(50) DEFAULT NULL COMMENT '品种',
                               `quantity` DECIMAL(10,2) DEFAULT NULL COMMENT '数量',
                               `unit` VARCHAR(20) DEFAULT NULL COMMENT '单位',
                               `weight` DECIMAL(10,2) DEFAULT NULL COMMENT '重量（kg）',
                               `quality_level` VARCHAR(20) DEFAULT NULL COMMENT '质量等级: premium-特级, grade_a-A级, grade_b-B级',
                               `production_date` DATE DEFAULT NULL COMMENT '生产日期',
                               `valid_until` DATE DEFAULT NULL COMMENT '有效期至',
                               `producer` VARCHAR(100) DEFAULT NULL COMMENT '生产者',
                               `inspector` VARCHAR(50) DEFAULT NULL COMMENT '检验员',
                               `remark` TEXT COMMENT '备注',
                               `qr_code` VARCHAR(255) DEFAULT NULL COMMENT '二维码地址',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `uk_certificate_no` (`certificate_no`),
                               KEY `idx_pond_id` (`pond_id`),
                               KEY `idx_issue_time` (`issue_time`),
                               KEY `idx_species` (`species`),
                               CONSTRAINT `fk_cert_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品合格证表';

-- ============================================
-- 七、预警中心模块
-- ============================================

-- 7.1 预警记录表
CREATE TABLE `warning_record` (
                                  `id` VARCHAR(32) NOT NULL COMMENT '预警编号',
                                  `pond_id` VARCHAR(32) DEFAULT NULL COMMENT '塘口编号',
                                  `base_id` VARCHAR(32) DEFAULT NULL COMMENT '基地编号',
                                  `level` VARCHAR(10) NOT NULL COMMENT '预警级别: low-低, medium-中, high-高, critical-紧急',
                                  `warning_type` VARCHAR(50) NOT NULL COMMENT '预警类型: water_quality-水质, weather-天气, equipment-设备',
                                  `content` TEXT NOT NULL COMMENT '预警内容',
                                  `trigger_time` DATETIME NOT NULL COMMENT '触发时间',
                                  `trigger_condition` TEXT COMMENT '触发条件',
                                  `handle_status` VARCHAR(10) DEFAULT 'pending' COMMENT '处理状态: pending-待处理, processing-处理中, resolved-已解决',
                                  `handle_time` DATETIME DEFAULT NULL COMMENT '处理时间',
                                  `handler` VARCHAR(50) DEFAULT NULL COMMENT '处理人',
                                  `handle_result` TEXT COMMENT '处理结果',
                                  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  PRIMARY KEY (`id`),
                                  KEY `idx_pond_id` (`pond_id`),
                                  KEY `idx_base_id` (`base_id`),
                                  KEY `idx_level` (`level`),
                                  KEY `idx_warning_type` (`warning_type`),
                                  KEY `idx_handle_status` (`handle_status`),
                                  KEY `idx_trigger_time` (`trigger_time`),
                                  CONSTRAINT `fk_wr_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE SET NULL,
                                  CONSTRAINT `fk_wr_base` FOREIGN KEY (`base_id`) REFERENCES `base` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警记录表';

-- ============================================
-- 八、政府监管模块
-- ============================================

-- 8.1 用药记录表
CREATE TABLE `medicine_record` (
                                   `id` VARCHAR(32) NOT NULL COMMENT '记录编号',
                                   `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                                   `usage_time` DATETIME NOT NULL COMMENT '用药时间',
                                   `medicine_name` VARCHAR(100) NOT NULL COMMENT '药品名称',
                                   `dosage` VARCHAR(100) NOT NULL COMMENT '用药剂量',
                                   `usage_method` VARCHAR(100) DEFAULT NULL COMMENT '使用方法',
                                   `purpose` TEXT COMMENT '使用目的',
                                   `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
                                   `approval_no` VARCHAR(100) DEFAULT NULL COMMENT '批准文号',
                                   `batch_no` VARCHAR(100) DEFAULT NULL COMMENT '批次号',
                                   `manufacturer` VARCHAR(200) DEFAULT NULL COMMENT '生产厂家',
                                   `withdrawal_period` INT DEFAULT NULL COMMENT '休药期（天）',
                                   `withdrawal_end_date` DATE DEFAULT NULL COMMENT '休药期结束日期',
                                   `veterinary_prescription` VARCHAR(255) DEFAULT NULL COMMENT '兽医处方',
                                   `remark` TEXT COMMENT '备注',
                                   `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                   PRIMARY KEY (`id`),
                                   KEY `idx_pond_id` (`pond_id`),
                                   KEY `idx_usage_time` (`usage_time`),
                                   KEY `idx_medicine_name` (`medicine_name`),
                                   KEY `idx_operator` (`operator`),
                                   CONSTRAINT `fk_mr_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用药记录表';

-- 8.2 检测报告表
CREATE TABLE `test_report` (
                               `id` VARCHAR(32) NOT NULL COMMENT '报告编号',
                               `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                               `certificate_id` VARCHAR(32) DEFAULT NULL COMMENT '合格证编号',
                               `test_date` DATE NOT NULL COMMENT '检测日期',
                               `test_item` VARCHAR(100) NOT NULL COMMENT '检测项目',
                               `test_result` VARCHAR(100) NOT NULL COMMENT '检测结果',
                               `test_standard` VARCHAR(100) DEFAULT NULL COMMENT '检测标准',
                               `testing_agency` VARCHAR(100) NOT NULL COMMENT '检测机构',
                               `report_no` VARCHAR(100) NOT NULL COMMENT '报告编号',
                               `report_file` VARCHAR(255) DEFAULT NULL COMMENT '报告文件地址',
                               `inspector` VARCHAR(50) DEFAULT NULL COMMENT '检测人员',
                               `review_status` VARCHAR(10) DEFAULT 'pending' COMMENT '审核状态: pending-待审核, approved-已通过, rejected-已拒绝',
                               `review_time` DATETIME DEFAULT NULL COMMENT '审核时间',
                               `reviewer` VARCHAR(50) DEFAULT NULL COMMENT '审核人',
                               `remark` TEXT COMMENT '备注',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                               PRIMARY KEY (`id`),
                               KEY `idx_pond_id` (`pond_id`),
                               KEY `idx_certificate_id` (`certificate_id`),
                               KEY `idx_test_date` (`test_date`),
                               KEY `idx_testing_agency` (`testing_agency`),
                               KEY `idx_review_status` (`review_status`),
                               CONSTRAINT `fk_tr_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE,
                               CONSTRAINT `fk_tr_certificate` FOREIGN KEY (`certificate_id`) REFERENCES `certificate` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='检测报告表';

-- 8.3 出塘报备表
CREATE TABLE `harvest_registration` (
                                        `id` VARCHAR(32) NOT NULL COMMENT '报备编号',
                                        `pond_id` VARCHAR(32) NOT NULL COMMENT '塘口编号',
                                        `harvest_date` DATE NOT NULL COMMENT '收获日期',
                                        `species` VARCHAR(50) NOT NULL COMMENT '品种',
                                        `quantity` DECIMAL(10,2) NOT NULL COMMENT '数量',
                                        `unit` VARCHAR(20) NOT NULL COMMENT '单位',
                                        `weight` DECIMAL(10,2) DEFAULT NULL COMMENT '重量（kg）',
                                        `destination` VARCHAR(200) DEFAULT NULL COMMENT '去向',
                                        `buyer` VARCHAR(100) DEFAULT NULL COMMENT '购买方',
                                        `transport_vehicle` VARCHAR(50) DEFAULT NULL COMMENT '运输车辆',
                                        `driver` VARCHAR(50) DEFAULT NULL COMMENT '司机',
                                        `driver_phone` VARCHAR(20) DEFAULT NULL COMMENT '司机电话',
                                        `certificate_id` VARCHAR(32) DEFAULT NULL COMMENT '合格证编号',
                                        `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
                                        `remark` TEXT COMMENT '备注',
                                        `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                        `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                        PRIMARY KEY (`id`),
                                        KEY `idx_pond_id` (`pond_id`),
                                        KEY `idx_harvest_date` (`harvest_date`),
                                        KEY `idx_species` (`species`),
                                        KEY `idx_operator` (`operator`),
                                        CONSTRAINT `fk_hr_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `fk_hr_certificate` FOREIGN KEY (`certificate_id`) REFERENCES `certificate` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='出塘报备表';

-- ============================================
-- 九、信息导航模块
-- ============================================

-- 9.1 知识库表
CREATE TABLE `knowledge` (
                             `id` VARCHAR(32) NOT NULL COMMENT '知识编号',
                             `type` VARCHAR(20) NOT NULL COMMENT '知识类型: breeding-养殖, disease-病害, market-市场',
                             `title` VARCHAR(200) NOT NULL COMMENT '标题',
                             `content` TEXT NOT NULL COMMENT '内容',
                             `author` VARCHAR(50) DEFAULT NULL COMMENT '作者',
                             `publish_date` DATE DEFAULT NULL COMMENT '发布日期',
                             `view_count` INT DEFAULT 0 COMMENT '浏览次数',
                             `like_count` INT DEFAULT 0 COMMENT '点赞次数',
                             `attachment` VARCHAR(255) DEFAULT NULL COMMENT '附件地址',
                             `status` VARCHAR(10) DEFAULT 'published' COMMENT '状态: published-已发布, draft-草稿, archived-归档',
                             `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             PRIMARY KEY (`id`),
                             KEY `idx_type` (`type`),
                             KEY `idx_publish_date` (`publish_date`),
                             KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识库表';

-- 9.2 通讯录表
CREATE TABLE `contact` (
                           `id` VARCHAR(32) NOT NULL COMMENT '联系人编号',
                           `name` VARCHAR(50) NOT NULL COMMENT '姓名',
                           `department` VARCHAR(50) DEFAULT NULL COMMENT '部门',
                           `position` VARCHAR(50) DEFAULT NULL COMMENT '职位',
                           `phone` VARCHAR(20) DEFAULT NULL COMMENT '电话',
                           `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
                           `address` VARCHAR(200) DEFAULT NULL COMMENT '地址',
                           `contact_type` VARCHAR(20) DEFAULT NULL COMMENT '联系人类型: government-政府部门, supplier-供应商, expert-专家',
                           `remark` TEXT COMMENT '备注',
                           `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                           PRIMARY KEY (`id`),
                           KEY `idx_name` (`name`),
                           KEY `idx_contact_type` (`contact_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通讯录表';

-- ============================================
-- 十、市场行情模块
-- ============================================

-- 10.1 市场行情表
CREATE TABLE `market_quote` (
                                `id` VARCHAR(32) NOT NULL COMMENT '行情编号',
                                `species` VARCHAR(50) NOT NULL COMMENT '品种',
                                `region` VARCHAR(100) NOT NULL COMMENT '地区',
                                `quote_date` DATE NOT NULL COMMENT '报价日期',
                                `price_min` DECIMAL(10,2) DEFAULT NULL COMMENT '最低价格',
                                `price_max` DECIMAL(10,2) DEFAULT NULL COMMENT '最高价格',
                                `price_avg` DECIMAL(10,2) DEFAULT NULL COMMENT '平均价格',
                                `unit` VARCHAR(10) NOT NULL COMMENT '单位',
                                `data_source` VARCHAR(50) DEFAULT NULL COMMENT '数据来源',
                                `trend` VARCHAR(20) DEFAULT NULL COMMENT '价格趋势: rising-上涨, falling-下跌, stable-稳定',
                                `remark` TEXT COMMENT '备注',
                                `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                PRIMARY KEY (`id`),
                                KEY `idx_species` (`species`),
                                KEY `idx_region` (`region`),
                                KEY `idx_quote_date` (`quote_date`),
                                KEY `idx_trend` (`trend`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='市场行情表';

-- ============================================
-- 十一、系统管理模块
-- ============================================

-- 11.1 系统日志表
CREATE TABLE `system_log` (
                              `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志编号',
                              `user_id` BIGINT DEFAULT NULL COMMENT '用户ID',
                              `operation` VARCHAR(100) NOT NULL COMMENT '操作描述',
                              `module` VARCHAR(50) DEFAULT NULL COMMENT '模块名称',
                              `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
                              `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '用户代理',
                              `request_url` VARCHAR(255) DEFAULT NULL COMMENT '请求URL',
                              `request_method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法',
                              `request_params` TEXT COMMENT '请求参数',
                              `response_time` BIGINT DEFAULT NULL COMMENT '响应时间（毫秒）',
                              `status` VARCHAR(10) DEFAULT 'success' COMMENT '状态: success-成功, error-错误',
                              `error_message` TEXT COMMENT '错误信息',
                              `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              PRIMARY KEY (`id`),
                              KEY `idx_user_id` (`user_id`),
                              KEY `idx_create_time` (`create_time`),
                              KEY `idx_module` (`module`),
                              KEY `idx_status` (`status`),
                              CONSTRAINT `fk_sl_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';

-- ============================================
-- 初始化数据
-- ============================================

-- 初始化物资分类
INSERT INTO `material_category` (`id`, `code`, `name`, `parent_id`, `level`, `description`, `sort_order`, `status`) VALUES
                                                                                                                        (1, 'FEED', '饲料', 0, 1, '各类水产饲料', 1, 'active'),
                                                                                                                        (2, 'MEDICINE', '药品', 0, 1, '水产用药', 2, 'active'),
                                                                                                                        (3, 'FERTILIZER', '肥料', 0, 1, '水质调节剂', 3, 'active'),
                                                                                                                        (4, 'EQUIPMENT', '设备', 0, 1, '养殖设备', 4, 'active'),
                                                                                                                        (5, 'FEED_FISH', '鱼饲料', 1, 2, '鱼类专用饲料', 1, 'active'),
                                                                                                                        (6, 'FEED_SHRIMP', '虾饲料', 1, 2, '虾类专用饲料', 2, 'active'),
                                                                                                                        (7, 'MEDICINE_ANTIBIOTIC', '抗生素', 2, 2, '抗菌药物', 1, 'active'),
                                                                                                                        (8, 'MEDICINE_DISINFECTANT', '消毒剂', 2, 2, '水质消毒剂', 2, 'active');

-- 初始化系统用户（超级管理员）- 使用正确的字段名
INSERT INTO `user` (`userAccount`, `username`, `userPassword`, `phone`, `email`, `userStatus`, `role`) VALUES
    ('admin', '超级管理员', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lqkkO8rK29KcLd2QG', '13800138000', 'admin@aquaculture.com', 1, 1);

-- ============================================
-- 索引优化建议
-- ============================================

-- 为常用查询添加复合索引
ALTER TABLE `water_quality_history` ADD INDEX `idx_pond_time_ph` (`pond_id`, `timestamp`, `ph`);
ALTER TABLE `water_quality_history` ADD INDEX `idx_pond_time_do` (`pond_id`, `timestamp`, `do`);
ALTER TABLE `production_log` ADD INDEX `idx_pond_date_type` (`pond_id`, `log_date`, `type`);
ALTER TABLE `task` ADD INDEX `idx_pond_status_time` (`pond_id`, `status`, `plan_start_time`);

-- ============================================
-- 数据库创建完成
-- ============================================

SELECT '✅ 水产养殖管理系统数据库创建成功！' AS message;