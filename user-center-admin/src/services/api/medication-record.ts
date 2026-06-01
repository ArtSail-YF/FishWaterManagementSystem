import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export async function searchMedicationRecords(params: any) {
  const response = await request('/medication-record/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function getMedicationRecord(id: number) {
  return request('/medication-record/' + id, { method: 'GET' });
}

export async function createMedicationRecord(body: any) {
  return request('/medication-record', { method: 'POST', data: body });
}

export async function updateMedicationRecord(id: number, body: any) {
  return request('/medication-record/' + id, { method: 'PUT', data: body });
}

export async function deleteMedicationRecord(id: number) {
  return request('/medication-record/' + id, { method: 'DELETE' });
}
