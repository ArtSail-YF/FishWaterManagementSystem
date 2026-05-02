好的！我为您按模块分成10个独立的ER图，每个模块包含表定义和关系，您可以分别复制到 dbdiagram.io 中生成：
📁 模块1：系统基础模块（10张表）
plaintext

编辑

// ========================================
// 系统基础模块 - 用户权限、菜单、字典、日志
// ========================================

Table sys_user {
  id bigint [pk, increment]
  username varchar(50) [unique, not null]
  password varchar(100) [not null]
  real_name varchar(50)
  phone varchar(20)
  email varchar(100)
  role_id bigint
  dept_id bigint
  status tinyint [default: 1, note: '1-正常 0-禁用']
  create_time datetime
  update_time datetime
}

Table sys_role {
  id bigint [pk, increment]
  role_name varchar(50) [not null]
  role_code varchar(50) [unique, not null]
  role_desc varchar(200)
  create_time datetime
}

Table sys_menu {
  id bigint [pk, increment]
  menu_name varchar(50) [not null]
  parent_id bigint [default: 0]
  menu_type tinyint [note: '1-菜单 2-按钮']
  menu_path varchar(200)
  component varchar(200)
  icon varchar(100)
  sort_order int
  status tinyint [default: 1]
}

Table sys_role_menu {
  id bigint [pk, increment]
  role_id bigint [not null]
  menu_id bigint [not null]
}

Table sys_dept {
  id bigint [pk, increment]
  dept_name varchar(100) [not null]
  parent_id bigint [default: 0]
  dept_code varchar(50)
  sort_order int
  status tinyint [default: 1]
}

Table sys_dict_type {
  id bigint [pk, increment]
  dict_type varchar(50) [unique, not null]
  dict_name varchar(100) [not null]
  dict_desc varchar(200)
  status tinyint [default: 1]
}

Table sys_dict_data {
  id bigint [pk, increment]
  dict_type varchar(50) [not null]
  dict_label varchar(100) [not null]
  dict_value varchar(100) [not null]
  sort_order int
  status tinyint [default: 1]
}

Table sys_config {
  id bigint [pk, increment]
  config_key varchar(100) [unique, not null]
  config_value varchar(500) [not null]
  config_desc varchar(200)
}

Table sys_log {
  id bigint [pk, increment]
  username varchar(50)
  operation varchar(200)
  method varchar(200)
  params text
  ip varchar(50)
  create_time datetime
}

Table sys_login_log {
  id bigint [pk, increment]
  username varchar(50)
  ip varchar(50)
  login_time datetime
  status tinyint [note: '1-成功 0-失败']
}

// ========== 关系定义 ==========
Ref: sys_user.role_id > sys_role.id
Ref: sys_user.dept_id > sys_dept.id
Ref: sys_role_menu.role_id > sys_role.id
Ref: sys_role_menu.menu_id > sys_menu.id
📁 模块2：养殖基础信息模块（12张表）
plaintext

编辑

// ========================================
// 养殖基础信息模块 - 养殖户、基地、塘口、品种、记录
// ========================================

Table breeder_info {
  breeder_id bigint [pk, increment]
  breeder_code varchar(50) [unique, not null]
  breeder_name varchar(100) [not null]
  legal_person varchar(50)
  phone varchar(20)
  address varchar(200)
  business_license varchar(200)
  status tinyint [default: 1]
  create_time datetime
}

Table base_info {
  base_id bigint [pk, increment]
  base_code varchar(50) [unique, not null]
  base_name varchar(100) [not null]
  breeder_id bigint
  address varchar(200)
  area decimal(10,2) [note: '面积(亩)']
  water_source varchar(100)
  status tinyint [default: 1]
  create_time datetime
}

Table pond_info {
  pond_id bigint [pk, increment]
  pond_code varchar(50) [unique, not null]
  pond_name varchar(100) [not null]
  base_id bigint
  area decimal(10,2) [note: '面积(亩)']
  depth decimal(5,2) [note: '深度(米)']
  water_volume decimal(10,2) [note: '水体体积(立方米)']
  breeding_species varchar(100) [note: '养殖品种']
  stocking_date date [note: '放苗日期']
  expected_harvest_date date [note: '预计出塘日期']
  status tinyint [default: 1, note: '1-养殖中 2-空闲 0-停用']
  create_time datetime
}

Table species_info {
  species_id bigint [pk, increment]
  species_name varchar(100) [not null]
  species_code varchar(50) [unique]
  category varchar(50) [note: '类别：鱼/虾/蟹/贝类']
  growth_cycle int [note: '生长周期(天)']
  suitable_temp_min decimal(5,2) [note: '适宜温度下限']
  suitable_temp_max decimal(5,2) [note: '适宜温度上限']
  suitable_ph_min decimal(4,2) [note: '适宜pH下限']
  suitable_ph_max decimal(4,2) [note: '适宜pH上限']
}

Table stocking_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  species_id bigint [not null]
  seedling_batch varchar(100) [note: '苗种批次']
  stocking_quantity int [note: '放苗数量(尾)']
  stocking_weight decimal(10,2) [note: '放苗重量(kg)']
  stocking_date date [not null]
  seedling_source varchar(200) [note: '苗种来源']
  seedling_price decimal(10,2) [note: '苗种单价(元/尾)']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table breeding_diary {
  diary_id bigint [pk, increment]
  pond_id bigint [not null]
  diary_date date [not null]
  weather varchar(50) [note: '天气']
  water_color varchar(50) [note: '水色']
  feeding_amount decimal(10,2) [note: '投喂量(kg)']
  feeding_times int [note: '投喂次数']
  patrol_desc varchar(500) [note: '巡塘情况']
  abnormal_desc varchar(500) [note: '异常情况']
  operator_id bigint
  create_time datetime
}

Table water_quality_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  record_date date [not null]
  record_time time [not null]
  temperature decimal(5,2) [note: '水温(℃)']
  ph decimal(4,2) [note: 'pH值']
  do_value decimal(5,2) [note: '溶解氧(mg/L)']
  ammonia_nitrogen decimal(5,2) [note: '氨氮(mg/L)']
  nitrite decimal(5,2) [note: '亚硝酸盐(mg/L)']
  transparency decimal(5,2) [note: '透明度(cm)']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table drug_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  drug_name varchar(100) [not null]
  drug_type varchar(50) [note: '药物类型']
  usage_amount decimal(10,2) [note: '使用量']
  unit varchar(20) [note: '单位']
  usage_date date [not null]
  usage_method varchar(200) [note: '使用方法']
  withdrawal_period int [note: '休药期(天)']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table harvest_plan {
  plan_id bigint [pk, increment]
  pond_id bigint [not null]
  plan_harvest_date date [not null]
  plan_quantity decimal(10,2) [note: '计划产量(kg)']
  plan_weight decimal(10,2) [note: '计划重量(kg)']
  target_market varchar(200) [note: '目标市场']
  status tinyint [default: 1, note: '1-计划中 2-已执行 3-已取消']
  create_time datetime
}

Table harvest_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  harvest_date date [not null]
  actual_quantity decimal(10,2) [note: '实际产量(尾)']
  actual_weight decimal(10,2) [note: '实际重量(kg)']
  average_weight decimal(10,2) [note: '平均重量(g/尾)']
  survival_rate decimal(5,2) [note: '成活率(%)']
  harvest_method varchar(100) [note: '捕捞方式']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table breeding_cost {
  cost_id bigint [pk, increment]
  pond_id bigint [not null]
  cost_type varchar(50) [note: '成本类型：苗种/饲料/药物/人工/其他']
  cost_amount decimal(10,2) [not null]
  cost_date date [not null]
  cost_desc varchar(200)
  operator_id bigint
  create_time datetime
}

Table breeding_output {
  output_id bigint [pk, increment]
  pond_id bigint [not null]
  output_date date [not null]
  output_type varchar(50) [note: '产出类型：成鱼/虾/蟹']
  quantity decimal(10,2) [note: '数量']
  weight decimal(10,2) [note: '重量(kg)']
  unit_price decimal(10,2) [note: '单价(元/kg)']
  total_amount decimal(10,2) [note: '总金额']
  buyer_info varchar(200) [note: '购买方信息']
  operator_id bigint
  create_time datetime
}

// ========== 关系定义 ==========
Ref: base_info.breeder_id > breeder_info.breeder_id
Ref: pond_info.base_id > base_info.base_id
Ref: stocking_record.pond_id > pond_info.pond_id
Ref: stocking_record.species_id > species_info.species_id
Ref: breeding_diary.pond_id > pond_info.pond_id
Ref: water_quality_record.pond_id > pond_info.pond_id
Ref: drug_record.pond_id > pond_info.pond_id
Ref: harvest_plan.pond_id > pond_info.pond_id
Ref: harvest_record.pond_id > pond_info.pond_id
Ref: breeding_cost.pond_id > pond_info.pond_id
Ref: breeding_output.pond_id > pond_info.pond_id
📁 模块3：物联网设备模块（10张表）
plaintext

编辑

// ========================================
// 物联网设备模块 - 设备、数据、告警、维护
// ========================================

Table iot_device_type {
  type_id bigint [pk, increment]
  type_name varchar(100) [not null]
  type_code varchar(50) [unique, not null]
  category varchar(50) [note: '类别：水质/气象/视频/控制']
  protocol varchar(50) [note: '通信协议：MQTT/HTTP/Modbus']
  manufacturer varchar(100) [note: '生产厂家']
  model varchar(100) [note: '型号']
  status tinyint [default: 1]
}

Table iot_device {
  id bigint [pk, increment]
  device_code varchar(50) [unique, not null]
  device_name varchar(100) [not null]
  device_type_id bigint [not null]
  pond_id bigint
  base_id bigint
  install_location varchar(200) [note: '安装位置']
  longitude decimal(10,6) [note: '经度']
  latitude decimal(10,6) [note: '纬度']
  ip_address varchar(50) [note: 'IP地址']
  mac_address varchar(50) [note: 'MAC地址']
  sim_card varchar(50) [note: 'SIM卡号']
  status tinyint [default: 1, note: '1-在线 0-离线 2-故障']
  last_heartbeat datetime [note: '最后心跳时间']
  install_date date [note: '安装日期']
  maintainer varchar(100) [note: '维护人员']
  remark varchar(500)
  create_time datetime
}

Table iot_device_config {
  id bigint [pk, increment]
  device_id bigint [not null]
  config_key varchar(50) [not null]
  config_value varchar(200)
  config_desc varchar(200)
  update_time datetime
}

Table iot_ts_data {
  id bigint [pk, increment]
  device_id bigint [not null]
  metric varchar(50) [not null, note: '指标：temperature/pH/oxygen/ammonia...']
  value decimal(10,4) [not null]
  unit varchar(20)
  ts datetime [not null, note: '时间戳']
  quality tinyint [default: 1, note: '数据质量：1-正常 0-异常']
  create_time datetime
}

Table iot_alert_rule {
  id bigint [pk, increment]
  rule_name varchar(100) [not null]
  device_type_id bigint
  pond_id bigint
  metric varchar(50) [not null]
  condition_type tinyint [not null, note: '1-> 2->= 3-< 4-<= 5-=']
  threshold_value decimal(10,4) [not null]
  duration int [note: '持续时间(秒)']
  severity tinyint [not null, note: '1-警告 2-严重 3-紧急']
  notify_type varchar(100) [note: '通知方式：短信/邮件/微信']
  notify_users varchar(500) [note: '通知人员']
  enabled tinyint [default: 1]
  create_time datetime
}

Table iot_alert {
  id bigint [pk, increment]
  device_id bigint [not null]
  rule_id bigint
  metric varchar(50) [not null]
  current_value decimal(10,4) [not null]
  threshold_value decimal(10,4) [not null]
  severity tinyint [not null]
  alert_time datetime [not null]
  status tinyint [default: 1, note: '1-未处理 2-已处理 3-已忽略']
  handler_id bigint
  handle_time datetime
  handle_desc varchar(500)
  create_time datetime
}

Table iot_alert_log {
  id bigint [pk, increment]
  alert_id bigint [not null]
  operator_id bigint
  operation varchar(100) [note: '操作：确认/处理/忽略']
  operation_time datetime
  remark varchar(500)
}

Table iot_device_maintenance {
  id bigint [pk, increment]
  device_id bigint [not null]
  maintenance_type varchar(50) [note: '维护类型：校准/维修/更换']
  maintenance_date date [not null]
  maintainer varchar(100)
  maintenance_desc varchar(500)
  cost_amount decimal(10,2)
  next_maintenance_date date [note: '下次维护日期']
  status tinyint [default: 1, note: '1-计划中 2-进行中 3-已完成']
  create_time datetime
}

Table iot_device_fault {
  id bigint [pk, increment]
  device_id bigint [not null]
  fault_code varchar(50) [note: '故障代码']
  fault_desc varchar(500) [not null]
  occur_time datetime [not null]
  status tinyint [default: 1, note: '1-未处理 2-处理中 3-已解决']
  handler_id bigint
  handle_time datetime
  handle_desc varchar(500)
  create_time datetime
}

Table iot_command_log {
  id bigint [pk, increment]
  device_id bigint [not null]
  command_type varchar(50) [note: '命令类型：重启/校准/参数设置']
  command_params varchar(500) [note: '命令参数']
  send_time datetime [not null]
  response_time datetime
  response_status tinyint [note: '1-成功 0-失败']
  response_msg varchar(500)
  operator_id bigint
}

// ========== 关系定义 ==========
Ref: iot_device.device_type_id > iot_device_type.type_id
Ref: iot_device.pond_id > pond_info.pond_id
Ref: iot_device.base_id > base_info.base_id
Ref: iot_device_config.device_id > iot_device.id
Ref: iot_ts_data.device_id > iot_device.id
Ref: iot_alert_rule.device_type_id > iot_device_type.type_id
Ref: iot_alert_rule.pond_id > pond_info.pond_id
Ref: iot_alert.device_id > iot_device.id
Ref: iot_alert.rule_id > iot_alert_rule.id
Ref: iot_alert_log.alert_id > iot_alert.id
Ref: iot_device_maintenance.device_id > iot_device.id
Ref: iot_device_fault.device_id > iot_device.id
Ref: iot_command_log.device_id > iot_device.id
📁 模块4：饲料管理模块（6张表）
plaintext

编辑

// ========================================
// 饲料管理模块 - 供应商、饲料、库存、采购、投喂
// ========================================

Table feed_supplier {
  supplier_id bigint [pk, increment]
  supplier_name varchar(100) [not null]
  contact_person varchar(50)
  phone varchar(20)
  address varchar(200)
  status tinyint [default: 1]
  create_time datetime
}

Table feed_info {
  feed_id bigint [pk, increment]
  feed_code varchar(50) [unique, not null]
  feed_name varchar(100) [not null]
  feed_type varchar(50) [note: '饲料类型']
  supplier_id bigint
  specification varchar(100) [note: '规格']
  unit_price decimal(10,2) [note: '单价(元/kg)']
  shelf_life int [note: '保质期(天)']
  status tinyint [default: 1]
  create_time datetime
}

Table feed_stock {
  stock_id bigint [pk, increment]
  feed_id bigint [not null]
  warehouse_id bigint [note: '仓库ID']
  stock_quantity decimal(10,2) [note: '库存数量(kg)']
  stock_date date [not null]
  operator_id bigint
  create_time datetime
}

Table feed_purchase {
  purchase_id bigint [pk, increment]
  feed_id bigint [not null]
  supplier_id bigint [not null]
  purchase_quantity decimal(10,2) [not null]
  purchase_price decimal(10,2) [not null]
  purchase_date date [not null]
  purchaser varchar(50)
  status tinyint [default: 1, note: '1-待入库 2-已入库 3-已取消']
  remark varchar(500)
  create_time datetime
}

Table feed_outbound {
  outbound_id bigint [pk, increment]
  feed_id bigint [not null]
  pond_id bigint [not null]
  outbound_quantity decimal(10,2) [not null]
  outbound_date date [not null]
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table feed_feeding_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  feed_id bigint [not null]
  feeding_date date [not null]
  feeding_time time [not null]
  feeding_quantity decimal(10,2) [not null, note: '投喂量(kg)']
  feeding_method varchar(100) [note: '投喂方式']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

// ========== 关系定义 ==========
Ref: feed_info.supplier_id > feed_supplier.supplier_id
Ref: feed_stock.feed_id > feed_info.feed_id
Ref: feed_purchase.feed_id > feed_info.feed_id
Ref: feed_purchase.supplier_id > feed_supplier.supplier_id
Ref: feed_outbound.feed_id > feed_info.feed_id
Ref: feed_outbound.pond_id > pond_info.pond_id
Ref: feed_feeding_record.pond_id > pond_info.pond_id
Ref: feed_feeding_record.feed_id > feed_info.feed_id
📁 模块5：病害管理模块（6张表）
plaintext

编辑

// ========================================
// 病害管理模块 - 疾病类型、记录、预防、预警、统计
// ========================================

Table disease_type {
  type_id bigint [pk, increment]
  disease_name varchar(100) [not null]
  disease_type varchar(50) [note: '疾病类型']
  symptoms varchar(500) [note: '症状描述']
  causes varchar(500) [note: '病因']
  prevention varchar(500) [note: '预防措施']
  treatment varchar(500) [note: '治疗方法']
  create_time datetime
}

Table disease_record {
  record_id bigint [pk, increment]
  pond_id bigint [not null]
  disease_type_id bigint [not null]
  occur_date date [not null]
  affected_quantity int [note: '发病数量(尾)']
  death_quantity int [note: '死亡数量(尾)']
  symptoms_desc varchar(500) [note: '症状描述']
  diagnosis varchar(500) [note: '诊断结果']
  treatment_desc varchar(500) [note: '治疗措施']
  operator_id bigint
  create_time datetime
}

Table disease_prevention {
  prevention_id bigint [pk, increment]
  pond_id bigint [not null]
  prevention_type varchar(50) [note: '预防类型']
  prevention_date date [not null]
  prevention_desc varchar(500) [note: '预防措施']
  operator_id bigint
  create_time datetime
}

Table disease_warning {
  warning_id bigint [pk, increment]
  pond_id bigint [not null]
  disease_type_id bigint [not null]
  warning_level tinyint [note: '1-低 2-中 3-高']
  warning_date date [not null]
  warning_desc varchar(500) [note: '预警描述']
  suggested_action varchar(500) [note: '建议措施']
  status tinyint [default: 1, note: '1-未处理 2-已处理']
  create_time datetime
}

Table disease_statistic {
  statistic_id bigint [pk, increment]
  pond_id bigint
  disease_type_id bigint
  statistic_date date [not null]
  total_quantity int [note: '总数量']
  affected_quantity int [note: '发病数量']
  death_quantity int [note: '死亡数量']
  recovery_quantity int [note: '康复数量']
  create_time datetime
}

Table disease_knowledge {
  knowledge_id bigint [pk, increment]
  disease_name varchar(100) [not null]
  disease_images varchar(500) [note: '疾病图片']
  symptoms varchar(1000) [note: '症状']
  causes varchar(1000) [note: '病因']
  prevention varchar(1000) [note: '预防']
  treatment varchar(1000) [note: '治疗']
  reference varchar(500) [note: '参考资料']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: disease_record.pond_id > pond_info.pond_id
Ref: disease_record.disease_type_id > disease_type.type_id
Ref: disease_prevention.pond_id > pond_info.pond_id
Ref: disease_warning.pond_id > pond_info.pond_id
Ref: disease_warning.disease_type_id > disease_type.type_id
Ref: disease_statistic.pond_id > pond_info.pond_id
Ref: disease_statistic.disease_type_id > disease_type.type_id
📁 模块6：出塘申报与合格证模块（8张表）
plaintext

编辑

// ========================================
// 出塘申报与合格证模块 - 申报、检测、合格证、追溯、销售
// ========================================

Table harvest_application {
  application_id bigint [pk, increment]
  pond_id bigint [not null]
  applicant_id bigint [not null]
  application_date datetime [not null]
  harvest_date date [not null]
  harvest_quantity decimal(10,2) [note: '出塘数量(kg)']
  harvest_weight decimal(10,2) [note: '出塘重量(kg)']
  destination varchar(200) [note: '去向']
  transport_vehicle varchar(100) [note: '运输车辆']
  driver_info varchar(100) [note: '司机信息']
  status tinyint [default: 1, note: '1-待审核 2-审核通过 3-审核驳回 4-已完成']
  auditor_id bigint
  audit_time datetime
  audit_opinion varchar(500)
  create_time datetime
}

Table quality_inspection {
  inspection_id bigint [pk, increment]
  application_id bigint [not null]
  inspection_date date [not null]
  inspector varchar(50)
  temperature decimal(5,2) [note: '水温']
  ph decimal(4,2) [note: 'pH值']
  do_value decimal(5,2) [note: '溶解氧']
  drug_residue varchar(100) [note: '药物残留检测']
  heavy_metal varchar(100) [note: '重金属检测']
  microbiological varchar(100) [note: '微生物检测']
  inspection_result varchar(500) [note: '检测结果']
  qualified tinyint [note: '1-合格 0-不合格']
  remark varchar(500)
  create_time datetime
}

Table certificate_info {
  certificate_id bigint [pk, increment]
  certificate_no varchar(100) [unique, not null]
  application_id bigint [not null]
  pond_id bigint [not null]
  product_name varchar(100) [not null]
  species varchar(100) [note: '品种']
  producer varchar(100) [note: '生产者']
  production_date date [not null]
  quantity decimal(10,2) [note: '数量']
  unit varchar(20) [note: '单位']
  trace_code varchar(100) [note: '追溯码']
  qr_code varchar(200) [note: '二维码路径']
  status tinyint [default: 1, note: '1-已生成 2-已发放 3-已使用']
  create_time datetime
}

Table certificate_detail {
  detail_id bigint [pk, increment]
  certificate_id bigint [not null]
  item_name varchar(100) [note: '项目名称']
  item_value varchar(200) [note: '项目值']
  sort_order int
}

Table certificate_scan_log {
  log_id bigint [pk, increment]
  certificate_id bigint [not null]
  scan_time datetime [not null]
  scan_ip varchar(50)
  scan_location varchar(200)
  scan_device varchar(100)
}

Table trace_info {
  trace_id bigint [pk, increment]
  trace_code varchar(100) [unique, not null]
  pond_id bigint [not null]
  breeding_records text [note: '养殖记录']
  feeding_records text [note: '投喂记录']
  drug_records text [note: '用药记录']
  water_quality_records text [note: '水质记录']
  harvest_info text [note: '收获信息']
  create_time datetime
}

Table market_info {
  market_id bigint [pk, increment]
  market_name varchar(100) [not null]
  market_code varchar(50) [unique]
  contact_person varchar(50)
  phone varchar(20)
  address varchar(200)
  status tinyint [default: 1]
}

Table sales_record {
  sales_id bigint [pk, increment]
  certificate_id bigint [not null]
  market_id bigint
  sales_date date [not null]
  sales_quantity decimal(10,2) [note: '销售数量']
  sales_price decimal(10,2) [note: '销售单价']
  total_amount decimal(10,2) [note: '总金额']
  buyer_info varchar(200)
  remark varchar(500)
  create_time datetime
}

// ========== 关系定义 ==========
Ref: harvest_application.pond_id > pond_info.pond_id
Ref: harvest_application.applicant_id > sys_user.id
Ref: harvest_application.auditor_id > sys_user.id
Ref: quality_inspection.application_id > harvest_application.application_id
Ref: certificate_info.application_id > harvest_application.application_id
Ref: certificate_info.pond_id > pond_info.pond_id
Ref: certificate_detail.certificate_id > certificate_info.certificate_id
Ref: certificate_scan_log.certificate_id > certificate_info.certificate_id
Ref: trace_info.pond_id > pond_info.pond_id
Ref: trace_info.trace_code > certificate_info.trace_code
Ref: sales_record.certificate_id > certificate_info.certificate_id
Ref: sales_record.market_id > market_info.market_id
📁 模块7：文件管理模块（4张表）
plaintext

编辑

// ========================================
// 文件管理模块 - 文件、关联、分类、标签
// ========================================

Table sys_file {
  file_id varchar(50) [pk]
  file_name varchar(200) [not null]
  file_path varchar(500) [not null]
  file_url varchar(500)
  file_size bigint [note: '文件大小(字节)']
  file_type varchar(50) [note: '文件类型']
  file_suffix varchar(20) [note: '文件后缀']
  uploader_id bigint
  upload_time datetime
  status tinyint [default: 1]
}

Table sys_file_ref {
  ref_id varchar(50) [pk]
  file_id varchar(50) [not null]
  biz_type varchar(50) [not null, note: '业务类型']
  biz_id bigint [not null]
  ref_desc varchar(200) [note: '关联描述']
  create_time datetime
}

Table file_category {
  category_id bigint [pk, increment]
  category_name varchar(100) [not null]
  parent_id bigint [default: 0]
  sort_order int
  status tinyint [default: 1]
}

Table file_tag {
  tag_id bigint [pk, increment]
  tag_name varchar(50) [not null, unique]
  create_time datetime
}

// ========== 关系定义 ==========
Ref: sys_file.uploader_id > sys_user.id
Ref: sys_file_ref.file_id > sys_file.file_id
📁 模块8：统计分析模块（4张表）
plaintext

编辑

// ========================================
// 统计分析模块 - 日/月/年统计、报表模板
// ========================================

Table statistics_daily {
  stat_id bigint [pk, increment]
  stat_date date [not null]
  pond_id bigint
  avg_temperature decimal(5,2)
  avg_ph decimal(4,2)
  avg_do decimal(5,2)
  feeding_total decimal(10,2) [note: '总投喂量']
  harvest_total decimal(10,2) [note: '总收获量']
  create_time datetime
}

Table statistics_monthly {
  stat_id bigint [pk, increment]
  stat_year int [not null]
  stat_month int [not null]
  pond_id bigint
  avg_temperature decimal(5,2)
  avg_ph decimal(4,2)
  feeding_total decimal(10,2)
  harvest_total decimal(10,2)
  cost_total decimal(10,2) [note: '总成本']
  output_total decimal(10,2) [note: '总产出']
  create_time datetime
}

Table statistics_yearly {
  stat_id bigint [pk, increment]
  stat_year int [not null]
  pond_id bigint
  feeding_total decimal(10,2)
  harvest_total decimal(10,2)
  cost_total decimal(10,2)
  output_total decimal(10,2)
  profit_total decimal(10,2) [note: '总利润']
  create_time datetime
}

Table report_template {
  template_id bigint [pk, increment]
  template_name varchar(100) [not null]
  template_type varchar(50) [note: '报表类型']
  template_content text [note: '模板内容']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: statistics_daily.pond_id > pond_info.pond_id
Ref: statistics_monthly.pond_id > pond_info.pond_id
Ref: statistics_yearly.pond_id > pond_info.pond_id
📁 模块9：消息通知模块（3张表）
plaintext

编辑

// ========================================
// 消息通知模块 - 消息、通知配置、短信模板
// ========================================

Table message_info {
  message_id bigint [pk, increment]
  message_title varchar(200) [not null]
  message_content text [not null]
  message_type varchar(50) [note: '消息类型：系统/告警/通知']
  send_user_id bigint
  receive_user_id bigint
  send_time datetime
  read_status tinyint [default: 0, note: '0-未读 1-已读']
  read_time datetime
}

Table notification_config {
  config_id bigint [pk, increment]
  user_id bigint [not null]
  notify_type varchar(50) [not null, note: '通知类型']
  notify_channel varchar(100) [note: '通知渠道：站内信/短信/邮件/微信']
  enabled tinyint [default: 1]
  create_time datetime
}

Table sms_template {
  template_id bigint [pk, increment]
  template_name varchar(100) [not null]
  template_code varchar(50) [unique, not null]
  template_content varchar(500) [not null]
  template_params varchar(200) [note: '模板参数']
  status tinyint [default: 1]
  create_time datetime
}

// ========== 关系定义 ==========
Ref: message_info.send_user_id > sys_user.id
Ref: message_info.receive_user_id > sys_user.id
Ref: notification_config.user_id > sys_user.id
📁 模块10：系统监控模块（3张表）
plaintext

编辑

// ========================================
// 系统监控模块 - 系统监控、操作监控、性能监控
// ========================================

Table system_monitor {
  monitor_id bigint [pk, increment]
  monitor_type varchar(50) [not null, note: '监控类型：CPU/内存/磁盘']
  monitor_value decimal(10,2) [not null]
  monitor_time datetime [not null]
  create_time datetime
}

Table operation_monitor {
  monitor_id bigint [pk, increment]
  operation_type varchar(100) [not null]
  operation_count int [not null]
  success_count int [not null]
  fail_count int [not null]
  stat_date date [not null]
  create_time datetime
}

Table performance_monitor {
  monitor_id bigint [pk, increment]
  interface_name varchar(200) [not null]
  avg_response_time decimal(10,2) [note: '平均响应时间(ms)']
  max_response_time decimal(10,2)
  min_response_time decimal(10,2)
  request_count int
  stat_date date [not null]
  create_time datetime
}



## 📁 模块1：系统基础模块

**plaintext****编辑**

```
// ========================================
// 系统基础模块 - 权限、日志、字典
// ========================================

Table sys_user {
  id bigint [pk, increment]
  username varchar(50) [unique, not null]
  password varchar(100) [not null]
  real_name varchar(50)
  phone varchar(20)
  email varchar(100)
  dept_id bigint
  status tinyint [default: 1, note: '1-正常 0-禁用']
  create_time datetime
  update_time datetime
}

Table sys_role {
  id bigint [pk, increment]
  role_name varchar(50) [not null]
  role_code varchar(50) [unique, not null]
  role_desc varchar(200)
  create_time datetime
}

Table sys_permission {
  id bigint [pk, increment]
  permission_name varchar(50) [not null]
  permission_code varchar(100) [unique, not null]
  permission_type tinyint [note: '1-菜单 2-按钮 3-接口']
  parent_id bigint [default: 0]
  url varchar(200)
  method varchar(20)
  sort_order int
  status tinyint [default: 1]
  create_time datetime
}

Table sys_user_role {
  id bigint [pk, increment]
  user_id bigint [not null]
  role_id bigint [not null]
}

Table sys_role_permission {
  id bigint [pk, increment]
  role_id bigint [not null]
  permission_id bigint [not null]
}

Table sys_login_log {
  id bigint [pk, increment]
  user_id bigint
  username varchar(50)
  ip varchar(50)
  login_time datetime
  status tinyint [note: '1-成功 0-失败']
  msg varchar(200)
}

Table sys_op_log {
  id bigint [pk, increment]
  user_id bigint
  username varchar(50)
  operation varchar(200)
  method varchar(200)
  params text
  ip varchar(50)
  create_time datetime
}

Table sys_error_log {
  id bigint [pk, increment]
  user_id bigint
  username varchar(50)
  error_msg text
  stack_trace text
  ip varchar(50)
  create_time datetime
}

Table sys_dict {
  id bigint [pk, increment]
  dict_code varchar(50) [unique, not null]
  dict_name varchar(100) [not null]
  dict_desc varchar(200)
  status tinyint [default: 1]
  create_time datetime
}

Table sys_dict_item {
  id bigint [pk, increment]
  dict_id bigint [not null]
  item_code varchar(50) [not null]
  item_name varchar(100) [not null]
  item_value varchar(100) [not null]
  sort_order int
  status tinyint [default: 1]
}

// ========== 关系定义 ==========
Ref: sys_user_role.user_id > sys_user.id
Ref: sys_user_role.role_id > sys_role.id
Ref: sys_role_permission.role_id > sys_role.id
Ref: sys_role_permission.permission_id > sys_permission.id
Ref: sys_login_log.user_id > sys_user.id
Ref: sys_op_log.user_id > sys_user.id
Ref: sys_error_log.user_id > sys_user.id
Ref: sys_dict_item.dict_id > sys_dict.id
```

---

## 📁 模块2：养殖基础信息模块

**plaintext****编辑**

```
// ========================================
// 养殖基础信息模块 - 主体、基地、塘口
// ========================================

Table biz_breeder {
  id bigint [pk, increment]
  breeder_code varchar(50) [unique, not null]
  breeder_name varchar(100) [not null]
  legal_person varchar(50)
  phone varchar(20)
  address varchar(200)
  business_license varchar(200)
  license_no varchar(100)
  register_date date
  status tinyint [default: 1]
  create_time datetime
  update_time datetime
}

Table base_info {
  id bigint [pk, increment]
  base_code varchar(50) [unique, not null]
  base_name varchar(100) [not null]
  breeder_id bigint
  address varchar(200)
  area decimal(10,2) [note: '面积(亩)']
  water_source varchar(100)
  longitude decimal(10,6)
  latitude decimal(10,6)
  status tinyint [default: 1]
  create_time datetime
}

Table base_ext {
  id bigint [pk, increment]
  base_id bigint [not null]
  water_quality varchar(200)
  soil_type varchar(100)
  power_supply varchar(100)
  road_condition varchar(200)
  remark varchar(500)
}

Table pond_info {
  id bigint [pk, increment]
  pond_code varchar(50) [unique, not null]
  pond_name varchar(100) [not null]
  base_id bigint
  area decimal(10,2) [note: '面积(亩)']
  depth decimal(5,2) [note: '深度(米)']
  water_volume decimal(10,2) [note: '水体体积(立方米)']
  breeding_species varchar(100) [note: '养殖品种']
  stocking_date date [note: '放苗日期']
  expected_harvest_date date [note: '预计出塘日期']
  status tinyint [default: 1, note: '1-养殖中 2-空闲 0-停用']
  create_time datetime
}

Table pond_ext {
  id bigint [pk, increment]
  pond_id bigint [not null]
  bottom_type varchar(50) [note: '底质类型']
  inlet_count int [note: '进水口数量']
  outlet_count int [note: '出水口数量']
  aeration_count int [note: '增氧机数量']
  remark varchar(500)
}

Table base_pond_rel {
  id bigint [pk, increment]
  base_id bigint [not null]
  pond_id bigint [not null]
}

// ========== 关系定义 ==========
Ref: base_info.breeder_id > biz_breeder.id
Ref: base_ext.base_id > base_info.id
Ref: pond_info.base_id > base_info.id
Ref: pond_ext.pond_id > pond_info.id
Ref: base_pond_rel.base_id > base_info.id
Ref: base_pond_rel.pond_id > pond_info.id
```

---

## 📁 模块3：物联网设备模块

**plaintext****编辑**

```
// ========================================
// 物联网设备模块 - 设备、数据、告警
// ========================================

Table iot_device_type {
  id bigint [pk, increment]
  type_name varchar(100) [not null]
  type_code varchar(50) [unique, not null]
  category varchar(50) [note: '类别：水质/气象/视频/控制']
  protocol varchar(50) [note: '通信协议：MQTT/HTTP/Modbus']
  manufacturer varchar(100) [note: '生产厂家']
  model varchar(100) [note: '型号']
  status tinyint [default: 1]
}

Table iot_device {
  id bigint [pk, increment]
  device_code varchar(50) [unique, not null]
  device_name varchar(100) [not null]
  type_id bigint [not null]
  pond_id bigint
  base_id bigint
  install_location varchar(200) [note: '安装位置']
  longitude decimal(10,6)
  latitude decimal(10,6)
  ip_address varchar(50) [note: 'IP地址']
  mac_address varchar(50) [note: 'MAC地址']
  sim_card varchar(50) [note: 'SIM卡号']
  status tinyint [default: 1, note: '1-在线 0-离线 2-故障']
  last_heartbeat datetime [note: '最后心跳时间']
  install_date date [note: '安装日期']
  maintainer varchar(100) [note: '维护人员']
  remark varchar(500)
  create_time datetime
}

Table iot_device_config {
  id bigint [pk, increment]
  device_id bigint [not null]
  config_key varchar(50) [not null]
  config_value varchar(200)
  config_desc varchar(200)
  update_time datetime
}

Table iot_ts_data {
  id bigint [pk, increment]
  device_id bigint [not null]
  metric varchar(50) [not null, note: '指标：temperature/pH/oxygen/ammonia...']
  value decimal(10,4) [not null]
  unit varchar(20)
  ts datetime [not null, note: '时间戳']
  quality tinyint [default: 1, note: '数据质量：1-正常 0-异常']
  create_time datetime
}

Table iot_alert_rule {
  id bigint [pk, increment]
  rule_name varchar(100) [not null]
  device_type_id bigint
  pond_id bigint
  metric varchar(50) [not null]
  condition_type tinyint [not null, note: '1-> 2->= 3-< 4-<= 5-=']
  threshold_value decimal(10,4) [not null]
  duration int [note: '持续时间(秒)']
  severity tinyint [not null, note: '1-警告 2-严重 3-紧急']
  notify_type varchar(100) [note: '通知方式：短信/邮件/微信']
  notify_users varchar(500) [note: '通知人员']
  enabled tinyint [default: 1]
  create_time datetime
}

Table iot_alert {
  id bigint [pk, increment]
  device_id bigint [not null]
  rule_id bigint
  metric varchar(50) [not null]
  current_value decimal(10,4) [not null]
  threshold_value decimal(10,4) [not null]
  severity tinyint [not null]
  alert_time datetime [not null]
  status tinyint [default: 1, note: '1-未处理 2-已处理 3-已忽略']
  handler_id bigint
  handle_time datetime
  handle_desc varchar(500)
  create_time datetime
}

Table iot_device_maintenance {
  id bigint [pk, increment]
  device_id bigint [not null]
  maintenance_type varchar(50) [note: '维护类型：校准/维修/更换']
  maintenance_date date [not null]
  maintainer varchar(100)
  maintenance_desc varchar(500)
  cost_amount decimal(10,2)
  next_maintenance_date date [note: '下次维护日期']
  status tinyint [default: 1, note: '1-计划中 2-进行中 3-已完成']
  create_time datetime
}

Table env_wq {
  id bigint [pk, increment]
  pond_id bigint [not null]
  record_date date [not null]
  record_time time [not null]
  temperature decimal(5,2) [note: '水温(℃)']
  ph decimal(4,2) [note: 'pH值']
  do_value decimal(5,2) [note: '溶解氧(mg/L)']
  ammonia_nitrogen decimal(5,2) [note: '氨氮(mg/L)']
  nitrite decimal(5,2) [note: '亚硝酸盐(mg/L)']
  transparency decimal(5,2) [note: '透明度(cm)']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table env_weather {
  id bigint [pk, increment]
  base_id bigint [not null]
  record_date date [not null]
  record_time time [not null]
  temperature decimal(5,2) [note: '气温(℃)']
  humidity decimal(5,2) [note: '湿度(%)']
  wind_direction varchar(20) [note: '风向']
  wind_speed decimal(5,2) [note: '风速(m/s)']
  pressure decimal(8,2) [note: '气压(hPa)']
  weather varchar(50) [note: '天气']
  create_time datetime
}

Table env_tide {
  id bigint [pk, increment]
  base_id bigint [not null]
  tide_date date [not null]
  tide_time time [not null]
  tide_height decimal(5,2) [note: '潮高(米)']
  tide_type tinyint [note: '1-涨潮 2-退潮']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: iot_device.type_id > iot_device_type.id
Ref: iot_device.pond_id > pond_info.id
Ref: iot_device.base_id > base_info.id
Ref: iot_device_config.device_id > iot_device.id
Ref: iot_ts_data.device_id > iot_device.id
Ref: iot_alert_rule.device_type_id > iot_device_type.id
Ref: iot_alert_rule.pond_id > pond_info.id
Ref: iot_alert.device_id > iot_device.id
Ref: iot_alert.rule_id > iot_alert_rule.id
Ref: iot_device_maintenance.device_id > iot_device.id
Ref: env_wq.pond_id > pond_info.id
Ref: env_weather.base_id > base_info.id
Ref: env_tide.base_id > base_info.id
```

---

## 📁 模块4：饲料管理模块

**plaintext****编辑**

```
// ========================================
// 饲料管理模块 - 物资、库存、使用
// ========================================

Table mat_category {
  id bigint [pk, increment]
  category_name varchar(100) [not null]
  category_code varchar(50) [unique]
  parent_id bigint [default: 0]
  sort_order int
  status tinyint [default: 1]
}

Table mat_info {
  id bigint [pk, increment]
  mat_code varchar(50) [unique, not null]
  mat_name varchar(100) [not null]
  category_id bigint [not null]
  supplier_id bigint
  specification varchar(100) [note: '规格']
  unit varchar(20) [note: '单位']
  unit_price decimal(10,2) [note: '单价']
  shelf_life int [note: '保质期(天)']
  status tinyint [default: 1]
  create_time datetime
}

Table mat_supplier {
  id bigint [pk, increment]
  supplier_name varchar(100) [not null]
  contact_person varchar(50)
  phone varchar(20)
  address varchar(200)
  status tinyint [default: 1]
  create_time datetime
}

Table stk_record {
  id bigint [pk, increment]
  mat_id bigint [not null]
  supplier_id bigint
  record_type tinyint [not null, note: '1-入库 2-出库']
  quantity decimal(10,2) [not null]
  price decimal(10,2) [not null]
  record_date date [not null]
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table stk_usage {
  id bigint [pk, increment]
  mat_id bigint [not null]
  pond_id bigint [not null]
  usage_quantity decimal(10,2) [not null]
  usage_date date [not null]
  usage_method varchar(200) [note: '使用方法']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

// ========== 关系定义 ==========
Ref: mat_info.category_id > mat_category.id
Ref: mat_info.supplier_id > mat_supplier.id
Ref: stk_record.mat_id > mat_info.id
Ref: stk_record.supplier_id > mat_supplier.id
Ref: stk_usage.mat_id > mat_info.id
Ref: stk_usage.pond_id > pond_info.id
```

---

## 📁 模块5：病害管理模块

**plaintext****编辑**

```
// ========================================
// 病害管理模块 - 用药、预警
// ========================================

Table med_record {
  id bigint [pk, increment]
  pond_id bigint [not null]
  drug_name varchar(100) [not null]
  drug_type varchar(50) [note: '药物类型']
  usage_amount decimal(10,2) [note: '使用量']
  unit varchar(20) [note: '单位']
  usage_date date [not null]
  usage_method varchar(200) [note: '使用方法']
  withdrawal_period int [note: '休药期(天)']
  operator_id bigint
  remark varchar(500)
  create_time datetime
}

Table warn_rule {
  id bigint [pk, increment]
  rule_name varchar(100) [not null]
  rule_type varchar(50) [note: '预警类型：水质/气象/病害']
  rule_desc varchar(500)
  severity tinyint [note: '1-低 2-中 3-高']
  enabled tinyint [default: 1]
  create_time datetime
}

Table warn_rule_param {
  id bigint [pk, increment]
  rule_id bigint [not null]
  param_name varchar(50) [not null]
  param_value varchar(200) [not null]
  param_desc varchar(200)
  sort_order int
}

Table warn_record {
  id bigint [pk, increment]
  rule_id bigint [not null]
  pond_id bigint
  warn_time datetime [not null]
  warn_content varchar(500) [not null]
  severity tinyint [not null]
  status tinyint [default: 1, note: '1-未处理 2-已处理 3-已忽略']
  handler_id bigint
  handle_time datetime
  handle_desc varchar(500)
  create_time datetime
}

// ========== 关系定义 ==========
Ref: med_record.pond_id > pond_info.id
Ref: warn_rule_param.rule_id > warn_rule.id
Ref: warn_record.rule_id > warn_rule.id
Ref: warn_record.pond_id > pond_info.id
```

---

## 📁 模块6：出塘申报与合格证模块

**plaintext****编辑**

```
// ========================================
// 出塘申报与合格证模块 - 申报、检测、合格证
// ========================================

Table harv_reg {
  id bigint [pk, increment]
  pond_id bigint [not null]
  applicant_id bigint [not null]
  application_date datetime [not null]
  harvest_date date [not null]
  harvest_quantity decimal(10,2) [note: '出塘数量']
  harvest_weight decimal(10,2) [note: '出塘重量(kg)']
  destination varchar(200) [note: '去向']
  status tinyint [default: 1, note: '1-待审核 2-审核通过 3-审核驳回 4-已完成']
  auditor_id bigint
  audit_time datetime
  audit_opinion varchar(500)
  create_time datetime
}

Table cert_test_report {
  id bigint [pk, increment]
  cert_id bigint [not null]
  test_date date [not null]
  inspector varchar(50)
  drug_residue varchar(100) [note: '药物残留检测']
  heavy_metal varchar(100) [note: '重金属检测']
  microbiological varchar(100) [note: '微生物检测']
  test_result varchar(500) [note: '检测结果']
  qualified tinyint [note: '1-合格 0-不合格']
  remark varchar(500)
  create_time datetime
}

Table cert_info {
  id bigint [pk, increment]
  cert_no varchar(100) [unique, not null]
  pond_id bigint [not null]
  product_name varchar(100) [not null]
  species varchar(100) [note: '品种']
  producer varchar(100) [note: '生产者']
  production_date date [not null]
  quantity decimal(10,2) [note: '数量']
  unit varchar(20) [note: '单位']
  trace_code varchar(100) [note: '追溯码']
  qr_code varchar(200) [note: '二维码路径']
  status tinyint [default: 1, note: '1-已生成 2-已发放 3-已使用']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: harv_reg.pond_id > pond_info.id
Ref: harv_reg.applicant_id > sys_user.id
Ref: harv_reg.auditor_id > sys_user.id
Ref: cert_test_report.cert_id > cert_info.id
Ref: cert_info.pond_id > pond_info.id
```

---

## 📁 模块7：文件管理模块

**plaintext****编辑**

```
// ========================================
// 文件管理模块 - 文件、关联
// ========================================

Table sys_file {
  file_id varchar(50) [pk]
  file_name varchar(200) [not null]
  file_path varchar(500) [not null]
  file_url varchar(500)
  file_size bigint [note: '文件大小(字节)']
  file_type varchar(50) [note: '文件类型']
  file_suffix varchar(20) [note: '文件后缀']
  uploader_id bigint
  upload_time datetime
  status tinyint [default: 1]
}

Table sys_file_ref {
  ref_id varchar(50) [pk]
  file_id varchar(50) [not null]
  biz_type varchar(50) [not null, note: '业务类型']
  biz_id bigint [not null]
  ref_desc varchar(200) [note: '关联描述']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: sys_file.uploader_id > sys_user.id
Ref: sys_file_ref.file_id > sys_file.file_id
```

---

## 📁 模块8：统计分析模块

**plaintext****编辑**

```
// ========================================
// 统计分析模块 - 历史数据、行情
// ========================================

Table env_wq_hist {
  id bigint [pk, increment]
  pond_id bigint [not null]
  stat_date date [not null]
  avg_temperature decimal(5,2)
  avg_ph decimal(4,2)
  avg_do decimal(5,2)
  max_ammonia_nitrogen decimal(5,2)
  max_nitrite decimal(5,2)
  create_time datetime
}

Table env_weather_hist {
  id bigint [pk, increment]
  base_id bigint [not null]
  stat_date date [not null]
  avg_temperature decimal(5,2)
  avg_humidity decimal(5,2)
  max_wind_speed decimal(5,2)
  weather_days int [note: '晴天数']
  create_time datetime
}

Table mkt_quote {
  id bigint [pk, increment]
  product_name varchar(100) [not null]
  product_type varchar(50) [note: '产品类型']
  market_price decimal(10,2) [note: '市场价格(元/kg)']
  market_name varchar(100) [note: '市场名称']
  quote_date date [not null]
  quote_source varchar(200) [note: '报价来源']
  create_time datetime
}

// ========== 关系定义 ==========
Ref: env_wq_hist.pond_id > pond_info.id
Ref: env_weather_hist.base_id > base_info.id
```

---

## 📁 模块9：消息通知模块

**plaintext****编辑**

```
// ========================================
// 消息通知模块 - 消息、已读记录
// ========================================

Table sys_message {
  id bigint [pk, increment]
  title varchar(200) [not null]
  content text [not null]
  msg_type varchar(50) [note: '消息类型']
  sender_id bigint
  receiver_id bigint [not null]
  send_time datetime
  read_status tinyint [default: 0, note: '0-未读 1-已读']
  read_time datetime
}

Table sys_msg_read {
  id bigint [pk, increment]
  msg_id bigint [not null]
  user_id bigint [not null]
  read_time datetime
}

// ========== 关系定义 ==========
Ref: sys_message.sender_id > sys_user.id
Ref: sys_message.receiver_id > sys_user.id
Ref: sys_msg_read.msg_id > sys_message.id
Ref: sys_msg_read.user_id > sys_user.id
```

---

## 📁 模块10：系统监控模块

**plaintext****编辑**

```
// ========================================
// 系统监控模块 - 生产、成本、补贴、两岸协同
// ========================================

// ========== 生产管理 ==========
Table prod_plan {
  id bigint [pk, increment]
  plan_name varchar(100) [not null]
  pond_id bigint [not null]
  plan_start_date date [not null]
  plan_end_date date [not null]
  plan_desc varchar(500)
  status tinyint [default: 1, note: '1-计划中 2-进行中 3-已完成 0-已取消']
  create_time datetime
}

Table prod_task {
  id bigint [pk, increment]
  plan_id bigint [not null]
  task_name varchar(100) [not null]
  task_type varchar(50) [note: '任务类型']
  task_desc varchar(500)
  plan_date date [not null]
  actual_date date
  executor_id bigint
  status tinyint [default: 1, note: '1-待执行 2-执行中 3-已完成 0-已取消']
  create_time datetime
}

Table prod_log {
  id bigint [pk, increment]
  task_id bigint [not null]
  log_content text [not null]
  log_time datetime [not null]
  operator_id bigint
  create_time datetime
}

// ========== 深远海装备 ==========
Table vsl_info {
  id bigint [pk, increment]
  vsl_code varchar(50) [unique, not null]
  vsl_name varchar(100) [not null]
  breeder_id bigint
  vsl_type varchar(50) [note: '工船类型']
  tonnage decimal(10,2) [note: '吨位']
  length decimal(10,2) [note: '长度(米)']
  width decimal(10,2) [note: '宽度(米)']
  depth decimal(10,2) [note: '深度(米)']
  max_capacity decimal(10,2) [note: '最大养殖容量(吨)']
  status tinyint [default: 1]
  create_time datetime
}

Table vsl_ext {
  id bigint [pk, increment]
  vsl_id bigint [not null]
  engine_power decimal(10,2) [note: '发动机功率(kw)']
  navigation_area varchar(200) [note: '航行区域']
  crew_count int [note: '船员数量']
  equipment_list text [note: '设备清单']
  remark varchar(500)
}

Table cage_info {
  id bigint [pk, increment]
  cage_code varchar(50) [unique, not null]
  cage_name varchar(100) [not null]
  vsl_id bigint [not null]
  cage_type varchar(50) [note: '网箱类型']
  volume decimal(10,2) [note: '容积(立方米)']
  breeding_species varchar(100) [note: '养殖品种']
  status tinyint [default: 1]
  create_time datetime
}

Table op_log {
  id bigint [pk, increment]
  cage_id bigint [not null]
  op_type varchar(50) [not null, note: '作业类型']
  op_content text [not null]
  op_time datetime [not null]
  operator_id bigint
  create_time datetime
}

Table cost_main {
  id bigint [pk, increment]
  vsl_id bigint [not null]
  cost_period varchar(20) [not null, note: '成本周期：月/季/年']
  period_start date [not null]
  period_end date [not null]
  total_amount decimal(10,2) [note: '总金额']
  create_time datetime
}

Table cost_item {
  id bigint [pk, increment]
  main_id bigint [not null]
  item_name varchar(100) [not null]
  item_type varchar(50) [note: '成本类型']
  item_amount decimal(10,2) [not null]
  remark varchar(200)
}

Table sub_info {
  id bigint [pk, increment]
  vsl_id bigint [not null]
  sub_type varchar(50) [not null, note: '补贴类型']
  sub_amount decimal(10,2) [not null]
  apply_date date [not null]
  approve_date date
  status tinyint [default: 1, note: '1-申请中 2-已批准 3-已发放 0-已驳回']
  remark varchar(500)
  create_time datetime
}

// ========== 两岸协同 ==========
Table cs_enterprise {
  id bigint [pk, increment]
  enterprise_code varchar(50) [unique, not null]
  enterprise_name varchar(100) [not null]
  enterprise_type varchar(50) [note: '企业类型']
  legal_person varchar(50)
  phone varchar(20)
  address varchar(200)
  taiwan_region varchar(100) [note: '台湾地区']
  cooperation_scope varchar(500) [note: '合作范围']
  status tinyint [default: 1]
  create_time datetime
}

Table cs_seed {
  id bigint [pk, increment]
  enterprise_id bigint [not null]
  seed_name varchar(100) [not null]
  seed_type varchar(50) [note: '种苗类型']
  origin varchar(100) [note: '原产地']
  import_date date [not null]
  import_quantity decimal(10,2) [note: '引进数量']
  quarantine_result varchar(200) [note: '检疫结果']
  status tinyint [default: 1]
  create_time datetime
}

Table cs_tech {
  id bigint [pk, increment]
  enterprise_id bigint [not null]
  tech_name varchar(200) [not null]
  tech_type varchar(50) [note: '技术类型']
  tech_content text [not null]
  cooperation_mode varchar(100) [note: '合作模式']
  start_date date [not null]
  end_date date
  status tinyint [default: 1]
  create_time datetime
}

Table cs_market {
  id bigint [pk, increment]
  enterprise_id bigint [not null]
  market_name varchar(100) [not null]
  market_location varchar(200) [note: '市场位置']
  market_type varchar(50) [note: '市场类型']
  product_demand text [note: '产品需求']
  cooperation_content text [note: '合作内容']
  status tinyint [default: 1]
  create_time datetime
}

// ========== 通讯录 ==========
Table cont_info {
  id bigint [pk, increment]
  contact_name varchar(50) [not null]
  phone varchar(20)
  email varchar(100)
  company varchar(100)
  position varchar(50)
  address varchar(200)
  category varchar(50) [note: '分类：供应商/客户/专家']
  remark varchar(500)
  create_time datetime
}

// ========== 知识库 ==========
Table kb_article {
  id bigint [pk, increment]
  title varchar(200) [not null]
  category varchar(50) [note: '分类']
  content text [not null]
  author varchar(50)
  publish_date date
  view_count int [default: 0]
  status tinyint [default: 1]
  create_time datetime
}

// ========== 关系定义 ==========
Ref: prod_task.plan_id > prod_plan.id
Ref: prod_log.task_id > prod_task.id
Ref: vsl_info.breeder_id > biz_breeder.id
Ref: vsl_ext.vsl_id > vsl_info.id
Ref: cage_info.vsl_id > vsl_info.id
Ref: op_log.cage_id > cage_info.id
Ref: cost_main.vsl_id > vsl_info.id
Ref: cost_item.main_id > cost_main.id
Ref: sub_info.vsl_id > vsl_info.id
Ref: cs_seed.enterprise_id > cs_enterprise.id
Ref: cs_tech.enterprise_id > cs_enterprise.id
Ref: cs_market.enterprise_id > cs_enterprise.id
```

---

## ✨ 10个模块总结
