-- 修改 prod_plan 表字段名
ALTER TABLE `prod_plan` CHANGE COLUMN `created_at` `create_time` datetime DEFAULT (now()) COMMENT '创建时间';
ALTER TABLE `prod_plan` CHANGE COLUMN `updated_at` `update_time` datetime DEFAULT (now()) COMMENT '更新时间';

-- 修改 prod_task 表字段名
ALTER TABLE `prod_task` CHANGE COLUMN `created_at` `create_time` datetime DEFAULT (now()) COMMENT '创建时间';
ALTER TABLE `prod_task` ADD COLUMN `update_time` datetime DEFAULT (now()) COMMENT '更新时间' AFTER `create_time`;

-- 修改 prod_log 表字段名
ALTER TABLE `prod_log` CHANGE COLUMN `created_at` `create_time` datetime DEFAULT (now()) COMMENT '创建时间';
ALTER TABLE `prod_log` ADD COLUMN `update_time` datetime DEFAULT (now()) COMMENT '更新时间' AFTER `create_time`;



ALTER TABLE prod_log
    -- 1. 核心业务关联：记录当时用的饲料/药品是哪个批次的
--    场景：如果这批鱼药出问题，通过这个字段查是哪批货，或者查这个塘用了哪批货
    ADD COLUMN batch_no VARCHAR(50) COMMENT '物料批次号 (用药/投喂时记录)' AFTER target_id,

    -- 2. 异常标记：标记这条日志是否正常
--    场景：工人喂料时发现鱼不吃，或者设备坏了，把这个标记设为 abnormal，后台好筛选
    ADD COLUMN status_flag VARCHAR(20) DEFAULT 'normal' COMMENT '状态(normal, abnormal)' AFTER is_backfilled,

    -- 3. 现场环境快照 (JSON)：记录当时的水温、溶氧、pH等
--    场景：分析鱼为什么死的时候，光看喂了多少料没用，得看当时水质好不好
    ADD COLUMN env_data JSON COMMENT '环境数据快照 (温度/溶氧/PH等)' AFTER photo_urls,

    -- 4. 纯文本备注：给工人留个吐槽或说明的地方
--    场景：非结构化数据，比如“今天风大，少喂了一半”
    ADD COLUMN remark VARCHAR(255) COMMENT '人工备注/异常描述' AFTER backfill_reason,

    -- 5. 行政区域冗余：避免每次查经纬度都要去调地图API
--    场景：快速统计“厦门基地”或“同安区”的产量，不用每次都算GPS
    ADD COLUMN location_city VARCHAR(50) COMMENT '作业城市 (如: 厦门市)' AFTER gps_lng;


ALTER TABLE prod_task
    ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' COMMENT '优先级 (high, medium, low)',
    ADD COLUMN source_type VARCHAR(20) COMMENT '来源类型 (plan:计划, alert:预警, manual:人工)',
    ADD COLUMN source_id BIGINT COMMENT '来源ID (关联计划ID或预警ID)';

ALTER TABLE mat_info
-- 1. 休药期：用药后必须等待的天数才能捕捞上市 (合规核心)
    ADD COLUMN withdrawal_days INT DEFAULT 0 COMMENT '休药期 (天)',

-- 2. 参考单价：用于计算库存价值和生产成本 (成本核心)
    ADD COLUMN unit_price DECIMAL(10, 2) DEFAULT 0.00 COMMENT '参考单价 (元)',

-- 3. 批准文号：渔药合规必备 (如: 兽药字xxxxx)
    ADD COLUMN approval_code VARCHAR(100) COMMENT '批准文号/生产许可证号',

-- 4. 生产厂家：便于溯源
    ADD COLUMN manufacturer VARCHAR(100) COMMENT '生产厂家';

CREATE TABLE pond_daily_stats (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  base_id BIGINT COMMENT '基地ID',
                                  pond_id BIGINT COMMENT '塘口ID',
                                  stat_date DATE COMMENT '统计日期',

                                  total_feed DECIMAL(10,2) DEFAULT 0 COMMENT '今日总投喂量(kg)',
                                  total_mortality DECIMAL(10,2) DEFAULT 0 COMMENT '今日总死亡量(kg)',
                                  total_harvest DECIMAL(10,2) DEFAULT 0 COMMENT '今日总捕捞量(kg)',

                                  current_stock_estimate DECIMAL(10,2) COMMENT '当前预估存塘量(kg)',
                                  create_time DATETIME DEFAULT NOW()
);

CREATE TABLE fin_cost_record (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 base_id BIGINT,
                                 target_type VARCHAR(20) COMMENT '对象 (pond:塘口, batch:批次)',
                                 target_id BIGINT,

                                 cost_type VARCHAR(20) COMMENT '费用类型 (feed:饲料, drug:药品, labor:人工, energy:水电)',
                                 amount DECIMAL(12,2) COMMENT '金额',
                                 related_log_id BIGINT COMMENT '关联的生产日志ID',

                                 occur_time DATETIME COMMENT '发生时间',
                                 create_time DATETIME DEFAULT NOW()
);


INSERT INTO mat_category (
    cat_code,
    cat_name,
    parent_id,
    sort_order,
    status
) VALUES
      ('feed', '饲料', 0, 1, 1),
      ('drug', '渔药', 0, 2, 1),
      ('disinfectant', '消毒剂', 0, 3, 1),
      ('tool', '工具设备', 0, 4, 1);


-- 先清空一下，防止有脏数据（可选）
DELETE FROM mat_supplier;

-- 先清空表，确保 ID 从 1 开始（可选，但推荐）
TRUNCATE TABLE mat_supplier;

-- 插入供应商数据
INSERT INTO mat_supplier (
    supplier_code,
    supplier_name,
    contact_person,
    phone,
    address,
    status
) VALUES
      ('SUP001', '厦门汇贤生物科技有限公司', '张经理', '13800138001', '厦门市集美区', 1),
      ('SUP002', '福建海大饲料有限公司', '李总', '13900139002', '福州市福清市', 1),
      ('SUP003', '中牧实业股份有限公司', '王销售', '13700137003', '北京市丰台区', 1);

INSERT INTO mat_info (
    mat_code, mat_name, cat_id, spec, unit,
    supplier_id, min_stock, max_stock, status,
    withdrawal_days, unit_price, approval_code, manufacturer
) VALUES
-- ================= 饲料类 (cat_id = 1) =================
('FEED-001', '通威草鱼配合饲料 101', 1, '颗粒直径 4mm', 'kg', 1, 500, 5000, 1, 0, 5.20, '饲审(2023)01-001', '通威股份有限公司'),
('FEED-002', '海大鲈鱼膨化料 8808', 1, '颗粒直径 6mm', 'kg', 2, 200, 2000, 1, 0, 8.50, '饲审(2024)05-088', '广东海大集团'),

-- ================= 渔药类 (cat_id = 2) =================
('DRUG-001', '恩诺沙星粉', 2, '100g:5g', '瓶', 3, 5, 50, 1, 20, 45.00, '兽药字190032345', '中牧实业股份有限公司'),
('DRUG-002', '氟苯尼考粉', 2, '100g:10g', '瓶', 3, 5, 50, 1, 30, 65.00, '兽药字140012233', '齐鲁动物保健品'),

-- ================= 消毒剂类 (cat_id = 3) =================
('DIS-001', '聚维酮碘溶液', 3, '10% 500ml', '瓶', 3, 10, 100, 1, 0, 25.00, '兽药字190012345', '中牧实业股份有限公司');