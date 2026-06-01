import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export async function searchTsData(params: any) {
  const response = await request('/iot/ts-data/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function createTsData(body: any) {
  return request('/iot/ts-data', { method: 'POST', data: body });
}

export async function deleteTsData(id: number) {
  return request(`/iot/ts-data/${id}`, { method: 'DELETE' });
}
