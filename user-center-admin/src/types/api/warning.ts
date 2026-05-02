/**
 * 预警相关API返回的数据结构（契约）
 * 这些类型定义应该与后端API文档保持一致
 */

import { BaseResponse } from '../common';

/** 预警级别 */
export type AlertLevel = 'P0' | 'P1' | 'P2';

/** 实时预警项 */
export interface AlertItemDTO {
  key: string;
  level: AlertLevel;
  time: string;
  source: string;
  description: string;
  duration: string;
  status: 'pending' | 'resolved' | 'ignored';
}

/** 预警统计 */
export interface AlertSummaryDTO {
  unprocessed: number;
  newInHour: number;
  processedToday: number;
  avgResponseTime: string;
}

/** 历史预警复盘记录 */
export interface WarningHistoryDTO {
  id: string;
  level: AlertLevel;
  startTime: string;
  endTime: string;
  duration: string;
  source: string;
  description: string;
  handler: string;
  status: 'resolved' | 'ignored' | 'pending';
  comment: string;
}

/** 预警历史统计 */
export interface WarningStatsDTO {
  total: number;
  solveRate: number;
  avgHandleTime: string;
  trend: { value: number; isUp: boolean };
}

/** 风险分布数据 */
export interface RiskDistributionDTO {
  heatmap: { x: string[]; y: string[]; data: [number, number, number][] };
  composition: { name: string; value: number; color: string }[];
}

/** 实时预警响应 */
export type AlertListResponse = BaseResponse<AlertItemDTO[]>;

/** 预警统计响应 */
export type AlertSummaryResponse = BaseResponse<AlertSummaryDTO>;

/** 历史预警响应 */
export type WarningHistoryResponse = BaseResponse<WarningHistoryDTO[]>;

/** 预警统计响应 */
export type WarningStatsResponse = BaseResponse<WarningStatsDTO>;

/** 风险分布响应 */
export type RiskDistributionResponse = BaseResponse<RiskDistributionDTO>;
