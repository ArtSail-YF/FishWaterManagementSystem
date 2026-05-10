
-- ============================================================
-- 用药记录模块测试数据 (基于 database_backup.sql 真实结构)
-- ============================================================

-- 1. 插入生产日志 (prod_log) - 作为用药记录的父级记录
-- 注意：prod_log 在 base.sql 中没有 is_delete 字段，且 create_time/update_time 有默认值
INSERT INTO `prod_log`
(`task_id`, `plan_id`, `base_id`, `target_type`, `target_id`, `batch_no`, `log_type`, `action_time`, `quantity`, `photo_urls`, `env_data`, `gps_lat`, `gps_lng`, `location_city`, `source`, `created_by`, `actual_worker_id`, `is_backfilled`, `status_flag`, `backfill_reason`, `remark`, `verify_status`)
VALUES
    (NULL, 7, 1, 'pond', 1, NULL, 'medication', '2026-05-21 09:30:00', 500.00, 'https://example.com/med1.jpg', NULL, 24.567890, 118.123456, '厦门市', 'app', 5002, 5002, false, 'normal', NULL, '治疗出血病，内服恩诺沙星', 'auto'),
    (NULL, 7, 1, 'pond', 1, NULL, 'medication', '2026-05-22 09:30:00', 500.00, 'https://example.com/med2.jpg', NULL, 24.567890, 118.123456, '厦门市', 'app', 5002, 5002, false, 'normal', NULL, '治疗出血病，第2天投药', 'auto'),
    (NULL, NULL, 1, 'pond', 3, NULL, 'medication', '2026-05-10 14:00:00', 2000.00, NULL, NULL, 24.600000, 118.200000, '厦门市', 'manual', 1001, 1001, false, 'normal', NULL, '对虾塘常规消毒', 'auto');

-- 2. 插入用药详情记录 (med_record)
-- 关联关系：
-- med_record.log_id -> prod_log.id
-- med_record.drug_mat_id -> mat_info.id (15:恩诺沙星, 17:聚维酮碘)
-- med_record.base_id -> base_info.id
-- med_record.pond_id -> pond_info.id
INSERT INTO `med_record`
(`base_id`, `pond_id`, `drug_mat_id`, `usage_qty`, `admin_date`, `withdrawal_days`, `ban_harvest_until`, `log_id`)
VALUES
    (1, 1, 15, 500.00, '2026-05-21', 20, '2026-06-10', LAST_INSERT_ID() - 2), -- 关联第一条日志 (假设自增ID连续)
    (1, 1, 15, 500.00, '2026-05-22', 20, '2026-06-11', LAST_INSERT_ID() - 1), -- 关联第二条日志
    (1, 3, 17, 2000.00, '2026-05-10', 7, '2026-05-17', LAST_INSERT_ID());     -- 关联第三条日志

-- 说明：
-- 1. LAST_INSERT_ID() 在批量插入时可能不准确，生产环境建议手动指定 ID 或使用存储过程。
-- 2. 这里的 SQL 仅用于演示数据结构，实际使用时请根据 prod_log 生成的真实 ID 调整 log_id。
-- 3. 药品休药期天数来自 mat_info.withdrawal_days (恩诺沙星20天, 聚维酮碘0天但此处模拟为7天)。