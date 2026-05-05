/**
 * 物资信息管理 API
 * 对应 mat_info 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export type MatInfo = {
  id?: number;
  matName: string;
  matCode?: string;
  catId?: number;
  spec?: string;
  unit?: string;
  supplierId?: number;
  minStock?: number;
  maxStock?: number;
  status?: number;
  withdrawalDays?: number;
  unitPrice?: number;
  approvalCode?: string;
  manufacturer?: string;
  isDelete?: number;
  deleteTime?: string;
  createTime?: string;
  updateTime?: string;
};

type MatInfoQueryParams = {
  current: number;
  pageSize: number;
  matName?: string;
  matCode?: string;
  catId?: number;
  catType?: string;
  supplierId?: number;
  status?: number;
  [key: string]: any;
};

/** 分页查询物资信息 GET /material/info/search */
export async function searchMaterials(
  params: MatInfoQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<MatInfo>>>('/material/info/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取物资详情 GET /material/info/{id} */
export async function getMaterialById(
  id: number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<MatInfo>>(`/material/info/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建物资信息 POST /material/info */
export async function createMaterial(
  body: Omit<MatInfo, 'id' | 'deleteTime'>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/material/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新物资信息 PUT /material/info/{id} */
export async function updateMaterial(
  id: number,
  body: Partial<MatInfo>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/material/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除物资信息 DELETE /material/info/{id} */
export async function deleteMaterial(
  id: number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/material/info/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
