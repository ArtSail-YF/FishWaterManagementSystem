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
