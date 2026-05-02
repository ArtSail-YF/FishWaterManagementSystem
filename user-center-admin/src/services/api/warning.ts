// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type {
  WarningRuleParams,
  WarningRuleList,
  WarningRuleDetail,
  BaseResponse,
  WarningRule,
  WarningRuleParam,
  WarningRecordParams,
  WarningRecordList,
  WarningRecord,
  WarningHistoryRecord,
  WarningStatsData,
  AlertItem,
  AlertSummaryData,
  RiskDistributionData
} from '@/types';

/**
 * 预警中心API接口
 * 遵循阿里Ant Design Pro规范
 */

// ====== 预警规则管理 ======

/** 获取预警规则列表 GET /api/warning/rule/list */
export async function getWarningRuleList(
  params: WarningRuleParams,
  options?: { [key: string]: any },
) {
  return request<WarningRuleList>('/warning/rule/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取预警规则详情 GET /api/warning/rule/detail */
export async function getWarningRuleDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<WarningRuleDetail>('/warning/rule/detail', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 创建预警规则 POST /api/warning/rule/create */
export async function createWarningRule(
  body: Omit<WarningRule, 'id' | 'createTime' | 'updateTime' | 'isDeleted'> & {
    params?: Array<Omit<WarningRuleParam, 'id' | 'createTime'>>;
  },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/warning/rule/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新预警规则 PUT /api/warning/rule/update */
export async function updateWarningRule(
  body: Partial<WarningRule> & { id: string } & {
    params?: Array<Omit<WarningRuleParam, 'id' | 'createTime'>>;
  },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/warning/rule/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除预警规则 DELETE /api/warning/rule/delete */
export async function deleteWarningRule(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/warning/rule/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 启用/禁用预警规则 POST /api/warning/rule/toggle */
export async function toggleWarningRule(
  body: { id: string; enabled: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/warning/rule/toggle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 预警记录管理 ======

/** 获取预警记录列表 GET /api/warning/record/list */
export async function getWarningRecordList(
  params: WarningRecordParams,
  options?: { [key: string]: any },
) {
  return request<WarningRecordList>('/warning/record/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 处理预警记录 POST /api/warning/record/handle */
export async function handleWarningRecord(
  body: { id: string; handlerId: string; handleNotes: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/warning/record/handle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量处理预警记录 POST /api/warning/record/batch-handle */
export async function batchHandleWarningRecord(
  body: { ids: string[]; handlerId: string; handleNotes: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/warning/record/batch-handle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 预警统计 ======

/** 获取预警统计 GET /api/warning/statistics */
export async function getWarningStatistics(
  params: { startTime?: string; endTime?: string; warningType?: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/warning/statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取实时预警 GET /api/warning/realtime */
export async function getRealtimeWarning(
  options?: { [key: string]: any },
) {
  return request<BaseResponse<WarningRecord[]>>('/warning/realtime', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取预警历史记录 GET /api/warning/history */
export async function getWarningHistory(
  options?: { [key: string]: any },
): Promise<BaseResponse<WarningHistoryRecord[]>> {
  return request<BaseResponse<WarningHistoryRecord[]>>('/warning/history', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取预警统计数据 GET /api/warning/stats */
export async function getWarningStats(
  options?: { [key: string]: any },
): Promise<BaseResponse<WarningStatsData>> {
  return request<BaseResponse<WarningStatsData>>('/warning/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

export type { WarningHistoryRecord, WarningStatsData };

// ====== 综合预警 (Comprehensive Warning) ======

/** 获取实时预警列表 GET /warning/realtime-alerts */
export async function getRealTimeAlerts(
  options?: { [key: string]: any },
): Promise<BaseResponse<AlertItem[]>> {
  return request<BaseResponse<AlertItem[]>>('/warning/realtime-alerts', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取预警汇总数据 GET /warning/summary */
export async function getWarningSummary(
  options?: { [key: string]: any },
): Promise<BaseResponse<AlertSummaryData>> {
  return request<BaseResponse<AlertSummaryData>>('/warning/summary', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 处理预警 POST /warning/process */
export async function processWarning(
  body: { key: string; status: 'handled' | 'ignored'; handler?: string; notes?: string },
  options?: { [key: string]: any },
): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>('/warning/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 获取风险分布数据 GET /warning/risk-distribution */
export async function getRiskDistribution(
  options?: { [key: string]: any },
): Promise<BaseResponse<RiskDistributionData>> {
  return request<BaseResponse<RiskDistributionData>>('/warning/risk-distribution', {
    method: 'GET',
    ...(options || {}),
  });
}

export type { AlertItem, AlertSummaryData, RiskDistributionData };