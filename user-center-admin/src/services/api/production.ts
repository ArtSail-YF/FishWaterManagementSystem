// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type {
  ProductionPlanParams,
  ProductionPlanList,
  ProductionPlanDetail,
  BaseResponse,
  ProductionPlan,
  ProductionTaskParams,
  ProductionTaskList,
  ProductionTask
} from '@/types';

/**
 * 生产管理API接口
 * 遵循阿里Ant Design Pro规范
 */

// ====== 生产计划管理 ======

/** 获取生产计划列表 GET /api/production/plan/list */
export async function getProductionPlanList(
  params: ProductionPlanParams,
  options?: { [key: string]: any },
) {
  return request<ProductionPlanList>('/production/plan/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取生产计划详情 GET /api/production/plan/detail */
export async function getProductionPlanDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<ProductionPlanDetail>('/production/plan/detail', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 创建生产计划 POST /api/production/plan/create */
export async function createProductionPlan(
  body: Omit<ProductionPlan, 'id' | 'createTime' | 'updateTime' | 'isDeleted'>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/production/plan/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新生产计划 PUT /api/production/plan/update */
export async function updateProductionPlan(
  body: Partial<ProductionPlan> & { id: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/production/plan/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除生产计划 DELETE /api/production/plan/delete */
export async function deleteProductionPlan(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/production/plan/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 审批生产计划 POST /api/production/plan/approve */
export async function approveProductionPlan(
  body: { id: string; approvalStatus: number; approverId: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/production/plan/approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 生产任务管理 ======

/** 获取生产任务列表 GET /api/production/task/list */
export async function getProductionTaskList(
  params: ProductionTaskParams,
  options?: { [key: string]: any },
) {
  return request<ProductionTaskList>('/production/task/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 执行生产任务 POST /api/production/task/execute */
export async function executeProductionTask(
  body: { id: string; executorId: string; actualTime?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/production/task/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量创建生产任务 POST /api/production/task/batch */
export async function batchCreateProductionTask(
  body: {
    planId: string;
    tasks: Array<Omit<ProductionTask, 'id' | 'createTime' | 'updateTime'>>;
  },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/production/task/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 生产统计 ======

/** 获取生产统计 GET /api/production/statistics */
export async function getProductionStatistics(
  params: { startTime?: string; endTime?: string; baseId?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/production/statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}