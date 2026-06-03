/**
 * 工船管理API接口
 * 统一管理工船信息的增删查改接口
 * 遵循后端RESTful API规范
 */

import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';

// ====== 参数类型定义 ======

type VslQueryParams = { 
  current: number; 
  pageSize: number; 
  keyword?: string; 
  vslName?: string; 
  baseId?: string;
  tonnage?: number;
  compartment?: string;
  shipNumber?: string;
  status?: number; 
  remark?: string;
  category?: string;
  categoryName?: string;
  type?: string;
  videoStatus?: string;
  sensorCount?: number;
  [key: string]: any 
} & Record<string, any>;

// ====== 工船管理API ======

/** 分页及条件查询 GET /api/vsl/search */
export async function searchVsles(
  params: VslQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/vsl/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}


/** 根据ID查询单个实体 GET /api/vsl/{id} */
export async function getVslById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/vsl/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增工船 POST /api/vsl */
export async function createVsl(
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/vsl', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 根据ID更新工船 PUT /api/vsl/{id} */
export async function updateVsl(
  id: string | number,
  body: any,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/vsl/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 根据ID删除工船 DELETE /api/vsl/{id} */
export async function deleteVsl(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/vsl/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}


