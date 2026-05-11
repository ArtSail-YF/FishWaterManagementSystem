/**
 * 物资使用记录 API 服务
 * 对应 /production/input 接口
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export interface StkUsageQuery {
  baseId?: number;
  pondId?: number;
  taskId?: number;
  matId?: number;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}

export interface StkUsageDTO {
  id: number;
  usageNo: string;
  baseId: number;
  pondId: number;
  taskId?: number;
  matId: number;
  useQty: number;
  unitPrice: number;
  totalPrice: number;
  operatorId: number;
  useTime: string;
  remark?: string;
  matName?: string;
  categoryName?: string;
  spec?: string;
  unit?: string;
  pondName?: string;
  pondCode?: string;
  operatorName?: string;
}

/**
 * 分页查询物资使用记录
 */
export async function searchUsageRecords(params: StkUsageQuery) {
  const response = await request<BaseResponse<PageResult<StkUsageDTO>>>('/production/input/search', {
    method: 'GET',
    params,
  });
  return convertToProTable(response);
}

/**
 * 获取物资使用记录详情
 */
export async function getUsageRecordById(id: string | number) {
  return request<BaseResponse<StkUsageDTO>>(`/production/input/${id}`, {
    method: 'GET',
  });
}

/**
 * 创建物资使用记录
 */
export async function createUsageRecord(data: Partial<StkUsageDTO>) {
  return request<BaseResponse<boolean>>('/production/input', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  });
}

/**
 * 更新物资使用记录
 */
export async function updateUsageRecord(id: string | number, data: Partial<StkUsageDTO>) {
  return request<BaseResponse<boolean>>(`/production/input/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data,
  });
}

/**
 * 删除物资使用记录
 */
export async function deleteUsageRecord(id: string | number) {
  return request<BaseResponse<boolean>>(`/production/input/${id}`, {
    method: 'DELETE',
  });
}
