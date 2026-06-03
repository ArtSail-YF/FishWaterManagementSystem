// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types';
import { convertToProTable } from './utils/convert';

// ====== 类型定义 ======

export type AlertLevel = 'P0' | 'P1' | 'P2';

export interface AlertItem {
  key: string;
  level: AlertLevel;
  time: string;
  source: string;
  description: string;
  duration: string;
  status: 'pending' | 'resolved' | 'ignored';
}

export interface AlertSummaryData {
  unprocessed: number;
  newInHour: number;
  processedToday: number;
  avgResponseTime: string;
}

export interface RiskDistributionData {
  heatmap: { x: string[]; y: string[]; data: [number, number, number][] };
  composition: { name: string; value: number; color: string }[];
}

// ====== 告警规则管理（映射到 /iot/alert-rule）======

/** 获取告警规则列表 */
export async function getWarningRuleList(params: any, options?: { [key: string]: any }) {
  const response = await request('/iot/alert-rule/search', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取告警规则详情 */
export async function getWarningRuleDetail(id: number, options?: { [key: string]: any }) {
  return request<BaseResponse<any>>(`/iot/alert-rule/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建告警规则 */
export async function createWarningRule(body: any, options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/iot/alert-rule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新告警规则 */
export async function updateWarningRule(body: any, options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>(`/iot/alert-rule/${body.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除告警规则 */
export async function deleteWarningRule(id: number, options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>(`/iot/alert-rule/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// ====== 告警记录管理（映射到 /iot/alert）======

/** 获取告警记录列表 */
export async function getWarningRecordList(params: any, options?: { [key: string]: any }) {
  const response = await request('/iot/alert/search', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 处理告警记录 */
export async function handleWarningRecord(params: { id: number; handleNote?: string }, options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>(`/iot/alert/${params.id}/handle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: { handleNote: params.handleNote || '' },
    ...(options || {}),
  });
}

/** 批量处理告警记录 */
export async function batchHandleWarningRecord(body: { ids: number[]; handleNote?: string }, options?: { [key: string]: any }) {
  const results = await Promise.all(
    body.ids.map(id =>
      request<BaseResponse<boolean>>(`/iot/alert/${id}/handle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: { handleNote: body.handleNote || '' },
        ...(options || {}),
      })
    )
  );
  return { success: results.every(r => r.success) };
}

// ====== 综合预警统计 ======

/** 获取预警统计 */
export async function getWarningStats(options?: { [key: string]: any }): Promise<BaseResponse<any>> {
  return request<BaseResponse<any>>('/iot/alert/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取实时预警列表 */
export async function getRealTimeAlerts(options?: { [key: string]: any }): Promise<BaseResponse<any[]>> {
  return request<BaseResponse<any[]>>('/iot/alert/recent', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取预警历史记录 */
export async function getWarningHistory(options?: { [key: string]: any }): Promise<BaseResponse<any[]>> {
  return request<BaseResponse<any[]>>('/iot/alert/search', {
    method: 'GET',
    params: { page: 1, size: 100 },
    ...(options || {}),
  });
}

/** 处理预警 */
export async function processWarning(body: { id: number; handleNote?: string }, options?: { [key: string]: any }): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>(`/iot/alert/${body.id}/handle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: { handleNote: body.handleNote || '' },
    ...(options || {}),
  });
}

/** 获取风险分布数据 */
export async function getRiskDistribution(options?: { [key: string]: any }): Promise<BaseResponse<any>> {
  return request<BaseResponse<any>>('/iot/alert/stats', {
    method: 'GET',
    ...(options || {}),
  });
}
