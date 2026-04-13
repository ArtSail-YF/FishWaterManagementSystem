/**
 * 预警相关API服务
 * 封装 API 调用 + 类型转换
 */

import { request } from '@umijs/max';
import type {
  AlertListResponse,
  AlertSummaryResponse,
  WarningHistoryResponse,
  WarningStatsResponse,
  RiskDistributionResponse,
  BaseResponse,
} from '@/types/api';
import type {
  AlertItem,
  AlertSummary,
  WarningHistory,
  WarningStats,
  RiskDistribution,
} from '@/models/warning';

/**
 * 获取实时预警流水
 * GET /api/warning/realtime
 */
export async function getRealTimeAlerts(options?: any) {
  const response = await request<AlertListResponse>('/api/warning/realtime', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 获取预警统计摘要
 * GET /api/warning/summary
 */
export async function getWarningSummary(options?: any) {
  const response = await request<AlertSummaryResponse>('/api/warning/summary', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 获取历史预警记录
 * GET /api/warning/history
 */
export async function getWarningHistory(options?: any) {
  const response = await request<WarningHistoryResponse>('/api/warning/history', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 获取预警历史统计
 * GET /api/warning/stats
 */
export async function getWarningStats(options?: any) {
  const response = await request<WarningStatsResponse>('/api/warning/stats', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 获取风险分布数据
 * GET /api/warning/risk-distribution
 */
export async function getRiskDistribution(options?: any) {
  const response = await request<RiskDistributionResponse>('/api/warning/risk-distribution', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 标记预警为已处理
 * POST /api/warning/process/:id
 */
export async function processWarning(id: string, data: any) {
  return request<BaseResponse<boolean>>(`/api/warning/process/${id}`, {
    method: 'POST',
    data,
  });
}
