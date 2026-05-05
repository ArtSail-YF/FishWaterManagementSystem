/**
 * 网箱管理API接口
 * 统一管理网箱信息的增删查改接口
 * 遵循后端RESTful API规范
 */

import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';

// ====== 参数类型定义 ======

type CageQueryParams = { 
  current: number; 
  pageSize: number; 
  keyword?: string; 
  cageName?: string; 
  baseId?: string;
  capacity?: number;
  material?: string;
  status?: number; 
  remark?: string;
  category?: string;
  categoryName?: string;
  type?: string;
  videoStatus?: string;
  sensorCount?: number;
  [key: string]: any 
} & Record<string, any>;

// ====== 网箱管理API ======

/** 分页及条件查询 GET /api/cage/search */
export async function searchCages(
  params: CageQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/cage/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取网箱列表 GET /api/cage/list (兼容旧版本) */
export async function getCageList(
  params: CageQueryParams,
  options?: { [key: string]: any },
) {
  return searchCages(params, options);
}

/** 根据ID查询单个实体 GET /api/cage/{id} */
export async function getCageById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/cage/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增网箱 POST /api/cage */
export async function createCage(
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/cage', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 根据ID更新网箱 PUT /api/cage/{id} */
export async function updateCage(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/cage/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 根据ID删除网箱 DELETE /api/cage/{id} */
export async function deleteCage(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/cage/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取网箱详情 GET /api/cage/detail (兼容旧版本) */
export async function getCageDetail(
  id: string | number,
  options?: { [key: string]: any },
) {
  return getCageById(id, options);
}

/** 获取网箱列表带汇总信息 (兼容旧版本) */
export async function getCageListWithSummary(
  params: CageQueryParams,
  options?: { [key: string]: any },
) {
  return searchCages(params, options);
}