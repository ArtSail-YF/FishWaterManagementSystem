/**
 * 物资分类管理 API
 * 对应 mat_category 表
 */

import { request } from '@umijs/max';
import { convertToProTable } from '../utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';

export type MatCategory = {
  id?: number;
  catName: string;
  catCode?: string;
  parentId?: number;
  sortOrder?: number;
  status?: number;
  isDelete?: number;
  deleteTime?: string;
};

type CategoryQueryParams = {
  current: number;
  pageSize: number;
  catName?: string;
  catType?: string;
  status?: number;
  [key: string]: any;
};

/** 分页查询物资分类 GET /material/category/search */
export async function searchCategories(
  params: CategoryQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<MatCategory>>>('/material/category/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取所有分类列表（不分页）GET /material/category/search */
export async function getCategoryList(
  params?: { catType?: string; status?: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<MatCategory[]>>('/material/category/search', {
    method: 'GET',
    params: { ...params, pageSize: 9999 },
    ...(options || {}),
  });
}

/** 获取分类详情 GET /material/category/{id} */
export async function getCategoryById(
  id: number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<MatCategory>>(`/material/category/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建物资分类 POST /material/category */
export async function createCategory(
  body: Omit<MatCategory, 'id' | 'createTime' | 'updateTime'>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/material/category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新物资分类 PUT /material/category/{id} */
export async function updateCategory(
  id: number,
  body: Partial<MatCategory>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/material/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除物资分类 DELETE /material/category/{id} */
export async function deleteCategory(
  id: number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/material/category/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
