/**
 * 库存投入品记录 API 服务
 * 对应 /stock/record 接口
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export interface StkRecordQuery {
  baseId?: number;
  matId?: number;
  type?: string;
  recordNo?: string;
  batchNo?: string;
  operatorId?: number;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

export interface StkRecordDTO {
  id: number;
  recordNo: string;
  baseId: number;
  matId: number;
  batchNo?: string;
  type: string;
  changeQty: number;
  operatorId?: number;
  remark?: string;
  createTime: string;
}

/** 分页及条件查询库存流水记录 GET /api/stock/record/search */
export async function searchStockRecords(params: StkRecordQuery) {
  const response = await request<BaseResponse<PageResult<StkRecordDTO>>>('/stock/record/search', {
    method: 'GET',
    params,
  });
  return convertToProTable(response);
}

/** 获取库存记录详情 GET /api/stock/record/{id} */
export async function getStockRecordById(id: string | number) {
  return request<BaseResponse<StkRecordDTO>>(`/stock/record/${id}`, {
    method: 'GET',
  });
}

/** 创建库存记录 POST /api/stock/record */
export async function createStockRecord(body: Omit<StkRecordDTO, 'id' | 'createTime'>) {
  return request<BaseResponse<boolean>>('/stock/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新库存记录 PUT /api/stock/record/{id} */
export async function updateStockRecord(id: string | number, body: Partial<StkRecordDTO>) {
  return request<BaseResponse<boolean>>(`/stock/record/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除库存记录 DELETE /api/stock/record/{id} */
export async function deleteStockRecord(id: string | number) {
  return request<BaseResponse<boolean>>(`/stock/record/${id}`, {
    method: 'DELETE',
  });
}

/** 批量删除库存记录 DELETE /api/stock/record/batch */
export async function batchDeleteStockRecords(ids: (string | number)[]) {
  return request<BaseResponse<boolean>>('/stock/record/batch', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    data: ids,
  });
}
