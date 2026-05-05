/**
 * 生产日志管理 API
 * 对应 prod_log 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

type LogQueryParams = {
  current: number;
  pageSize: number;
  taskId?: number;
  planId?: number;
  baseId?: number;
  targetType?: string;
  targetId?: number;
  logType?: string;
  source?: string;
  verifyStatus?: string;
  actionTimeStart?: string;
  actionTimeEnd?: string;
  [key: string]: any;
};

/** 分页及条件查询生产日志 GET /api/log/search */
export async function searchLogs(
  params: LogQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/log/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取日志详情 GET /api/log/{id} */
export async function getLogById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/log/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建生产日志 POST /api/log */
export async function createLog(
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新生产日志 PUT /api/log/{id} */
export async function updateLog(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/log/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除生产日志 DELETE /api/log/{id} */
export async function deleteLog(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/log/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 审核日志 POST /api/log/{id}/verify */
export async function verifyLog(
  id: string | number,
  body: { verifyStatus: string; reason?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/log/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/**
 * 兼容旧接口：统一生产日志查询
 * GET /api/log/search
 * @deprecated 请使用 searchLogs 代替
 */
export async function getProductionLogs(params?: any, options?: any) {
  return request<BaseResponse<any>>('/log/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
