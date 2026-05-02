/**
 * API接口类型定义
 * 后端接口的请求/响应类型
 */

import type { BaseResponse, PaginationParams, PaginationResponse } from './common';
import type {
  ProductionPlan,
  ProductionTask,
  WarningRule,
  WarningRuleParam,
  WarningRecord,
  PondInfo,
  WaterQuality,
  WeatherData,
  IoTNode,
  InputRecord,
  User
} from './model';

// ====== 生产管理API类型 ======

export interface ProductionPlanParams extends PaginationParams {
  planType?: number;
  status?: number;
  approvalStatus?: number;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

export interface ProductionTaskParams extends PaginationParams {
  planId?: string;
  pondId?: string;
  taskType?: number;
  status?: number;
  executorId?: string;
}

export type ProductionPlanList = PaginationResponse<ProductionPlan>;
export type ProductionPlanDetail = BaseResponse<ProductionPlan>;
export type ProductionTaskList = PaginationResponse<ProductionTask>;

// ====== 预警中心API类型 ======

export interface WarningRuleParams extends PaginationParams {
  warningType?: number;
  enabled?: number;
  keyword?: string;
}

export interface WarningRecordParams extends PaginationParams {
  ruleId?: string;
  pondId?: string;
  handled?: number;
  warningLevel?: string;
  startTime?: string;
  endTime?: string;
}

export type WarningRuleList = PaginationResponse<WarningRule>;
export type WarningRuleDetail = BaseResponse<WarningRule>;
export type WarningRecordList = PaginationResponse<WarningRecord>;

// ====== 塘口管理API类型 ======

export interface PondInfoParams extends PaginationParams {
  baseId?: string;
  pondType?: number;
  status?: number;
  keyword?: string;
}

export type PondInfoList = PaginationResponse<PondInfo>;
export type PondInfoDetail = BaseResponse<PondInfo>;

// ====== 水质监测API类型 ======

export interface WaterQualityParams extends PaginationParams {
  pondId?: string;
  startTime?: string;
  endTime?: string;
  alarmStatus?: string;
}

export type WaterQualityList = PaginationResponse<WaterQuality>;
export type WaterQualityDetail = BaseResponse<WaterQuality>;

// ====== 气象数据API类型 ======

export interface WeatherDataParams extends PaginationParams {
  baseId?: string;
  startTime?: string;
  endTime?: string;
  dataType?: string;
}

export type WeatherDataList = PaginationResponse<WeatherData>;

// ====== 物联网设备API类型 ======

export interface IoTNodeParams extends PaginationParams {
  pondId?: string;
  nodeType?: string;
  status?: string;
}

export type IoTNodeList = PaginationResponse<IoTNode>;
export type IoTNodeDetail = BaseResponse<IoTNode>;

// ====== 输入记录API类型 ======

export interface InputRecordParams extends PaginationParams {
  pondId?: string;
  recordType?: string;
  startTime?: string;
  endTime?: string;
}

export type InputRecordList = PaginationResponse<InputRecord>;

// ====== 用户管理API类型 ======

export interface UserParams extends PaginationParams {
  status?: number;
  role?: string;
  keyword?: string;
}

export type UserList = PaginationResponse<User>;
export type UserDetail = BaseResponse<User>;

// ====== 统计报表API类型 ======

export interface StatisticsParams {
  startTime?: string;
  endTime?: string;
  baseId?: string;
  pondId?: string;
  type?: string;
}

export interface ProductionStatistics {
  totalPlans: number;
  completedPlans: number;
  pendingPlans: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface WarningStatistics {
  totalWarnings: number;
  handledWarnings: number;
  pendingWarnings: number;
  warningByType: Record<string, number>;
  warningByLevel: Record<string, number>;
}

export interface WaterQualityStatistics {
  avgPH: number;
  avgDO: number;
  avgTemperature: number;
  alarmCount: number;
  normalCount: number;
}

export type ProductionStatisticsResponse = BaseResponse<ProductionStatistics>;
export type WarningStatisticsResponse = BaseResponse<WarningStatistics>;
export type WaterQualityStatisticsResponse = BaseResponse<WaterQualityStatistics>;

// ====== 数据字典API类型 ======

export interface DictData {
  baseList?: Array<{ label: string; value: string }>;
  speciesList?: Array<{ label: string; value: string }>;
  pondList?: Array<{ label: string; value: string }>;
  pondStatusList?: Array<{ label: string; value: string }>;
  planTypeList?: Array<{ label: string; value: string }>;
  warningTypeList?: Array<{ label: string; value: string }>;
  warningLevelList?: Array<{ label: string; value: string }>;
}

export type DictDataResponse = BaseResponse<DictData>;

// ====== 文件上传API类型 ======

export interface UploadResponse {
  url: string;
  name: string;
  size: number;
  type: string;
}

export type UploadResponseData = BaseResponse<UploadResponse>;