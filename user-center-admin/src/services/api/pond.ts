/**
 * 塘口管理API接口
 */

import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

/** 获取塘口下拉选项 - 根据基地ID筛选 */
export async function getPondOptions(
  baseId?: number,
  options?: { [key: string]: any },
) {
  try {
    const queryParams: any = { current: 1, pageSize: 1000 };
    if (baseId) queryParams.baseId = baseId;

    const response = await request<BaseResponse<PageResult<any>>>('/pond/search', {
      method: 'GET',
      params: queryParams,
      ...(options || {}),
    });

    return (response.data?.records || []).map((pond: any) => ({
      label: pond.pondName || pond.name || '塘口' + pond.id,
      value: pond.id,
      key: pond.id,
      data: pond,
    }));
  } catch (error) {
    console.error('获取塘口选项失败:', error);
    return [];
  }
}

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
  [key: string]: any;
};

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

/** 根据ID查询塘口 GET /api/pond/{id} */
export async function getPondById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/pond/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增塘口 POST /api/pond */
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

/** 更新塘口 PUT /api/pond/{id} */
export async function updatePond(
  id: string | number,
  body: { pondName?: string; baseId?: string; area?: number; depth?: number; waterQuality?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除塘口 DELETE /api/pond/{id} */
export async function deletePond(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取塘口列表（原始响应格式，用于仪表板等需要完整数据的场景） GET /api/pond/search */
export async function getPondListRaw(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/pond/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
