/**
 * 养殖户管理 API
 * 对应 biz_breeder 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

type BreederQueryParams = {
  current: number;
  pageSize: number;
  breederCode?: string;
  breederName?: string;
  phone?: string;
  status?: number;
  [key: string]: any;
};

/** 分页及条件查询 GET /api/breeder/search */
export async function searchBreeders(params: BreederQueryParams) {
  const response = await request<BaseResponse<PageResult<any>>>('/breeder/search', {
    method: 'GET',
    params,
  });
  return convertToProTable(response);
}

/** 获取养殖户详情 GET /api/breeder/{id} */
export async function getBreederById(id: string | number) {
  return request<BaseResponse<any>>(`/breeder/${id}`, { method: 'GET' });
}

/** 新增养殖户 POST /api/breeder */
export async function createBreeder(body: any) {
  return request<BaseResponse<boolean>>('/breeder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新养殖户 PUT /api/breeder/{id} */
export async function updateBreeder(id: string | number, body: any) {
  return request<BaseResponse<boolean>>(`/breeder/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除养殖户 DELETE /api/breeder/{id} */
export async function deleteBreeder(id: string | number) {
  return request<BaseResponse<boolean>>(`/breeder/${id}`, { method: 'DELETE' });
}

/** 保存养殖户的塘口关联 POST /api/breeder/{id}/ponds */
export async function saveBreederPonds(id: string | number, pondIds: number[]) {
  return request<BaseResponse<boolean>>(`/breeder/${id}/ponds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { pondIds },
  });
}

/** 根据基地ID获取员工列表 GET /api/breeder/by-base/{baseId} */
export async function getEmployeesByBase(baseId: number) {
  try {
    const response = await request<BaseResponse<any[]>>(`/breeder/by-base/${baseId}`, {
      method: 'GET',
    });
    return (response?.data || []).map((emp: any) => ({
      label: emp.position ? `${emp.name}（${emp.position}）` : emp.name,
      value: emp.id,
    }));
  } catch {
    return [];
  }
}
