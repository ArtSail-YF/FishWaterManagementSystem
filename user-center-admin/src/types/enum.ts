/**
 * 业务枚举类型定义
 * 水产养殖管理系统专用枚举
 */

// ====== 生产管理枚举 ======

export enum PlanTypeEnum {
  SEEDING = 1,        // 放苗
  FEEDING = 2,        // 投喂
  MEDICINE = 3,       // 用药
  WATER_CHANGE = 4,   // 换水
  HARVEST = 5,        // 收获
  DEEP_SEA = 6,       // 深远海作业
}

export enum PlanStatusEnum {
  DRAFT = 1,          // 草稿
  PUBLISHED = 2,      // 已发布
  EXECUTING = 3,      // 执行中
  COMPLETED = 4,      // 已完成
  DELAYED = 5,        // 已延期
  CANCELLED = 6,      // 已取消
}

export enum TaskStatusEnum {
  PENDING = 0,        // 待执行
  EXECUTED = 1,       // 已执行
  NOT_EXECUTED = 2,   // 未执行
}

// ====== 预警中心枚举 ======

export enum WarningTypeEnum {
  WATER_QUALITY = 1,  // 水质
  FEEDING = 2,        // 投喂
  MEDICINE = 3,       // 用药
  HARVEST = 4,        // 收获
  EQUIPMENT = 5,      // 设备
  WEATHER = 6,        // 天气
}

export enum WarningLevelEnum {
  INFO = 'info',      // 信息
  WARNING = 'warning', // 警告
  ERROR = 'error',    // 错误
  SUCCESS = 'success', // 成功
}

// ====== 塘口管理枚举 ======

export enum PondTypeEnum {
  TRADITIONAL = 1,    // 传统
  CAGE = 2,          // 网箱
  VESSEL = 3,        // 工船
}

export enum PondStatusEnum {
  ENABLED = 1,       // 启用
  DISABLED = 0,      // 禁用
  MAINTENANCE = 2,   // 维护中
}

// ====== 水质监测枚举 ======

export enum AlarmStatusEnum {
  NORMAL = 'normal',   // 正常
  WARNING = 'warning', // 警告
  ALARM = 'alarm',     // 报警
}

export enum WaterQualityStatusEnum {
  ACTIVE = 'active',   // 活跃
  INACTIVE = 'inactive', // 非活跃
}

// ====== 数据来源枚举 ======

export enum DataSourceEnum {
  MANUAL = 'manual',   // 手动录入
  AUTO = 'auto',       // 自动采集
  API = 'api',         // 接口获取
}

// ====== 通知渠道枚举 ======

export enum NotifyChannelEnum {
  SMS = 'sms',         // 短信
  EMAIL = 'email',     // 邮件
  APP = 'app',         // APP推送
  WECHAT = 'wechat',   // 微信
}

// ====== 设备状态枚举 ======

export enum DeviceStatusEnum {
  ONLINE = 'online',       // 在线
  OFFLINE = 'offline',     // 离线
  MAINTENANCE = 'maintenance', // 维护中
}

// ====== 节点类型枚举 ======

export enum NodeTypeEnum {
  SENSOR = 'sensor',       // 传感器
  CAMERA = 'camera',       // 摄像头
  CONTROLLER = 'controller', // 控制器
}