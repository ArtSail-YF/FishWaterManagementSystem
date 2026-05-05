CREATE TABLE `sys_dept` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID (系统自动生成)',
                            `parent_id` bigint DEFAULT 0 COMMENT '父级ID (0=顶级)',
                            `dept_name` varchar(100) NOT NULL COMMENT '部门名称 (实际存: 基地名称)',
                            `dept_code` varchar(50) COMMENT '部门编码',
                            `sort_order` int DEFAULT 0 COMMENT '排序',
                            `status` tinyint DEFAULT 1 COMMENT '状态 1-正常 0-停用',
                            `create_time` datetime,
                            `update_time` datetime,
                            `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                            `delete_time` datetime NULL COMMENT '删除时间'
);



create table user
(
    user_name     varchar(256)                       null comment '用户昵称',
    `dept_id` bigint COMMENT '归属部门ID',
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
    is_delete     tinyint  default 0                 not null comment '是否删除: 0-正常, 1-已删除',
    delete_time   datetime                           null comment '删除时间',
    user_role     int      default 0                 null comment '角色 : 0=普通用户, 1= 管理员 ,2 =VIP'
)
    comment '用户';





CREATE TABLE `sys_role` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                            `role_name` varchar(50) NOT NULL COMMENT '角色名称',
                            `role_code` varchar(50) UNIQUE NOT NULL COMMENT '角色权限字符串',
                            `role_desc` varchar(200) COMMENT '角色描述',
                            `data_scope` tinyint DEFAULT 1 COMMENT '数据范围 1-全部 2-自定义 3-本部门 4-仅本人',
                            `sort_order` int DEFAULT 0 COMMENT '排序',
                            `status` tinyint DEFAULT 1 COMMENT '状态',
                            `create_time` datetime,
                            `update_time` datetime,
                            `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                            `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `sys_menu` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                            `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
                            `parent_id` bigint DEFAULT 0 COMMENT '父菜单ID',
                            `menu_type` tinyint NOT NULL COMMENT '类型 1-目录 2-菜单 3-按钮',
                            `menu_path` varchar(200) COMMENT '路由地址',
                            `component` varchar(255) COMMENT '组件路径',
                            `perms` varchar(100) COMMENT '权限标识 system:user:add',
                            `icon` varchar(100) COMMENT '图标',
                            `sort_order` int DEFAULT 0 COMMENT '排序',
                            `visible` tinyint DEFAULT 1 COMMENT '是否可见',
                            `status` tinyint DEFAULT 1 COMMENT '状态',
                            `create_time` datetime,
                            `update_time` datetime,
                            `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                            `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `sys_user_role` (
                                 `user_id` bigint NOT NULL,
                                 `role_id` bigint NOT NULL,
                                 PRIMARY KEY (`user_id`, `role_id`)
);

CREATE TABLE `sys_role_menu` (
                                 `role_id` bigint NOT NULL,
                                 `menu_id` bigint NOT NULL,
                                 PRIMARY KEY (`role_id`, `menu_id`)
);

CREATE TABLE `sys_dict_type` (
                                 `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                 `dict_type` varchar(50) UNIQUE NOT NULL COMMENT '字典类型',
                                 `dict_name` varchar(100) NOT NULL COMMENT '字典名称',
                                 `dict_desc` varchar(200) COMMENT '描述',
                                 `status` tinyint DEFAULT 1,
                                 `create_time` datetime,
                                 `update_time` datetime,
                                 `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                                 `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `sys_dict_data` (
                                 `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                 `dict_type` varchar(50) NOT NULL COMMENT '关联类型',
                                 `dict_label` varchar(100) NOT NULL COMMENT '显示标签',
                                 `dict_value` varchar(100) NOT NULL COMMENT '存储值',
                                 `sort_order` int DEFAULT 0,
                                 `status` tinyint DEFAULT 1,
                                 `create_time` datetime,
                                 `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                                 `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `sys_config` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT,
                              `config_key` varchar(100) UNIQUE NOT NULL COMMENT '配置键',
                              `config_value` varchar(500) NOT NULL COMMENT '配置值',
                              `config_desc` varchar(200) COMMENT '描述',
                              `create_time` datetime,
                              `update_time` datetime,
                              `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                              `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `sys_log` (
                           `id` bigint PRIMARY KEY AUTO_INCREMENT,
                           `username` varchar(50) COMMENT '操作人',
                           `operation` varchar(200) COMMENT '模块标题',
                           `method` varchar(200) COMMENT '请求方法',
                           `params` text COMMENT '请求参数',
                           `ip` varchar(50) COMMENT 'IP地址',
                           `time` bigint DEFAULT 0 COMMENT '执行耗时毫秒',
                           `create_time` datetime
);

CREATE TABLE `sys_login_log` (
                                 `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                 `username` varchar(50) COMMENT '账号',
                                 `ip` varchar(50) COMMENT 'IP地址',
                                 `login_time` datetime DEFAULT (CURRENT_TIMESTAMP) COMMENT '登录时间',
                                 `status` tinyint DEFAULT 1 COMMENT '状态 1-成功 0-失败',
                                 `msg` varchar(255) COMMENT '提示信息'
);

CREATE TABLE `biz_breeder` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT,
                               `breeder_code` varchar(50) UNIQUE NOT NULL COMMENT '主体编码',
                               `breeder_name` varchar(100) NOT NULL COMMENT '主体名称',
                               `legal_person` varchar(50) COMMENT '法人代表',
                               `phone` varchar(20) NOT NULL COMMENT '联系电话',
                               `email` varchar(100) COMMENT '电子邮箱',
                               `id_card` varchar(20) COMMENT '法人身份证号',
                               `business_license` varchar(255) COMMENT '营业执照路径',
                               `license_no` varchar(100) COMMENT '统一社会信用代码',
                               `reg_capital` decimal(15,2) COMMENT '注册资本(万元)',
                               `establish_date` date COMMENT '成立日期',
                               `province` varchar(50) COMMENT '省份',
                               `city` varchar(50) COMMENT '城市',
                               `county` varchar(50) COMMENT '区县',
                               `address` varchar(255) COMMENT '详细注册地址',
                               `longitude` decimal(10,7) COMMENT '中心经度',
                               `latitude` decimal(10,7) COMMENT '中心纬度',
                               `status` tinyint DEFAULT 1 COMMENT '1-正常 0-停用',
                               `create_time` datetime,
                               `update_time` datetime,
                               `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                               `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `base_info` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `base_code` varchar(50) UNIQUE NOT NULL COMMENT '基地编码',
                             `base_name` varchar(100) NOT NULL COMMENT '基地名称',
                             `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
                             `dept_id` bigint UNIQUE NOT NULL COMMENT '【映射键】这里填 sys_dept.id',
                             `address` varchar(255) COMMENT '基地详细地址',
                             `longitude` decimal(10,7) COMMENT '中心经度',
                             `latitude` decimal(10,7) COMMENT '中心纬度',
                             `total_area` decimal(12,2) COMMENT '总占地面积(亩)',
                             `water_area` decimal(12,2) COMMENT '实际养殖水面(亩)',
                             `water_source` varchar(100) COMMENT '水源类型(河流/湖泊/地下水/海水)',
                             `water_quality_grade` varchar(20) COMMENT '水质等级',
                             `soil_type` varchar(100) COMMENT '底质土壤类型',
                             `ph_value` decimal(3,1) COMMENT '土壤pH值',
                             `power_supply` varchar(100) COMMENT '电力供应情况',
                             `transformer_capacity` int COMMENT '变压器容量(KVA)',
                             `road_condition` varchar(200) COMMENT '道路通达情况',
                             `drainage_system` varchar(100) COMMENT '排污系统类型',
                             `is_pollution_free` tinyint DEFAULT 0 COMMENT '是否无公害认证',
                             `taiwan_cooperation` tinyint DEFAULT 0 COMMENT '是否台资合作',
                             `green_certification` varchar(50) COMMENT '绿色认证等级',
                             `certification_img` varchar(255) COMMENT '认证证书图片',
                             `deep_sea_certified` tinyint DEFAULT 0 COMMENT '是否深远海认证基地',
                             `sea_area_license` varchar(255) COMMENT '海域使用权证路径',
                             `environmental_assessment` varchar(255) COMMENT '环评报告路径',
                             `remark` varchar(500) COMMENT '基地备注说明',
                             `status` tinyint DEFAULT 1 COMMENT '1-正常 0-停用',
                             `create_time` datetime,
                             `update_time` datetime,
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `pond_info` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `pond_code` varchar(50) UNIQUE NOT NULL COMMENT '塘口编码',
                             `pond_name` varchar(100) NOT NULL COMMENT '塘口名称',
                             `base_id` bigint NOT NULL COMMENT '归属基地ID',
                             `area` decimal(10,2) COMMENT '水面面积(亩)',
                             `depth_avg` decimal(5,2) COMMENT '平均深度(米)',
                             `depth_max` decimal(5,2) COMMENT '最深处(米)',
                             `shape_type` varchar(20) COMMENT '形状(矩形/圆形/不规则)',
                             `bottom_type` varchar(50) COMMENT '底质(泥沙/铺膜/混凝土)',
                             `bottom_silt_depth` decimal(4,1) COMMENT '淤泥深度(厘米)',
                             `inlet_count` int DEFAULT 0 COMMENT '进水口数量',
                             `inlet_diameter` int COMMENT '进水管径(mm)',
                             `outlet_count` int DEFAULT 0 COMMENT '出水口数量',
                             `outlet_type` varchar(50) COMMENT '出水方式(溢流/底排)',
                             `aeration_type` varchar(100) COMMENT '增氧机类型',
                             `aeration_count` int DEFAULT 0 COMMENT '增氧机台数',
                             `aeration_power` decimal(6,2) COMMENT '总功率(kw)',
                             `has_circulating` tinyint DEFAULT 0 COMMENT '是否有循环水系统',
                             `has_monitoring` tinyint DEFAULT 0 COMMENT '是否有视频监控',
                             `current_species` varchar(100) COMMENT '当前养殖品种',
                             `stocking_date` date COMMENT '最近放苗日期',
                             `estimated_output` decimal(10,2) COMMENT '预计产量(斤)',
                             `status` tinyint DEFAULT 2 COMMENT '1-养殖中 2-空闲 0-废弃',
                             `create_time` datetime,
                             `update_time` datetime,
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `cage_info` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `cage_code` varchar(50) UNIQUE NOT NULL COMMENT '网箱编码',
                             `cage_name` varchar(100) NOT NULL COMMENT '网箱名称',
                             `base_id` bigint COMMENT '挂靠基地ID(可选)',
                             `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
                             `longitude` decimal(10,7) NOT NULL COMMENT '中心经度',
                             `latitude` decimal(10,7) NOT NULL COMMENT '中心纬度',
                             `sea_area_name` varchar(100) COMMENT '所在海域名称',
                             `water_depth` decimal(6,1) COMMENT '该处水深(米)',
                             `cage_type` varchar(50) COMMENT '类型(重力式/张力腿/升降式)',
                             `shape` varchar(20) COMMENT '形状',
                             `perimeter` decimal(8,2) COMMENT '周长(米)',
                             `volume` decimal(10,2) COMMENT '养殖水体(立方米)',
                             `net_bag_depth` decimal(6,2) COMMENT '网衣深度(米)',
                             `material` varchar(100) COMMENT '材质(HDPE/钢制)',
                             `wind_resistance` int COMMENT '抗风等级(级)',
                             `current_resistance` int COMMENT '抗流能力(节)',
                             `status` tinyint DEFAULT 1 COMMENT '1-正常 2-维修 3-闲置',
                             `create_time` datetime,
                             `update_time` datetime,
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `vsl_info` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT,
                            `vsl_code` varchar(50) UNIQUE NOT NULL COMMENT '船舶编号',
                            `vsl_name` varchar(100) NOT NULL COMMENT '船名',
                            `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
                            `mmsi` varchar(20) COMMENT '水上移动通信标识码',
                            `imo_number` varchar(20) COMMENT 'IMO编号',
                            `registry_port` varchar(50) COMMENT '船籍港',
                            `length_overall` decimal(8,2) COMMENT '总长(米)',
                            `width` decimal(8,2) COMMENT '型宽(米)',
                            `depth` decimal(8,2) COMMENT '型深(米)',
                            `gross_tonnage` int COMMENT '总吨位',
                            `deadweight` int COMMENT '载重吨位',
                            `breeding_volume` decimal(10,2) COMMENT '养殖水体(立方米)',
                            `production_capacity` decimal(10,2) COMMENT '年产能力(吨)',
                            `engine_power` int COMMENT '主机功率(kw)',
                            `max_speed` decimal(5,1) COMMENT '航速(节)',
                            `endurance` int COMMENT '自持力(天)',
                            `has_processing` tinyint DEFAULT 0 COMMENT '是否有加工车间',
                            `has_cold_storage` tinyint DEFAULT 0 COMMENT '是否有冷藏舱',
                            `status` tinyint DEFAULT 1 COMMENT '1-在航 2-锚泊 3-维修',
                            `create_time` datetime,
                            `update_time` datetime,
                            `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                            `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `prod_plan` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `base_id` bigint COMMENT '所属基地ID (冗余字段，用于快速筛选)',
                             `parent_plan_id` bigint COMMENT '父计划ID (用于模板生成或计划拆分)',
                             `target_type` varchar(20) COMMENT '目标类型: pond(塘口), cage(网箱), vsl(工船)',
                             `target_id` bigint COMMENT '目标实体ID',
                             `plan_type` varchar(30) COMMENT '类型: feeding(投喂), medication(用药), harvest(收获), maintenance(维护)',
                             `title` varchar(255) COMMENT '计划标题',
                             `content_desc` text COMMENT '详细描述/操作指南',
                             `start_time` datetime COMMENT '计划开始时间',
                             `end_time` datetime COMMENT '计划结束时间',
                             `cycle_rule` varchar(50) COMMENT '循环规则: 如 "Every Monday"，为空则是一次性计划',
                             `status` varchar(20) DEFAULT 'draft' COMMENT '状态: draft(草稿), published(已发布), active(进行中), completed(已完成), cancelled(已取消)',
                             `owner_id` bigint COMMENT '制定人/管理员ID',
                             `assignee_group_id` bigint COMMENT '指派给哪个班组/角色',
                             `created_at` datetime DEFAULT (now()),
                             `updated_at` datetime DEFAULT (now()),
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `prod_task` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `plan_id` bigint COMMENT '来源计划ID (如果是临时任务则为空)',
                             `base_id` bigint COMMENT '所属基地ID (冗余)',
                             `task_title` varchar(255) COMMENT '任务标题 (生成时复制自计划)',
                             `target_type` varchar(20) COMMENT '目标类型 (生成时复制自计划)',
                             `target_id` bigint COMMENT '目标ID (生成时复制自计划)',
                             `action_time` datetime COMMENT '要求执行的具体时间 (如: 2023-10-27 08:00)',
                             `deadline_time` datetime COMMENT '最晚完成时间 (用于计算逾期)',
                             `status` varchar(20) DEFAULT 'pending' COMMENT '状态: pending(待办), assigned(已派发), doing(进行中), done(已完成), skipped(跳过/无需执行), expired(已过期)',
                             `assignee_id` bigint COMMENT '具体执行工人ID',
                             `cancel_reason` varchar(255) COMMENT '取消/跳过原因',
                             `created_at` datetime DEFAULT (now()),
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `prod_log` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT,
                            `task_id` bigint COMMENT '关联的任务ID (如果是按计划执行)',
                            `plan_id` bigint COMMENT '关联的计划ID (兜底字段)',
                            `base_id` bigint COMMENT '所属基地ID (冗余)',
                            `target_type` varchar(20),
                            `target_id` bigint,
                            `log_type` varchar(30) COMMENT '作业类型',
                            `action_time` datetime COMMENT '实际发生时间',
                            `quantity` decimal(10,2) COMMENT '实际数量/用量',
                            `photo_urls` text COMMENT '照片URL列表 (逗号分隔)',
                            `gps_lat` decimal(8,6) COMMENT '打卡纬度',
                            `gps_lng` decimal(9,6) COMMENT '打卡经度',
                            `source` varchar(20) DEFAULT 'app' COMMENT '来源: app(工人), admin(文员代录), system(自动)',
                            `created_by` bigint COMMENT '录入账号ID (可能是文员)',
                            `actual_worker_id` bigint COMMENT '实际干活的人ID (用于代录场景)',
                            `is_backfilled` boolean DEFAULT false COMMENT '是否事后补录',
                            `backfill_reason` varchar(255) COMMENT '补录原因',
                            `verify_status` varchar(20) DEFAULT 'auto' COMMENT 'auto(自动通过), pending(待审), rejected(驳回)',
                            `created_at` datetime DEFAULT (now())
);

CREATE TABLE `prod_plan_detail` (
                                    `plan_id` bigint PRIMARY KEY,
                                    `feed_amount` decimal(10,2) COMMENT '计划投喂量(kg)',
                                    `feed_variety` varchar(100) COMMENT '饲料品种',
                                    `drug_name` varchar(100) COMMENT '药品名称',
                                    `dosage` varchar(100) COMMENT '用量',
                                    `withdrawal_days` int COMMENT '休药期天数',
                                    `longitude` decimal(9,6) COMMENT '作业海域经度',
                                    `latitude` decimal(8,6) COMMENT '作业海域纬度',
                                    `weather_req` varchar(100) COMMENT '气象要求',
                                    `est_yield` decimal(10,2) COMMENT '预计产量'
);

CREATE TABLE `stk_inventory` (
                                 `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                 `base_id` bigint NOT NULL COMMENT '基地ID',
                                 `mat_id` bigint NOT NULL COMMENT '物资ID',
                                 `batch_no` varchar(50) COMMENT '批次号 (如果分批次管理)',
                                 `current_qty` decimal(12,4) DEFAULT 0 COMMENT '当前结存数量',
                                 `lock_qty` decimal(12,4) DEFAULT 0 COMMENT '锁定数量 (已分配给任务但未领用)',
                                 `last_update_time` datetime DEFAULT (now()),
                                 UNIQUE KEY `uk_mat` (`base_id`, `mat_id`, `batch_no`) -- 联合唯一索引
) COMMENT='物资实时库存表';

CREATE TABLE `mat_category` (
                                `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                `cat_code` varchar(50) UNIQUE NOT NULL COMMENT '分类编码',
                                `cat_name` varchar(100) NOT NULL COMMENT '分类名称',
                                `parent_id` bigint DEFAULT 0 COMMENT '父级ID (用于多级分类)',
                                `sort_order` int DEFAULT 0 COMMENT '排序',
                                `status` tinyint DEFAULT 1 COMMENT '状态',
                                `create_time` datetime,
                                `update_time` datetime,
                                `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                                `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `mat_info` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT,
                            `mat_code` varchar(50) UNIQUE NOT NULL COMMENT '物资编码 (如: FEED-001)',
                            `mat_name` varchar(100) NOT NULL COMMENT '物资名称',
                            `cat_id` bigint NOT NULL COMMENT '分类ID',
                            `spec` varchar(100) COMMENT '规格型号',
                            `unit` varchar(20) DEFAULT 'kg' COMMENT '计量单位',
                            `supplier_id` bigint COMMENT '默认供应商',
                            `min_stock` decimal(10,2) COMMENT '最低库存预警',
                            `max_stock` decimal(10,2) COMMENT '最高库存预警',
                            `status` tinyint DEFAULT 1 COMMENT '状态',
                            `withdrawal_days` int DEFAULT 0 COMMENT '休药期 (天)',
                            `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '参考单价 (元)',
                            `approval_code` varchar(100) COMMENT '批准文号/生产许可证号',
                            `manufacturer` varchar(100) COMMENT '生产厂家',
                            `create_time` datetime,
                            `update_time` datetime,
                            `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                            `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `mat_supplier` (
                                `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                `supplier_code` varchar(50) UNIQUE NOT NULL,
                                `supplier_name` varchar(100) NOT NULL,
                                `contact_person` varchar(50) COMMENT '联系人',
                                `phone` varchar(20),
                                `address` varchar(255),
                                `license_img` varchar(255) COMMENT '营业执照',
                                `status` tinyint DEFAULT 1,
                                `create_time` datetime,
                                `update_time` datetime,
                                `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                                `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `stk_record` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT,
                              `record_no` varchar(50) UNIQUE NOT NULL COMMENT '流水单号',
                              `base_id` bigint NOT NULL COMMENT '发生基地ID',
                              `mat_id` bigint NOT NULL COMMENT '物资ID',
                              `batch_no` varchar(50) COMMENT '批次号',
                              `type` varchar(20) NOT NULL COMMENT '类型: IN, OUT, ADJUST',
                              `change_qty` decimal(12,4) NOT NULL COMMENT '变动数量 (入库填正, 出库填负)',
                              `operator_id` bigint COMMENT '操作人ID',
                              `remark` varchar(255),
                              `create_time` datetime
);

CREATE TABLE `stk_usage` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `usage_no` varchar(50) UNIQUE NOT NULL COMMENT '使用单号',
                             `base_id` bigint NOT NULL,
                             `pond_id` bigint NOT NULL COMMENT '针对哪个塘口',
                             `task_id` bigint COMMENT '关联的生产任务ID (可选)',
                             `mat_id` bigint NOT NULL,
                             `use_qty` decimal(10,2) NOT NULL COMMENT '使用数量',
                             `unit_price` decimal(10,2) COMMENT '单价 (用于核算成本)',
                             `total_price` decimal(12,2) COMMENT '总价',
                             `operator_id` bigint COMMENT '操作人',
                             `use_time` datetime DEFAULT (now()),
                             `remark` varchar(255)
);

CREATE TABLE `med_record` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                              `base_id` bigint NOT NULL COMMENT '基地ID',
                              `pond_id` bigint NOT NULL COMMENT '塘口ID',
                              `drug_mat_id` bigint NOT NULL COMMENT '药品物资ID (关联 mat_info.id)',
                              `usage_qty` decimal(10,2) NOT NULL COMMENT '使用数量',
                              `admin_date` date NOT NULL COMMENT '施药日期 (仅日期)',
                              `withdrawal_days` int NOT NULL COMMENT '该药品的休药期天数 (快照)',
                              `ban_harvest_until` date NOT NULL COMMENT '禁止收获截止日期 (计算字段: admin_date + withdrawal_days)',
                              `log_id` bigint COMMENT '关联的生产日志ID (prod_log.id)',
                              `create_time` datetime COMMENT '记录创建时间'
);

CREATE TABLE `cert_strategy` (
                                 `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '策略ID',
                                 `strategy_name` varchar(100) NOT NULL COMMENT '策略名称 (如: 超市专用标准)',
                                 `spec_type` varchar(50) NOT NULL COMMENT '规格类型 (如: 10kg装, 散装)',
                                 `required_tests` text COMMENT '必检项目 (JSON或逗号分隔: 氯霉素,孔雀石绿)',
                                 `status` tinyint DEFAULT 1 COMMENT '1-启用 0-停用'
);

CREATE TABLE `cert_info` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
                             `cert_no` varchar(50) UNIQUE NOT NULL COMMENT '合格证编号 (全局唯一)',
                             `strategy_id` bigint NOT NULL COMMENT '使用的策略ID',
                             `issue_date` date NOT NULL COMMENT '开具日期',
                             `status` varchar(20) DEFAULT 'valid' COMMENT 'valid(有效), used(已使用), expired(过期)'
);

CREATE TABLE `cert_detail` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
                               `cert_id` bigint NOT NULL COMMENT '关联合格证ID',
                               `target_type` varchar(20) NOT NULL COMMENT '目标类型: pond(塘口), vsl(工船), batch(批次)',
                               `target_id` bigint NOT NULL COMMENT '目标实体ID (对应 pond_info.id 或 vsl_info.id)',
                               `quantity` decimal(12,2) NOT NULL COMMENT '关联数量 (斤)',
                               `is_withdrawal_passed` tinyint DEFAULT 0 COMMENT '休药期是否已过 (0-否 1-是)',
                               `is_test_passed` tinyint DEFAULT 0 COMMENT '药残检测是否合格 (0-否 1-是)',
                               `test_report_url` varchar(255) COMMENT '检测报告路径'
);

CREATE TABLE `trade_order` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
                               `order_no` varchar(50) UNIQUE NOT NULL COMMENT '订单编号',
                               `buyer_name` varchar(100) NOT NULL COMMENT '买家姓名/公司',
                               `buyer_phone` varchar(20) COMMENT '买家电话',
                               `total_amount` decimal(12,2) NOT NULL COMMENT '总金额',
                               `status` varchar(20) DEFAULT 'unpaid' COMMENT 'unpaid(待支付), paid(已支付), shipped(已发货), completed(已完成)',
                               `create_time` datetime,
                               `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                               `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `trade_item` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
                              `order_id` bigint NOT NULL COMMENT '订单ID',
                              `cert_id` bigint NOT NULL COMMENT '关联的合格证ID (核心: 确保可溯源)',
                              `species` varchar(50) NOT NULL COMMENT '品种 (如: 大黄鱼)',
                              `weight` decimal(10,2) NOT NULL COMMENT '重量',
                              `unit_price` decimal(10,2) NOT NULL COMMENT '单价',
                              `subtotal` decimal(12,2) NOT NULL COMMENT '小计',
                              `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                              `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `warn_rule` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT,
                             `rule_code` varchar(50) UNIQUE NOT NULL COMMENT '规则编码 (如: STK_LOW, MED_RISK)',
                             `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
                             `biz_module` varchar(30) NOT NULL COMMENT '所属业务模块 (STOCK, PROD, TRADE)',
                             `trigger_type` varchar(20) NOT NULL COMMENT '触发方式: TIMER(定时扫描), EVENT(实时事件)',
                             `check_logic` text COMMENT '校验逻辑脚本/表达式 (可选)',
                             `severity_default` varchar(10) DEFAULT 'medium' COMMENT '默认严重程度 (low/medium/high)',
                             `status` tinyint DEFAULT 1 COMMENT '状态 1-启用 0-停用',
                             `remark` varchar(255),
                             `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                             `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `warn_rule_param` (
                                   `id` bigint PRIMARY KEY AUTO_INCREMENT,
                                   `rule_id` bigint NOT NULL COMMENT '关联规则ID',
                                   `base_id` bigint COMMENT '适用基地ID (NULL=全平台通用)',
                                   `pond_id` bigint COMMENT '适用塘口ID (NULL=全基地通用)',
                                   `param_key` varchar(50) NOT NULL COMMENT '参数键 (如: min_stock, withdrawal_check)',
                                   `param_value` varchar(255) NOT NULL COMMENT '参数值 (如: 100, true)',
                                   `unit` varchar(20) COMMENT '单位 (如: kg, day)',
                                   `is_active` tinyint DEFAULT 1 COMMENT '是否启用该配置',
                                   `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                                   `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `warn_record` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT,
                               `record_no` varchar(50) UNIQUE NOT NULL COMMENT '预警单号',
                               `rule_id` bigint NOT NULL COMMENT '触发规则ID',
                               `base_id` bigint NOT NULL COMMENT '归属基地',
                               `target_type` varchar(20) COMMENT '目标类型 (POND, MAT, TASK)',
                               `target_id` bigint COMMENT '目标实体ID',
                               `title` varchar(150) NOT NULL COMMENT '预警标题',
                               `content` text COMMENT '详细内容 (如: 恩诺沙星休药期还有2天)',
                               `severity` varchar(10) NOT NULL COMMENT '严重程度 (low/medium/high)',
                               `trigger_time` datetime NOT NULL COMMENT '触发时间',
                               `status` varchar(20) DEFAULT 'unhandled' COMMENT '状态: unhandled(未处理), processed(已处理), ignored(已忽略)',
                               `handler_id` bigint COMMENT '处理人ID',
                               `handle_time` datetime COMMENT '处理时间',
                               `handle_remark` varchar(255) COMMENT '处理备注',
                               `is_delete` tinyint DEFAULT 0 NOT NULL COMMENT '是否删除: 0-正常, 1-已删除',
                               `delete_time` datetime NULL COMMENT '删除时间'
);

CREATE TABLE `iot_device_type` (
                                   `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                   `type_code` varchar(50) UNIQUE NOT NULL COMMENT '设备类型编码 (如: DO_METER, PH_METER)',
                                   `type_name` varchar(100) NOT NULL COMMENT '设备类型名称',
                                   `manufacturer` varchar(100) COMMENT '生产厂家',
                                   `protocol_type` varchar(50) DEFAULT 'MQTT' COMMENT '通信协议 (MQTT, Modbus, HTTP)',
                                   `description` varchar(255) COMMENT '设备功能描述',
                                   `status` tinyint DEFAULT 1 COMMENT '状态 1-正常 0-停用'
);

CREATE TABLE `iot_device` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                              `device_sn` varchar(100) UNIQUE NOT NULL COMMENT '设备唯一序列号',
                              `device_name` varchar(100) NOT NULL COMMENT '设备名称',
                              `type_id` bigint NOT NULL COMMENT '关联设备类型ID',
                              `base_id` bigint NOT NULL COMMENT '所属基地ID',
                              `pond_id` bigint COMMENT '所属塘口ID (NULL为基地级气象站)',
                              `ip_address` varchar(50) COMMENT 'IP地址/域名',
                              `port` int COMMENT '端口号',
                              `auth_info` text COMMENT '鉴权信息 (JSON格式,如username/password)',
                              `status` tinyint DEFAULT 1 COMMENT '运行状态 1-在线 0-离线 2-维护',
                              `last_heartbeat` datetime COMMENT '最后心跳时间',
                              `install_time` datetime COMMENT '安装时间',
                              `remark` varchar(255) COMMENT '备注'
);

CREATE TABLE `iot_device_config` (
                                     `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                     `device_id` bigint NOT NULL COMMENT '关联设备ID',
                                     `param_key` varchar(100) NOT NULL COMMENT '参数键 (如: REPORT_INTERVAL, ALARM_THRESHOLD_HIGH)',
                                     `param_value` varchar(255) NOT NULL COMMENT '参数值',
                                     `is_active` tinyint DEFAULT 1 COMMENT '是否激活',
                                     `update_time` datetime COMMENT '更新时间'
);

CREATE TABLE `iot_ts_data` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                               `device_id` bigint NOT NULL COMMENT '设备ID',
                               `metric_key` varchar(50) NOT NULL COMMENT '指标键 (如: dissolved_oxygen, ph_value)',
                               `metric_value` double NOT NULL COMMENT '数值',
                               `record_time` datetime NOT NULL COMMENT '记录时间',
                               `quality_flag` tinyint DEFAULT 1 COMMENT '数据质量 1-正常 0-异常',
                               `source_type` varchar(20) DEFAULT 'IOT' COMMENT '数据来源: IOT(设备), MANUAL(手动)',
                               `operator_id` bigint COMMENT '操作人ID (仅手动录入时有效)'
);

CREATE TABLE `iot_alert` (
                             `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                             `alert_no` varchar(50) UNIQUE NOT NULL COMMENT '告警编号',
                             `device_id` bigint NOT NULL COMMENT '触发设备ID',
                             `alert_type` varchar(50) NOT NULL COMMENT '告警类型 (OFFLINE, DATA_OVERFLOW)',
                             `title` varchar(150) NOT NULL COMMENT '告警标题',
                             `content` text COMMENT '告警详情',
                             `status` varchar(20) DEFAULT 'UNHANDLED' COMMENT '状态 UNHANDLED, HANDLED',
                             `trigger_time` datetime NOT NULL COMMENT '触发时间',
                             `handle_time` datetime COMMENT '处理时间'
);

CREATE TABLE `iot_alert_rule` (
                                  `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
                                  `device_type_id` bigint NOT NULL COMMENT '适用设备类型',
                                  `condition_expr` text NOT NULL COMMENT '触发表达式 (如: value > 8.5)',
                                  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '严重级别',
                                  `is_enabled` tinyint DEFAULT 1 COMMENT '是否启用'
);

CREATE TABLE `iot_device_maintenance` (
                                          `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                          `device_id` bigint NOT NULL COMMENT '设备ID',
                                          `maint_type` varchar(50) NOT NULL COMMENT '维护类型 (CALIBRATION, REPAIR, REPLACE)',
                                          `operator_id` bigint NOT NULL COMMENT '操作人ID',
                                          `before_value` text COMMENT '校准前读数',
                                          `after_value` text COMMENT '校准后读数',
                                          `remark` varchar(255) COMMENT '备注',
                                          `maint_time` datetime NOT NULL COMMENT '维护时间'
);

CREATE TABLE `env_wq` (
                          `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                          `pond_id` bigint UNIQUE NOT NULL COMMENT '塘口ID',
                          `update_time` datetime NOT NULL COMMENT '更新时间',
                          `dissolved_oxygen` double COMMENT '溶解氧 (mg/L)',
                          `ph_value` double COMMENT 'pH值',
                          `water_temperature` double COMMENT '水温 (℃)',
                          `ammonia_nitrogen` double COMMENT '氨氮 (mg/L)',
                          `nitrite` double COMMENT '亚硝酸盐 (mg/L)',
                          `turbidity` double COMMENT '浊度 (NTU)',
                          `salinity` double COMMENT '盐度 (‰)',
                          `data_source` varchar(20) DEFAULT 'IOT' COMMENT '最新数据来源: IOT(设备), MANUAL(手动)',
                          `last_operator_id` bigint COMMENT '最后操作人ID (如果是手动更新)',
                          `do_status` varchar(20) COMMENT '溶解氧状态',
                          `ph_status` varchar(20) COMMENT 'pH状态'
);

CREATE TABLE `env_weather` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                               `base_id` bigint UNIQUE NOT NULL COMMENT '基地ID',
                               `update_time` datetime NOT NULL COMMENT '更新时间',
                               `air_temperature` double COMMENT '气温',
                               `humidity` double COMMENT '湿度',
                               `wind_speed` double COMMENT '风速',
                               `wind_direction` varchar(20) COMMENT '风向',
                               `rainfall` double COMMENT '降雨量',
                               `weather_condition` varchar(50) COMMENT '天气状况',
                               `data_source` varchar(20) DEFAULT 'IOT' COMMENT '最新数据来源: IOT(设备), MANUAL(手动)',
                               `last_operator_id` bigint COMMENT '最后操作人ID'
);

CREATE TABLE `env_wq_hist` (
                               `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                               `pond_id` bigint NOT NULL COMMENT '塘口ID',
                               `stat_date` datetime NOT NULL COMMENT '统计时间点 (精确到小时或天)',
                               `avg_do` double COMMENT '平均溶氧',
                               `min_do` double COMMENT '最低溶氧',
                               `max_do` double COMMENT '最高溶氧',
                               `avg_temp` double COMMENT '平均水温',
                               `avg_ph` double COMMENT '平均pH'
);

CREATE TABLE `env_weather_hist` (
                                    `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                    `base_id` bigint NOT NULL COMMENT '基地ID',
                                    `stat_date` date NOT NULL COMMENT '统计日期',
                                    `max_temp` double COMMENT '最高气温',
                                    `min_temp` double COMMENT '最低气温',
                                    `total_rainfall` double COMMENT '累计降雨',
                                    `max_wind_speed` double COMMENT '最大风速'
);

CREATE TABLE `env_tide` (
                            `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                            `base_id` bigint NOT NULL COMMENT '基地ID',
                            `tide_date` date NOT NULL COMMENT '日期',
                            `tide_time` time NOT NULL COMMENT '时间',
                            `tide_type` varchar(20) NOT NULL COMMENT '类型: HIGH(高潮), LOW(低潮)',
                            `tide_height` double NOT NULL COMMENT '潮高 (米)'
);

CREATE TABLE `sys_notice_template` (
                                       `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                       `template_code` varchar(50) UNIQUE NOT NULL COMMENT '模板编码 (如: ALARM_DISSOLVED_OXYGEN, WARN_STOCK_LOW)',
                                       `template_name` varchar(100) NOT NULL COMMENT '模板名称',
                                       `title` varchar(255) NOT NULL COMMENT '标题模板 (支持{占位符})',
                                       `content` text NOT NULL COMMENT '内容模板 (支持{占位符})',
                                       `channel` varchar(20) NOT NULL COMMENT '默认渠道: SMS, APP, WECHAT, EMAIL',
                                       `status` tinyint DEFAULT 1 COMMENT '是否启用'
);

CREATE TABLE `sys_notice_record` (
                                     `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                     `biz_id` bigint COMMENT '关联的业务ID (如 iot_alert.id 或 warn_record.id)',
                                     `biz_type` varchar(50) COMMENT '业务类型 (ALERT, WARN, NOTICE)',
                                     `template_id` bigint NOT NULL COMMENT '使用的模板ID',
                                     `user_id` bigint NOT NULL COMMENT '接收人ID',
                                     `title` varchar(255) NOT NULL COMMENT '实际标题 (渲染后)',
                                     `content` text NOT NULL COMMENT '实际内容 (渲染后)',
                                     `channel` varchar(20) NOT NULL COMMENT '发送渠道',
                                     `receiver_addr` varchar(100) COMMENT '接收地址 (手机号/邮箱/OpenID)',
                                     `status` varchar(20) DEFAULT 'PENDING' COMMENT 'PENDING(待发送), SUCCESS(成功), FAILED(失败)',
                                     `read_status` tinyint DEFAULT 0 COMMENT '0-未读 1-已读',
                                     `send_time` datetime COMMENT '发送时间',
                                     `read_time` datetime COMMENT '阅读时间'
);

CREATE TABLE `sys_user_notice_pref` (
                                        `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                        `user_id` bigint NOT NULL COMMENT '用户ID',
                                        `category` varchar(50) NOT NULL COMMENT '分类: ALARM(告警), WARN(预警), NOTICE(通知)',
                                        `channel` varchar(20) NOT NULL COMMENT '渠道: SMS, APP, WECHAT',
                                        `is_enabled` tinyint DEFAULT 1 COMMENT '是否开启该渠道'
);

CREATE TABLE `sys_notice` (
                              `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                              `title` varchar(255) NOT NULL COMMENT '公告标题',
                              `content` text NOT NULL COMMENT '公告内容',
                              `publisher_id` bigint NOT NULL COMMENT '发布人ID',
                              `publish_time` datetime NOT NULL COMMENT '发布时间',
                              `expire_time` datetime COMMENT '过期时间',
                              `status` tinyint DEFAULT 1 COMMENT '1-生效 0-撤回'
);

CREATE TABLE `sys_notice_user` (
                                   `user_id` bigint NOT NULL,
                                   `notice_id` bigint NOT NULL,
                                   `read_status` tinyint DEFAULT 0 COMMENT '0-未读 1-已读',
                                   `read_time` datetime COMMENT '阅读时间',
                                   PRIMARY KEY (`user_id`, `notice_id`)
);

CREATE TABLE `biz_operation_snap` (
                                      `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                      `base_id` bigint NOT NULL COMMENT '基地ID',
                                      `target_type` varchar(20) NOT NULL COMMENT '目标类型: POND(塘口), CYCLE(周期)',
                                      `target_id` bigint NOT NULL COMMENT '目标ID (pond_info.id 或 周期ID)',
                                      `calc_date` date NOT NULL COMMENT '计算日期 (YYYY-MM-DD)',
                                      `current_stock` decimal(12,2) COMMENT '当前存塘量 (斤)',
                                      `est_yield` decimal(12,2) COMMENT '预计总产量 (斤)',
                                      `avg_weight` decimal(8,2) COMMENT '平均规格 (g/尾)',
                                      `cost_feed` decimal(12,2) DEFAULT 0 COMMENT '饲料成本',
                                      `cost_drug` decimal(12,2) DEFAULT 0 COMMENT '药品成本',
                                      `cost_electricity` decimal(12,2) DEFAULT 0 COMMENT '电费',
                                      `cost_fry` decimal(12,2) DEFAULT 0 COMMENT '苗种成本',
                                      `cost_labor` decimal(12,2) DEFAULT 0 COMMENT '人工成本',
                                      `cost_depreciation` decimal(12,2) DEFAULT 0 COMMENT '折旧成本',
                                      `total_cost` decimal(14,2) COMMENT '累计总成本',
                                      `market_price` decimal(8,2) COMMENT '当前市场参考价 (元/斤)',
                                      `est_revenue` decimal(14,2) COMMENT '预估总收入 (存塘*市价)',
                                      `profit` decimal(14,2) COMMENT '预估利润 (收入-成本)',
                                      `unit_cost` decimal(8,2) COMMENT '单位成本 (元/斤)',
                                      `fcr` decimal(5,2) COMMENT '饲料系数 (Feed Conversion Ratio)',
                                      `status` varchar(20) DEFAULT 'valid' COMMENT '数据状态'
);

CREATE TABLE `biz_ai_diagnosis` (
                                    `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                    `user_id` bigint NOT NULL COMMENT '请求人ID (老板/管理员)',
                                    `diag_type` varchar(50) DEFAULT 'DAILY' COMMENT '诊断类型: DAILY(日报), EVENT(事件触发)',
                                    `input_time` datetime NOT NULL COMMENT '诊断请求时间',
                                    `input_data` text COMMENT '输入的原始数据摘要 (快照ID列表或JSON)',
                                    `analysis_text` text COMMENT 'AI生成的自然语言分析 (Markdown格式)',
                                    `action_items` text COMMENT '提取的待办事项 (JSON Array)',
                                    `report_file_url` varchar(255) COMMENT '生成的PDF/Word报告路径',
                                    `status` varchar(20) DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILED, PROCESSING',
                                    `create_time` datetime COMMENT '报告生成时间'
);

CREATE TABLE `biz_purchase_suggest` (
                                        `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                        `suggest_no` varchar(50) UNIQUE NOT NULL COMMENT '建议单号',
                                        `source_type` varchar(20) COMMENT '来源: SYSTEM(库存预警), AI(智能推荐)',
                                        `base_id` bigint NOT NULL COMMENT '建议采购基地',
                                        `total_amount` decimal(12,2) COMMENT '预估采购金额',
                                        `status` varchar(20) DEFAULT 'DRAFT' COMMENT 'DRAFT(草稿), CONFIRMED(已确认), CANCELLED',
                                        `create_time` datetime COMMENT '创建时间'
);

CREATE TABLE `biz_purchase_suggest_item` (
                                             `id` bigint PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
                                             `suggest_id` bigint NOT NULL COMMENT '关联建议单ID',
                                             `mat_id` bigint NOT NULL COMMENT '物资ID',
                                             `suggest_qty` decimal(12,2) NOT NULL COMMENT '建议采购数量',
                                             `current_stock` decimal(12,2) NOT NULL COMMENT '当前库存',
                                             `min_stock` decimal(12,2) NOT NULL COMMENT '安全库存',
                                             `remark` varchar(255) COMMENT '备注 (如: 用于补充3号塘缺口)'
);

ALTER TABLE `user` ADD FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`);

ALTER TABLE `sys_user_role` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_user_role` ADD FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`);

ALTER TABLE `sys_role_menu` ADD FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`);

ALTER TABLE `sys_role_menu` ADD FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`);

ALTER TABLE `base_info` ADD FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`);

ALTER TABLE `base_info` ADD FOREIGN KEY (`breeder_id`) REFERENCES `biz_breeder` (`id`);

ALTER TABLE `pond_info` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `cage_info` ADD FOREIGN KEY (`breeder_id`) REFERENCES `biz_breeder` (`id`);

ALTER TABLE `cage_info` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `vsl_info` ADD FOREIGN KEY (`breeder_id`) REFERENCES `biz_breeder` (`id`);

ALTER TABLE `prod_plan` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `prod_plan` ADD FOREIGN KEY (`parent_plan_id`) REFERENCES `prod_plan` (`id`);

ALTER TABLE `prod_task` ADD FOREIGN KEY (`plan_id`) REFERENCES `prod_plan` (`id`);

ALTER TABLE `prod_task` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `prod_log` ADD FOREIGN KEY (`task_id`) REFERENCES `prod_task` (`id`);

ALTER TABLE `prod_log` ADD FOREIGN KEY (`plan_id`) REFERENCES `prod_plan` (`id`);

ALTER TABLE `prod_log` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `prod_plan_detail` ADD FOREIGN KEY (`plan_id`) REFERENCES `prod_plan` (`id`);

ALTER TABLE `mat_info` ADD FOREIGN KEY (`cat_id`) REFERENCES `mat_category` (`id`);

ALTER TABLE `mat_info` ADD FOREIGN KEY (`supplier_id`) REFERENCES `mat_supplier` (`id`);

ALTER TABLE `stk_record` ADD FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`);

ALTER TABLE `stk_usage` ADD FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`);

ALTER TABLE `stk_usage` ADD FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `med_record` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `med_record` ADD FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `med_record` ADD FOREIGN KEY (`drug_mat_id`) REFERENCES `mat_info` (`id`);

ALTER TABLE `med_record` ADD FOREIGN KEY (`log_id`) REFERENCES `prod_log` (`id`);

ALTER TABLE `cert_info` ADD FOREIGN KEY (`strategy_id`) REFERENCES `cert_strategy` (`id`);

ALTER TABLE `cert_detail` ADD FOREIGN KEY (`cert_id`) REFERENCES `cert_info` (`id`);

ALTER TABLE `cert_detail` ADD FOREIGN KEY (`target_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `trade_item` ADD FOREIGN KEY (`order_id`) REFERENCES `trade_order` (`id`);

ALTER TABLE `trade_item` ADD FOREIGN KEY (`cert_id`) REFERENCES `cert_info` (`id`);

ALTER TABLE `iot_device` ADD FOREIGN KEY (`type_id`) REFERENCES `iot_device_type` (`id`);

ALTER TABLE `iot_device_config` ADD FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`);

ALTER TABLE `iot_ts_data` ADD FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`);

ALTER TABLE `iot_alert` ADD FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`);

ALTER TABLE `iot_alert_rule` ADD FOREIGN KEY (`device_type_id`) REFERENCES `iot_device_type` (`id`);

ALTER TABLE `iot_device_maintenance` ADD FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`);

ALTER TABLE `env_wq` ADD FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `env_weather` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `env_wq_hist` ADD FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `env_weather_hist` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `env_tide` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `env_wq` ADD FOREIGN KEY (`last_operator_id`) REFERENCES `user` (`id`);

ALTER TABLE `env_weather` ADD FOREIGN KEY (`last_operator_id`) REFERENCES `user` (`id`);

ALTER TABLE `iot_ts_data` ADD FOREIGN KEY (`operator_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_notice_record` ADD FOREIGN KEY (`biz_id`) REFERENCES `iot_alert` (`id`);

ALTER TABLE `sys_notice_record` ADD FOREIGN KEY (`biz_id`) REFERENCES `warn_record` (`id`);

ALTER TABLE `sys_notice_record` ADD FOREIGN KEY (`template_id`) REFERENCES `sys_notice_template` (`id`);

ALTER TABLE `sys_notice_record` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_user_notice_pref` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_notice` ADD FOREIGN KEY (`publisher_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_notice_user` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `sys_notice_user` ADD FOREIGN KEY (`notice_id`) REFERENCES `sys_notice` (`id`);

ALTER TABLE `biz_operation_snap` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `biz_operation_snap` ADD FOREIGN KEY (`target_id`) REFERENCES `pond_info` (`id`);

ALTER TABLE `biz_ai_diagnosis` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `biz_purchase_suggest` ADD FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`);

ALTER TABLE `biz_purchase_suggest_item` ADD FOREIGN KEY (`suggest_id`) REFERENCES `biz_purchase_suggest` (`id`);

ALTER TABLE `biz_purchase_suggest_item` ADD FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`);

-- 初始化字典数据
-- 基地类型字典
INSERT INTO `sys_dict_type` (`dict_type`, `dict_name`, `dict_desc`, `status`, `create_time`) 
VALUES ('base_type', '基地类型', '养殖基地的分类类型', 1, NOW());

INSERT INTO `sys_dict_data` (`dict_type`, `dict_label`, `dict_value`, `sort_order`, `status`, `create_time`) 
VALUES 
('base_type', '淡水养殖基地', 'freshwater', 1, 1, NOW()),
('base_type', '海水养殖基地', 'seawater', 2, 1, NOW()),
('base_type', '综合养殖基地', 'comprehensive', 3, 1, NOW()),
('base_type', '工厂化养殖基地', 'industrial', 4, 1, NOW());
