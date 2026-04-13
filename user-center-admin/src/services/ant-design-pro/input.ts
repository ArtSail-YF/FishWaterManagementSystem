import { request } from '@umijs/max';

export interface InputRecordItem {
  id: string;
  date: string;
  name: string;
  category: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other';
  type: 'in' | 'out';
  specification: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  pondName?: string;
  operator: string;
  supplier?: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * 获取投入记录列表
 * GET /api/input/records
 */
export async function getInputRecords(options?: any) {
  return request<API.BaseResponse<InputRecordItem[]>>('/api/input/records', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 删除投入记录
 * DELETE /api/input/records/:id
 */
export async function deleteInputRecord(id: string) {
  return request<API.BaseResponse<boolean>>(`/api/input/records/${id}`, {
    method: 'DELETE',
  });
}
