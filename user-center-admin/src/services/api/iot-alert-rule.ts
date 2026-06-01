import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';

export async function searchAlertRules(params: any) {
  const response = await request('/iot/alert-rule/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function createAlertRule(body: any) {
  return request('/iot/alert-rule', { method: 'POST', data: body });
}

export async function updateAlertRule(id: number, body: any) {
  return request(`/iot/alert-rule/${id}`, { method: 'PUT', data: body });
}

export async function deleteAlertRule(id: number) {
  return request(`/iot/alert-rule/${id}`, { method: 'DELETE' });
}
