import { request } from '@umijs/max';

/** 预警级别类型 */
export type AlertLevel = 'P0' | 'P1' | 'P2';

/** 实时预警项 */
export type AlertItem = {
  key: string;
  level: AlertLevel;
  time: string;
  source: string;
  description: string;
  duration: string;
  status: 'pending' | 'resolved' | 'ignored';
};

/** 预警统计 */
export type AlertSummaryData = {
  unprocessed: number;
  newInHour: number;
  processedToday: number;
  avgResponseTime: string;
};

/** 历史预警复盘记录 */
export type WarningHistoryRecord = {
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
};

/** 预警历史统计 */
export type WarningStatsData = {
  total: number;
  solveRate: number;
  avgHandleTime: string;
  trend: { value: number; isUp: boolean };
};

/** 风险分布数据 */
export type RiskDistributionData = {
  heatmap: { x: string[]; y: string[]; data: [number, number, number][] };
  composition: { name: string; value: number; color: string }[];
};

// ================== API 请求函数 ==================

/**
 * 获取实时预警流水
 * GET /api/warning/realtime
 */
export async function getRealTimeAlerts(options?: any) {
  return request<API.BaseResponse<AlertItem[]>>('/api/warning/realtime', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取预警统计摘要
 * GET /api/warning/summary
 */
export async function getWarningSummary(options?: any) {
  return request<API.BaseResponse<AlertSummaryData>>('/api/warning/summary', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取历史预警记录
 * GET /api/warning/history
 */
export async function getWarningHistory(options?: any) {
  return request<API.BaseResponse<WarningHistoryRecord[]>>('/api/warning/history', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取预警历史统计
 * GET /api/warning/stats
 */
export async function getWarningStats(options?: any) {
  return request<API.BaseResponse<WarningStatsData>>('/api/warning/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取风险分布数据
 * GET /api/warning/risk-distribution
 */
export async function getRiskDistribution(options?: any) {
  return request<API.BaseResponse<RiskDistributionData>>('/api/warning/risk-distribution', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 标记预警为已处理
 * POST /api/warning/process/:id
 */
export async function processWarning(id: string, data: any) {
  return request<API.BaseResponse<boolean>>(`/api/warning/process/${id}`, {
    method: 'POST',
    data,
  });
}
