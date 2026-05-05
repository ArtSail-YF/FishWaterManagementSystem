/**
 * 生产计划管理 API
 * 对应 prod_plan 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

type PlanQueryParams = {
  current: number;
  pageSize: number;
  baseId?: number;
  planType?: string;
  targetType?: string;
  targetId?: number;
  status?: string;
  ownerId?: number;
  keyword?: string;
  startTime?: string;
  endTime?: string;
  [key: string]: any;
};

/** 分页及条件查询生产计划 GET /api/plan/search */
export async function searchPlans(
  params: PlanQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/plan/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取计划详情 GET /api/plan/{id} */
export async function getPlanById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/plan/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建生产计划 POST /api/plan */
export async function createPlan(
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新生产计划 PUT /api/plan/{id} */
export async function updatePlan(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除生产计划 DELETE /api/plan/{id} */
export async function deletePlan(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/plan/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 发布计划 POST /api/plan/{id}/publish */
export async function publishPlan(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/plan/${id}/publish`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 取消计划 POST /api/plan/{id}/cancel */
export async function cancelPlan(
  id: string | number,
  body?: { reason?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/plan/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}
