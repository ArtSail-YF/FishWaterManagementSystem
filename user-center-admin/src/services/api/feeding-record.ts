import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export async function searchFeedingRecords(params: any) {
  const response = await request('/feeding-record/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function getFeedingRecord(id: number) {
  return request('/feeding-record/' + id, { method: 'GET' });
}

export async function createFeedingRecord(body: any) {
  return request('/feeding-record', { method: 'POST', data: body });
}

export async function updateFeedingRecord(id: number, body: any) {
  return request('/feeding-record/' + id, { method: 'PUT', data: body });
}

export async function deleteFeedingRecord(id: number) {
  return request('/feeding-record/' + id, { method: 'DELETE' });
}
