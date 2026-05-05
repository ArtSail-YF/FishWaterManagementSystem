/**
 * 生产任务管理 API
 * 对应 prod_task 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

type TaskQueryParams = {
  current: number;
  pageSize: number;
  planId?: number;
  baseId?: number;
  targetType?: string;
  targetId?: number;
  status?: string;
  assigneeId?: number;
  actionTime?: string;
  [key: string]: any;
};

/** 分页及条件查询生产任务 GET /api/task/search */
export async function searchTasks(
  params: TaskQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/task/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取任务详情 GET /api/task/{id} */
export async function getTaskById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/task/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建生产任务 POST /api/task */
export async function createTask(
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新生产任务 PUT /api/task/{id} */
export async function updateTask(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除生产任务 DELETE /api/task/{id} */
export async function deleteTask(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 派发任务 POST /api/task/{id}/assign */
export async function assignTask(
  id: string | number,
  body: { assigneeId: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 开始执行任务 POST /api/task/{id}/start */
export async function startTask(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}/start`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 完成任务 POST /api/task/{id}/complete */
export async function completeTask(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}/complete`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 跳过任务 POST /api/task/{id}/skip */
export async function skipTask(
  id: string | number,
  body: { reason: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/task/${id}/skip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 获取塘口生产时间线 GET /api/task/timeline/{pondId} */
export async function getPondTimeline(
  pondId: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/task/timeline/${pondId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取计划统计数据 GET /api/task/stats */
export async function getPlanStats(
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/task/stats', {
    method: 'GET',
    ...(options || {}),
  });
}
