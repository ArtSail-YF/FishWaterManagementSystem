import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export async function searchAlerts(params: any) {
  const response = await request('/iot/alert/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function getAlertById(id: number) {
  return request(`/iot/alert/${id}`, { method: 'GET' });
}

export async function handleAlert(id: number, body: { handleNote?: string }) {
  return request(`/iot/alert/${id}/handle`, { method: 'PUT', data: body });
}

export async function deleteAlert(id: number) {
  return request(`/iot/alert/${id}`, { method: 'DELETE' });
}

/** 水质告警记录 */
export interface WaterAlarmLog {
  id: string;
  time: string;
  level: string;
  content: string;
}

/** 获取水质告警列表（用于综合监测看板） */
export async function getWaterAlarmList(params?: {
  pondId?: string;
  alarmStatus?: string;
  startTime?: string;
  endTime?: string;
}, options?: { [key: string]: any }): Promise<BaseResponse<WaterAlarmLog[]>> {
  try {
    const res = await request('/iot/alert/recent', {
      method: 'GET',
      ...(options || {}),
    });
    const alerts: any[] = res?.data || [];
    const list: WaterAlarmLog[] = alerts.map((a: any) => ({
      id: String(a.id),
      time: a.triggerTime || '',
      level: a.severity || 'LOW',
      content: a.title || a.content || '',
    }));
    return { code: 200, message: 'success', data: list };
  } catch (e) {
    console.error('获取告警列表失败', e);
    return { code: 500, message: 'failed', data: [] };
  }
}
