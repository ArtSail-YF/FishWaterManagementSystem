-- IoT '' COMMENT '' 需要单引号

ALTER TABLE iot_alert_rule ADD COLUMN metric_key varchar(50) DEFAULT NULL
  COMMENT '指标键 如: dissolved_oxygen, ph_value' AFTER condition_expr;

ALTER TABLE iot_alert_rule ADD COLUMN remark varchar(255) DEFAULT NULL
  COMMENT '备注' AFTER is_enabled;

ALTER TABLE iot_alert ADD COLUMN severity varchar(10) DEFAULT 'MEDIUM'
  COMMENT '严重级别 HIGH/MEDIUM/LOW' AFTER content;

ALTER TABLE iot_alert ADD COLUMN handler_id bigint DEFAULT NULL
  COMMENT '处理人ID' AFTER handle_time;

ALTER TABLE iot_alert ADD COLUMN handle_note varchar(500) DEFAULT NULL
  COMMENT '处理备注' AFTER handler_id;

-- 然后跑 iot-data.sql
