/**
 * 生产计划管理 API
 * 对应 prod_plan 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type {
  BaseResponse,
  PageResult,
} from '@/types/api';
import type {
  PlanDTO,
  PlanQueryParams,
  CreatePlanRequest,
  UpdatePlanRequest,
  CancelPlanRequest,
  PlanStatsDTO,
  SubmitApprovalRequest,
  ApprovalActionRequest,
  ApprovalRecord,
} from '@/types/api/plan';

/** 分页及条件查询生产计划 GET /api/plan/search */
export async function searchPlans(params: PlanQueryParams) {
  const response = await request<BaseResponse<PageResult<PlanDTO>>>('/plan/search', {
    method: 'GET',
    params,
  });
  return convertToProTable(response);
}

/** 获取计划详情 GET /api/plan/{id} */
export async function getPlanById(id: string | number) {
  return request<BaseResponse<PlanDTO>>(`/plan/${id}`, {
    method: 'GET',
  });
}

/** 创建生产计划 POST /api/plan */
export async function createPlan(body: CreatePlanRequest) {
  return request<BaseResponse<boolean>>('/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新生产计划 PUT /api/plan/{id} */
export async function updatePlan(id: string | number, body: UpdatePlanRequest) {
  return request<BaseResponse<boolean>>(`/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除生产计划 DELETE /api/plan/{id} */
export async function deletePlan(id: string | number) {
  return request<BaseResponse<boolean>>(`/plan/${id}`, {
    method: 'DELETE',
  });
}

/** 发布计划 POST /api/plan/{id}/publish */
export async function publishPlan(id: string | number, body?: any) {
  return request<BaseResponse<boolean>>(`/plan/${id}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 取消计划 POST /api/plan/{id}/cancel */
export async function cancelPlan(id: string | number, body?: CancelPlanRequest) {
  return request<BaseResponse<boolean>>(`/plan/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 完成计划 POST /api/plan/{id}/complete */
export async function completePlan(id: string | number) {
  return request<BaseResponse<boolean>>(`/plan/${id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

/** 根据基地ID获取计划列表 GET /api/plan/by-base/{baseId} */
export async function getPlansByBase(baseId: string | number) {
  return request<BaseResponse<PlanDTO[]>>(`/plan/by-base/${baseId}`, {
    method: 'GET',
  });
}

/** 获取计划统计 GET /api/plan/stats */
export async function getPlanStats() {
  return request<BaseResponse<PlanStatsDTO>>('/plan/stats', {
    method: 'GET',
  });
}

/** 批量发布计划 POST /api/plan/batch-publish */
export async function batchPublishPlans(ids: (string | number)[]) {
  return request<BaseResponse<boolean>>('/plan/batch-publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { ids },
  });
}

/** 获取计划类型的默认任务模板 GET /api/plan/{planType}/task-templates */
export async function getTaskTemplates(planType: string, startTime?: string, endTime?: string) {
  return request<BaseResponse<any[]>>(`/plan/${planType}/task-templates`, {
    method: 'GET',
    params: { startTime, endTime },
  });
}

// ====== 审批相关 API ======

/** 提交审批 POST /api/plan/{id}/submit-approval */
export async function submitForApproval(id: string | number, body?: SubmitApprovalRequest) {
  return request<BaseResponse<void>>(`/plan/${id}/submit-approval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 审批通过 POST /api/plan/{id}/approve */
export async function approvePlan(id: string | number, body?: ApprovalActionRequest) {
  return request<BaseResponse<void>>(`/plan/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 审批驳回 POST /api/plan/{id}/reject */
export async function rejectPlan(id: string | number, body?: ApprovalActionRequest) {
  return request<BaseResponse<void>>(`/plan/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 获取审批记录 GET /api/plan/{id}/approval-records */
export async function getApprovalRecords(id: string | number) {
  return request<BaseResponse<ApprovalRecord[]>>(`/plan/${id}/approval-records`, {
    method: 'GET',
  });
}
