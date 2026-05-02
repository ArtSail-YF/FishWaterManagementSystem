/**
 * 投入记录相关API服务
 * 封装 API 调用 + 类型转换
 */

import { request } from '@umijs/max';
import type { BaseResponse, InputRecordItem } from '@/types';

/**
 * 获取投入记录列表
 * GET /input/records
 */
export async function getInputRecords(
  options?: { [key: string]: any },
): Promise<BaseResponse<InputRecordItem[]>> {
  return request<BaseResponse<InputRecordItem[]>>('/input/records', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 删除投入记录
 * DELETE /input/record/delete
 */
export async function deleteInputRecord(
  params: { id: string },
  options?: { [key: string]: any },
): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>('/input/record/delete', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/**
 * 创建投入记录
 * POST /input/record/create
 */
export async function createInputRecord(
  body: Omit<InputRecordItem, 'id' | 'createTime' | 'updateTime'>,
  options?: { [key: string]: any },
): Promise<BaseResponse<string>> {
  return request<BaseResponse<string>>('/input/record/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/**
 * 更新投入记录
 * PUT /input/record/update
 */
export async function updateInputRecord(
  body: Partial<InputRecordItem> & { id: string },
  options?: { [key: string]: any },
): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>('/input/record/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/**
 * 批量删除投入记录
 * POST /input/record/batch-delete
 */
export async function batchDeleteInputRecords(
  body: { ids: string[] },
  options?: { [key: string]: any },
): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>('/input/record/batch-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/**
 * 审核投入记录
 * POST /input/record/approve
 */
export async function approveInputRecord(
  body: { id: string; status: 'approved' | 'rejected'; approver: string; notes?: string },
  options?: { [key: string]: any },
): Promise<BaseResponse<boolean>> {
  return request<BaseResponse<boolean>>('/input/record/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

export type { InputRecordItem };
