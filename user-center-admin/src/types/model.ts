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

export interface ProductionPlan extends BaseEntity {
  planType: PlanTypeEnum;      // 计划类型
  planName: string;            // 计划名称
  pondIds: string[];           // 塘口ID列表
  content?: any;               // 计划内容(JSON格式)
  startTime: string;           // 计划开始时间
  endTime: string;             // 计划结束时间
  status: PlanStatusEnum;      // 状态
  creatorId: string;           // 创建人ID
  approverId?: string;         // 审批人ID
  approvalStatus: number;      // 审批状态
  approvalTime?: string;       // 审批时间
}

export interface ProductionTask extends BaseEntity {
  planId: string;              // 关联计划ID
  taskName: string;            // 任务名称
  taskType: PlanTypeEnum;       // 任务类型
  pondId: string;              // 塘口ID
  executionTime: string;       // 预计执行时间
  actualTime?: string;         // 实际执行时间
  executorId?: string;         // 执行人ID
  status: TaskStatusEnum;      // 执行状态
  notes?: string;              // 备注
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