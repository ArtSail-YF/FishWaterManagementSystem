import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export async function searchHarvestRecords(params: any) {
  const response = await request('/harvest-record/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function getHarvestRecord(id: number) {
  return request('/harvest-record/' + id, { method: 'GET' });
}

export async function createHarvestRecord(body: any) {
  return request('/harvest-record', { method: 'POST', data: body });
}

export async function updateHarvestRecord(id: number, body: any) {
  return request('/harvest-record/' + id, { method: 'PUT', data: body });
}

export async function deleteHarvestRecord(id: number) {
  return request('/harvest-record/' + id, { method: 'DELETE' });
}