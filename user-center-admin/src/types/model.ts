/**
 * 数据模型类型定义
 * 前端使用的理想数据模型
 */

import type { BaseEntity } from './common';
import type {
  PlanTypeEnum,
  PlanStatusEnum,
  TaskStatusEnum,
  WarningTypeEnum,
  WarningLevelEnum,
  PondTypeEnum,
  PondStatusEnum,
  AlarmStatusEnum,
  WaterQualityStatusEnum,
  DataSourceEnum,
  DeviceStatusEnum,
  NodeTypeEnum
} from './enum';

// ====== 生产管理模型 ======

/** 生产计划 (prod_plan) */
export interface ProductionPlan extends BaseEntity {
  baseId?: number;                    // 所属基地ID
  parentPlanId?: number;              // 父计划ID
  targetType?: 'pond' | 'cage' | 'vsl'; // 目标类型
  targetId?: number;                  // 目标实体ID
  planType?: 'feeding' | 'medication' | 'harvest' | 'maintenance' | 'seeding' | 'water_change'; // 计划类型
  title?: string;                     // 计划标题
  contentDesc?: string;               // 详细描述/操作指南
  startTime?: string;                 // 计划开始时间
  endTime?: string;                   // 计划结束时间
  cycleRule?: string;                 // 循环规则
  status?: 'draft' | 'published' | 'active' | 'completed' | 'cancelled' | 'pending_approval' | 'approved' | 'rejected'; // 状态
  ownerId?: number;                   // 制定人/管理员ID
  assigneeGroupId?: number;           // 指派班组/角色ID
  baseName?: string;                   // 基地名称（关联查询）
  targetName?: string;                  // 目标名称（关联查询）
  deviceId?: number;                    // 关联 IoT 设备ID
  deviceAction?: string;                // IoT 设备操作指令
  priority?: string;                     // 优先级: low/medium/high/urgent
  feedVariety?: string;                  // 饲料品种
  feedAmount?: number;                    // 投喂量(kg)
  drugName?: string;                      // 药品名称
  dosage?: string;                        // 用量
  withdrawalDays?: number;               // 休药期天数
  weatherReq?: string;                    // 气象要求
  estYield?: number;                      // 预计产量(kg)
  // 系统字段
  createTime?: string;                // 创建时间
  updateTime?: string;                // 更新时间
  isDelete?: number;                  // 是否删除: 0-正常, 1-已删除
  deleteTime?: string;                // 删除时间
}

/** 生产任务 (prod_task) */
export interface ProductionTask extends BaseEntity {
  planId?: number;                    // 来源计划ID
  baseId?: number;                    // 所属基地ID
  taskTitle?: string;                 // 任务标题
  targetType?: 'pond' | 'cage' | 'vsl'; // 目标类型
  targetId?: number;                  // 目标ID
  actionTime?: string;                // 要求执行的具体时间
  deadlineTime?: string;              // 最晚完成时间
  status?: 'pending' | 'assigned' | 'doing' | 'done' | 'skipped' | 'expired'; // 状态
  assigneeId?: number;                // 具体执行工人ID
  cancelReason?: string;              // 取消/跳过原因
  baseName?: string;                   // 基地名称（关联查询）
  targetName?: string;                  // 目标名称（关联查询）
  // 系统字段
  createTime?: string;                // 创建时间
  updateTime?: string;                // 更新时间
  isDelete?: number;                  // 是否删除: 0-正常, 1-已删除
  deleteTime?: string;                // 删除时间
}

/** 生产日志 (prod_log) */
export interface ProductionLog extends BaseEntity {
  taskId?: number;                    // 关联的任务ID
  planId?: number;                    // 关联的计划ID
  baseId?: number;                    // 所属基地ID
  targetType?: 'pond' | 'cage' | 'vsl'; // 目标类型
  targetId?: number;                  // 目标ID
  logType?: string;                   // 作业类型
  actionTime?: string;                // 实际发生时间
  quantity?: number;                  // 实际数量/用量
  photoUrls?: string;                 // 照片URL列表 (逗号分隔)
  gpsLat?: number;                    // 打卡纬度
  gpsLng?: number;                    // 打卡经度
  source?: 'app' | 'admin' | 'system'; // 来源
  createdBy?: number;                 // 录入账号ID
  actualWorkerId?: number;            // 实际干活的人ID
  isBackfilled?: boolean;             // 是否事后补录
  backfillReason?: string;            // 补录原因
  verifyStatus?: 'auto' | 'pending' | 'rejected'; // 审核状态
  // 用药特有字段（从med_record表关联）
  medicineName?: string;              // 药物名称
  drugName?: string;                  // 药品名称（别名）
  reason?: string;                    // 用药原因
  withdrawalRemaining?: number;       // 剩余休药期天数
  withdrawalDays?: number;            // 休药期总天数
  withdrawalStatus?: string;          // 休药期状态
  unit?: string;                      // 单位
  remark?: string;                    // 备注
  // 前端扩展字段
  details?: {                         // 详情对象（前端使用）
    medicineName?: string;            // 药物名称
    dose?: number;                    // 剂量
    reason?: string;                  // 用药原因
    withdrawalRemaining?: number;     // 剩余休药期天数
    withdrawalDays?: number;          // 休药期总天数
    status?: string;                  // 休药期状态
    remarks?: string;                 // 备注
    amount?: number;                  // 数量（投喂用）
    method?: string;                  // 方法
  };
  // 兼容旧字段
  time?: string;                      // 操作时间（兼容）
  pondId?: string;                    // 塘口ID（兼容）
  content?: string;                   // 内容摘要（兼容）
  operator?: string;                  // 操作人（兼容）
  status?: string;                    // 状态（兼容）
  // 系统字段
  createTime?: string;                // 创建时间
  updateTime?: string;                // 更新时间
}

/** 物资库存 (stk_inventory) */
export interface StockInventory extends BaseEntity {
  baseId: number;                     // 基地ID
  matId: number;                      // 物资ID
  batchNo?: string;                   // 批次号
  currentQty?: number;                // 当前结存数量
  lockQty?: number;                   // 锁定数量
  lastUpdateTime?: string;            // 最后更新时间
}

/** 物资分类 (mat_category) */
export interface MaterialCategory extends BaseEntity {
  catCode: string;                    // 分类编码
  catName: string;                    // 分类名称
}

// ====== 预警中心模型 ======

export interface WarningRule extends BaseEntity {
  name: string;                // 预警名称
  warningType: WarningTypeEnum; // 预警类型
  warningLevel: WarningLevelEnum; // 预警级别
  condition: string;           // 预警条件
  enabled: number;            // 是否启用
  notifyChannels?: string[];   // 通知渠道
  creatorId: string;          // 创建人ID
}

export interface WarningRuleParam extends BaseEntity {
  ruleId: string;             // 关联规则ID
  paramName: string;          // 参数名称
  paramType: string;         // 参数类型
  paramValue: string;        // 参数值
  minValue?: number;         // 最小值
  maxValue?: number;         // 最大值
  unit?: string;             // 单位
}

export interface WarningRecord extends BaseEntity {
  ruleId: string;             // 关联规则ID
  pondId: string;            // 塘口ID
  content: string;            // 预警内容
  warningLevel: WarningLevelEnum; // 预警级别
  handled: number;            // 是否已处理
  handlerId?: string;         // 处理人ID
  handleTime?: string;        // 处理时间
  handleNotes?: string;       // 处理备注
}

// ====== 资源管理模型 ======

// ====== 基地管理模型 ======
export interface BaseInfo extends BaseEntity {
  name: string;               // 基地名称
  code: string;               // 基地编码
  location: string;           // 地理位置
  area: number;               // 总面积(亩)
  contact: string;            // 联系人
  phone: string;              // 联系电话
  status: number;             // 状态：1-启用，0-停用
  description?: string;       // 描述
}

// ====== 塘口管理模型 ======
export interface PondInfo extends BaseEntity {
  baseId: string;             // 所属基地ID
  name: string;               // 塘口名称
  area: number;               // 面积(亩)
  depth?: number;             // 平均水深(米)
  pondType: PondTypeEnum;      // 类型
  ecologicalIndex?: number;   // 生态健康指数
  carbonFootprint?: number;   // 碳足迹（吨/年）
  status: PondStatusEnum;     // 状态
}

// ====== 物资档案模型 ======
export interface MaterialArchive extends BaseEntity {
  code: string;               // 物资编码
  name: string;               // 物资名称
  type: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other'; // 物资类型
  category: string;           // 分类
  specification: string;      // 规格
  unit: string;               // 单位
  supplier: string;           // 供应商
  brand: string;              // 品牌
  shelfLife: number;          // 保质期(天)
  storageCondition: string;   // 存储条件
  status: 'active' | 'inactive'; // 状态：active-启用，inactive-停用
  description?: string;       // 描述
}

// ====== 字典管理模型 ======

// ====== 字典类型模型 ======
export interface SysDictType extends BaseEntity {
  dictType: string;           // 字典类型
  dictName: string;           // 字典名称
  description?: string;       // 描述
  status: number;             // 状态：1-启用，0-停用
}

// ====== 字典数据模型 ======
export interface SysDictData extends BaseEntity {
  dictType: string;           // 字典类型
  dictLabel: string;          // 字典标签
  dictValue: string;          // 字典值
  sortOrder: number;          // 排序
  status: number;             // 状态：1-启用，0-停用
}

// ====== 水质监测模型 ======

export interface WaterQuality extends BaseEntity {
  pondId: string;             // 塘口ID
  monitorTime: string;        // 监测时间
  ph?: number;               // pH值
  do?: number;               // 溶解氧（mg/L）
  temperature?: number;       // 水温（℃）
  nh3_n?: number;            // 氨氮（mg/L）
  no2_n?: number;            // 亚硝酸盐（mg/L）
  no3_n?: number;            // 硝酸盐（mg/L）
  cod?: number;              // 化学需氧量（mg/L）
  turbidity?: number;        // 浊度（NTU）
  salinity?: number;         // 盐度（‰）
  deepseaCurrentSpeed?: number; // 海流速度（m/s）
  deepseaCurrentDirection?: string; // 海流方向
  alarmStatus?: AlarmStatusEnum; // 报警状态
  alarmReason?: string;      // 报警原因
  status?: WaterQualityStatusEnum; // 状态
}

// ====== 气象数据模型 ======

export interface WeatherData extends BaseEntity {
  baseId: string;            // 基地编号
  logTime: string;           // 记录时间
  temperature?: number;      // 气温（℃）
  humidity?: number;         // 湿度（%）
  windSpeed?: number;        // 风速（m/s）
  windDirection?: string;    // 风向
  weatherCondition?: string; // 天气状况
  rainfall?: number;         // 降水量（mm）
  airPressure?: number;      // 气压（hPa）
  uvIndex?: number;          // 紫外线指数
  waveHeight?: number;       // 浪高（米，深远海专用）
  wavePeriod?: number;       // 浪周期（秒，深远海专用）
  dataSource?: DataSourceEnum; // 数据来源
}

// ====== 物联网设备模型 ======

export interface IoTNode extends BaseEntity {
  pondId: string;            // 所属塘口编号
  nodeType: NodeTypeEnum;    // 节点类型
  nodeName: string;          // 节点名称
  installLocation?: string;  // 安装位置
  deviceId?: string;         // 设备ID
  ipAddress?: string;       // IP地址
  macAddress?: string;      // MAC地址
  status: DeviceStatusEnum;  // 状态
  installDate?: string;      // 安装日期
  lastMaintenanceDate?: string; // 最后维护日期
  nextMaintenanceDate?: string; // 下次维护日期
}

/** IoT 设备 (iot_device) */
export interface IoTDevice {
  id?: number;
  deviceSn?: string;             // 设备唯一序列号
  deviceName?: string;           // 设备名称
  typeId?: number;               // 设备类型ID
  typeName?: string;             // 设备类型名称（联表）
  typeCode?: string;             // 设备类型编码（联表）
  baseId?: number;               // 所属基地ID
  baseName?: string;             // 基地名称（联表）
  pondId?: number;               // 关联塘口ID
  pondName?: string;             // 塘口名称（联表）
  ipAddress?: string;            // IP地址
  port?: number;                 // 端口
  authInfo?: string;             // 鉴权信息
  status?: number;               // 1=在线, 0=离线, 2=维护中
  statusText?: string;           // 状态文本
  lastHeartbeat?: string;        // 最后心跳时间
  installTime?: string;          // 安装时间
  remark?: string;               // 备注
}


// ====== 输入记录模型 ======

export interface InputRecord extends BaseEntity {
  pondId: string;            // 塘口ID
  recordType: string;        // 记录类型：feeding, medicine, etc.
  inputTime: string;         // 输入时间
  inputAmount: number;       // 输入量
  unit: string;             // 单位
  operatorId: string;       // 操作人ID
  notes?: string;           // 备注
}

// ====== 用户模型 ======

export interface User extends BaseEntity {
  username: string;         // 用户名
  realName: string;         // 真实姓名
  password: string;         // 密码（加密）
  phone?: string;           // 联系电话
  email?: string;          // 电子邮箱
  avatar?: string;         // 头像地址
  status: number;         // 状态：1-启用，0-禁用
  lastLoginTime?: string;  // 最后登录时间
  lastLoginIp?: string;   // 最后登录IP
}

// ====== Mock数据模型 ======

export interface PondItem {
  id: string;
  name: string;
  baseId: string;
  type: string;
  area: number;
  depth: number;
  status: string;
  species: string;
  days: number;
  temp: number;
  do: number;
  doTrend: number[];
  estWeight: number;
  videoStatus: string;
  videoUrl: string;
  sensorCount: number;
  iotNodes: string[];
  pond_type: string;
  ecological_index: number;
  carbon_footprint: number;
}

export interface PondSummaryStatsProps {
  totalPonds: number;
  breedingCount: number;
  emptyCount: number;
  lockedCount: number;
  totalArea: number;
  avgDepth: number;
  totalBiomass: number;
  species: string[];
}

export interface ProductionLogItem {
  id: string;
  time: string;
  pondId: string;
  type: string;
  content: string;
  operator: string;
  status: string;
  details?: any;
  // 新增分类字段
  category: 'pond' | 'cage' | 'workboat';
  categoryName: string;
  // 分类特定字段
  area?: number;           // 塘口面积(亩)
  cageNumber?: string;     // 网箱编号
  compartment?: string;    // 工船舱室
  tonnage?: number;        // 工船吨位(吨)
}

// ====== 投入记录 (Input) ======

export interface InputRecordItem {
  id: string;
  type: 'in' | 'out';           // in: 入库, out: 出库
  date: string;                 // 日期
  name: string;                 // 物品名称
  category: string;             // 类别: feed/medicine/equipment
  specification: string;        // 规格
  quantity: number;             // 数量
  unit: string;                 // 单位
  price: number;                // 单价
  totalPrice: number;           // 总价
  supplier?: string;            // 供应商 (入库时)
  pondName?: string;            // 塘口名称 (出库时)
  status: 'pending' | 'approved' | 'rejected'; // 状态
  operator: string;             // 操作人
  createTime?: string;          // 创建时间
  updateTime?: string;          // 更新时间
}

// ====== 预警记录 (Warning) ======

export interface WarningHistoryRecord {
  id: string;
  warningId: string;            // 预警ID
  warningType: string;          // 预警类型
  warningLevel: 'low' | 'medium' | 'high'; // 预警级别
  title: string;                // 预警标题
  content: string;              // 预警内容
  pondId: string;               // 塘口ID
  pondName: string;             // 塘口名称
  triggerTime: string;          // 触发时间
  status: 'pending' | 'handled' | 'closed'; // 状态
  handler?: string;             // 处理人
  handleTime?: string;          // 处理时间
  handleNotes?: string;         // 处理说明
  createTime?: string;          // 创建时间
}

export interface WarningStatsData {
  totalWarnings: number;        // 总预警数
  handledWarnings: number;      // 已处理预警数
  pendingWarnings: number;      // 待处理预警数
  highLevelWarnings: number;    // 高级别预警数
  mediumLevelWarnings: number;  // 中级别预警数
  lowLevelWarnings: number;     // 低级别预警数
  warningTrend: Array<{         // 预警趋势
    date: string;
    count: number;
  }>;
  warningTypeDistribution: Array<{ // 预警类型分布
    type: string;
    count: number;
    percentage: number;
  }>;
}

// ====== 综合预警 (Comprehensive Warning) ======

export interface AlertItem {
  key: string;                  // 预警唯一标识
  type: string;                 // 预警类型
  level: 'low' | 'medium' | 'high' | 'critical'; // 预警级别
  title: string;                // 预警标题
  content: string;              // 预警内容
  pondName: string;             // 塘口名称
  triggerTime: string;          // 触发时间
  status: 'pending' | 'handled' | 'ignored'; // 状态
  handler?: string;             // 处理人
  handleTime?: string;          // 处理时间
}

export interface AlertSummaryData {
  totalAlerts: number;          // 总预警数
  pendingAlerts: number;        // 待处理预警数
  handledAlerts: number;        // 已处理预警数
  criticalAlerts: number;       // 严重预警数
  highAlerts: number;           // 高级别预警数
  mediumAlerts: number;         // 中级别预警数
  lowAlerts: number;            // 低级别预警数
}

export interface RiskDistributionData {
  highRisk: number;             // 高风险数量
  mediumRisk: number;           // 中风险数量
  lowRisk: number;              // 低风险数量
  safe: number;                 // 安全数量
  distribution: Array<{         // 分布详情
    level: string;
    count: number;
    percentage: number;
  }>;
}

