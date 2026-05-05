/**
 * 塘口管理API接口
 * 统一管理塘口信息的增删查改接口
 * 遵循后端RESTful API规范
 */

import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';

// ====== 参数类型定义 ======

type PondQueryParams = { 
  current: number; 
  pageSize: number; 
  keyword?: string; 
  pondName?: string; 
  baseId?: string;
  area?: number;
  depth?: number;
  waterQuality?: string;
  status?: number; 
  remark?: string;
  category?: string;
  categoryName?: string;
  type?: string;
  capacity?: number;
  tonnage?: number;
  material?: string;
  compartment?: string;
  videoStatus?: string;
  sensorCount?: number;
  [key: string]: any 
} & Record<string, any>;

// ====== 塘口管理API ======

/** 分页及条件查询 GET /api/pond/search */
export async function searchPonds(
  params: PondQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/pond/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取塘口列表 GET /api/pond/list (兼容旧版本) */
export async function getPondList(
  params: PondQueryParams,
  options?: { [key: string]: any },
) {
  return searchPonds(params, options);
}

/** 获取塘口列表带汇总信息 (兼容旧版本) */
export async function getPondListWithSummary(
  params: PondQueryParams,
  options?: { [key: string]: any },
) {
  return searchPonds(params, options);
}

/** 获取塘口列表（原始格式，用于仪表板等需要完整数据的场景） */
export async function getPondListRaw(
  params: PondQueryParams,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<PageResult<any>>>('/pond/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 根据ID查询单个实体 GET /api/pond/{id} */
export async function getPondById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/pond/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取塘口详情 GET /api/pond/detail (兼容旧版本) */
export async function getPondDetail(
  id: string | number,
  options?: { [key: string]: any },
) {
  return getPondById(id, options);
}

/** 获取塘口完整详情 (兼容旧版本) */
export async function getPondFullDetail(
  id: string | number,
  options?: { [key: string]: any },
) {
  return getPondById(id, options);
}

/** 新增实体 POST /api/pond */
export async function createPond(
  body: { pondName: string; baseId: string; area?: number; depth?: number; waterQuality?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID更新实体 PUT /api/pond/{id} */
export async function updatePond(
  id: string | number,
  body: { pondName?: string; baseId?: string; area?: number; depth?: number; waterQuality?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/pond/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID删除实体 DELETE /api/pond/{id} */
export async function deletePond(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/pond/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}