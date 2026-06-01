/**
 * 计划模板管理 API
 * 对应 prod_plan_template 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

/** 计划模板查询参数 */
export interface PlanTemplateQueryParams {
  current: number;
  pageSize: number;
  name?: string;
  planType?: string;
  [key: string]: any;
}

/** 计划模板实体 */
export interface PlanTemplateDTO {
  id: number | string;
  name: string;
  planType: string;
  content: string;
  creator?: string;
  createTime?: string;
  updateTime?: string;
}

/** 分页查询计划模板 GET /api/plan-template/search */
export async function searchPlanTemplates(
  params: PlanTemplateQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request('/plan-template/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 创建计划模板 POST /api/plan-template */
export async function createPlanTemplate(
  body: { name: string; planType: string; content: string },
  options?: { [key: string]: any },
) {
  return request('/plan-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新计划模板 PUT /api/plan-template/{id} */
export async function updatePlanTemplate(
  id: number | string,
  body: { name?: string; planType?: string; content?: string },
  options?: { [key: string]: any },
) {
  return request('/plan-template/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除计划模板 DELETE /api/plan-template/{id} */
export async function deletePlanTemplate(
  id: number | string,
  options?: { [key: string]: any },
) {
  return request('/plan-template/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}