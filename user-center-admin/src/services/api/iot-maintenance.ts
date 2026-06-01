import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';

export async function searchMaintenance(params: any) {
  const response = await request('/iot/maintenance/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function createMaintenance(body: any) {
  return request('/iot/maintenance', { method: 'POST', data: body });
}

export async function deleteMaintenance(id: number) {
  return request(`/iot/maintenance/${id}`, { method: 'DELETE' });
}
