/**
 * 投入记录相关API服务
 * 封装 API 调用 + 类型转换
 */

import { request } from '@umijs/max';
import type {
  InputRecordListResponse,
  InputRecordOperationResponse,
} from '@/types/api';
import type { InputRecord } from '@/models/input';

/**
 * 获取投入记录列表
 * GET /api/input/records
 */
export async function getInputRecords(options?: any) {
  const response = await request<InputRecordListResponse>('/api/input/records', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 删除投入记录
 * DELETE /api/input/records/:id
 */
export async function deleteInputRecord(id: string) {
  return request<InputRecordOperationResponse>(`/api/input/records/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 创建投入记录
 * POST /api/input/records
 */
export async function createInputRecord(data: Partial<InputRecord>) {
  return request<InputRecordOperationResponse>('/api/input/records', {
    method: 'POST',
    data,
  });
}

/**
 * 更新投入记录
 * PUT /api/input/records/:id
 */
export async function updateInputRecord(id: string, data: Partial<InputRecord>) {
  return request<InputRecordOperationResponse>(`/api/input/records/${id}`, {
    method: 'PUT',
    data,
  });
}
