-- IoT 时序数据表（设备上报数据）
CREATE TABLE IF NOT EXISTS `iot_ts_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `metric_key` varchar(50) NOT NULL COMMENT '指标键 (如: dissolved_oxygen, ph_value, temperature)',
  `metric_value` double NOT NULL COMMENT '数值',
  `record_time` datetime NOT NULL COMMENT '记录时间',
  `quality_flag` tinyint DEFAULT '1' COMMENT '数据质量 1-正常 0-异常',
  `source_type` varchar(20) DEFAULT 'IOT' COMMENT '数据来源: IOT(设备), MANUAL(手动)',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人ID (仅手动录入时有效)',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_record_time` (`record_time`),
  KEY `idx_device_metric_time` (`device_id`, `metric_key`, `record_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 设备时序数据';

-- IoT 告警记录表
CREATE TABLE IF NOT EXISTS `iot_alert` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `alert_no` varchar(50) NOT NULL COMMENT '告警编号',
  `device_id` bigint NOT NULL COMMENT '触发设备ID',
  `alert_type` varchar(50) NOT NULL COMMENT '告警类型 (OFFLINE, DATA_OVERFLOW, DATA_LOW)',
  `title` varchar(150) NOT NULL COMMENT '告警标题',
  `content` text COMMENT '告警详情',
  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '严重级别 HIGH/MEDIUM/LOW',
  `status` varchar(20) DEFAULT 'UNHANDLED' COMMENT '状态 UNHANDLED, HANDLED',
  `trigger_time` datetime NOT NULL COMMENT '触发时间',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  `handler_id` bigint DEFAULT NULL COMMENT '处理人ID',
  `handle_note` varchar(500) DEFAULT NULL COMMENT '处理备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `alert_no` (`alert_no`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_status` (`status`),
  KEY `idx_trigger_time` (`trigger_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 告警记录';

-- IoT 告警规则表
CREATE TABLE IF NOT EXISTS `iot_alert_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `device_type_id` bigint NOT NULL COMMENT '适用设备类型',
  `metric_key` varchar(50) NOT NULL COMMENT '指标键',
  `condition_expr` text NOT NULL COMMENT '触发表达式 (如: value > 8.5)',
  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '严重级别 HIGH/MEDIUM/LOW',
  `is_enabled` tinyint DEFAULT '1' COMMENT '是否启用 1-启用 0-禁用',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_device_type_id` (`device_type_id`),
  KEY `idx_is_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 告警规则';

-- IoT 设备维护记录表
CREATE TABLE IF NOT EXISTS `iot_device_maintenance` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_id` bigint NOT NULL COMMENT '关联设备ID',
  `maint_type` varchar(50) DEFAULT 'CALIBRATE' COMMENT '维护类型 CALIBRATE/REPAIR/INSPECT/UPGRADE',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人ID',
  `before_value` text COMMENT '维护前读数/状态',
  `after_value` text COMMENT '维护后读数/状态',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `maint_time` datetime NOT NULL COMMENT '维护时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_maint_time` (`maint_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 设备维护记录';
