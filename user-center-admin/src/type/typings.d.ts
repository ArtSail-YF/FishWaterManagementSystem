// @ts-ignore
/* eslint-disable */

// import { Result } from "antd";


declare namespace Pond {

// =============== 全局状态枚举 ===============
export type PondStatus = 'breeding' | 'empty' | 'locked' | 'ready';
export type TaskType = 'feed' | 'medicine' | 'water' | 'harvest';
export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type TimelineStatus = 'wait' | 'process' | 'finish';

// =============== 水质相关 ===============
export interface WaterMetrics {
  waterLevel?: number;      // cm
  waterTemp?: number;       // °C
  waterPH?: number;
  waterDO?: number;         // mg/L
  waterTurbidity?: number;  // NTU
}

export type PondWaterLog = {
  timestamp: string;
  dissolvedOxygen: number;
  waterTemperature?: number;
  pH?: number;
};

export type WaterStats = {
  total: number;
  normal: number;
  warning: number;
  error: number;
};

export type WaterAlarmLog = {
  id: string;
  time: string;
  metric?: string;
  value?: number;
  threshold?: number;
  status?: 'normal' | 'warning' | 'error';
  handle?: '未处理' | '已处理';
};



// =============== 塘口物理参数 ===============

export interface PondPhysicalParams {
  area?: number;
  depth?: number;
  days?: number;
  aerators?: string;
}

// =============== 基地主数据 ===============
export interface BaseItem {
  id: string;
  name: string;
  location: [number, number]; // [经度, 纬度]
  status: 'normal' | 'warning' | 'todo';
  waterQuality: {
    oxygen: number;
    temp: number;
    ph: number;
  };
}

// =============== 塘口主数据 ===============

export interface PondItem {
  id: string;
  name: string;
  baseId: string; // 关联基地 ID
  type: string; // 养殖类型 (南美白对虾/蟹苗/混养)
  area: number; // 面积 (亩)
  depth: number; // 平均深度 (m)
  status: 'breeding' | 'empty' | 'locked' | 'ready';
  species: string; // 当前养殖品种
  days: number; // 已养殖天数
  temp: number; // 实时水温
  do: number; // 实时溶氧量 (mg/L)
  doTrend: number[]; // 溶氧历史趋势数据
  estWeight: number; // 预计产量 (kg)
  videoStatus: 'online' | 'offline' | 'error'; // 视频在线状态
  videoUrl: string; // 视频流地址 (RTSP/HLS)
  sensorCount: number; // 关联传感器数量
  iotNodes: string[]; // 关联的 IoT 节点 ID 列表
}

export interface PondDetail extends PondItem {
  TASKS?: Record<string, Task.TaskItem[]>;
  timeline?: Task.PondTimelineItem[]; 
  Water?: WaterMetrics;
  PondPhysical?: PondPhysicalParams;
  stats?: Task.PlanStatsProps;
}


export interface PondSummaryStatsProps {
  totalPonds?: number;
  breedingCount?: number;
  emptyCount?: number;
  lockedCount?: number;
  totalArea?: number;
  avgDepth?: number;
  totalBiomass?: number;
  species?: string[];
  estimatedValue?: number;
  growthRate?: number;
}

export interface PondListWithSummary {
  summary: PondSummaryStatsProps; 
  list: PondItem[];
}

// =============== 生产日志主数据 ===============

export interface ProductionLogItem {
  id: string;
  time: string;
  pondId: string;
  pondName?: string;
  type: 'feeding' | 'medicine' | 'water' | 'patrol';
  content: string; // 动态描述，如 "投喂 15kg 虾料1号"
  operator: string;
  status: string;
  details: any; // 原始数据引用
}


export type PondStatus= {
  id: string;
  name: string;
  baseName: string;
  status: 'normal' | 'warning' | 'error';
  indicators: {
    oxygen: { value: number; trend: 'up' | 'down' | 'stable' };
    temp: { value: number; trend: 'up' | 'down' | 'stable' };
    ph: { value: number; trend: 'up' | 'down' | 'stable' };
  };
}






}



