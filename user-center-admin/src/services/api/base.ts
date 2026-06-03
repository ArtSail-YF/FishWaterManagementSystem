/**
 * 基地管理API接口
 * 统一管理基地信息的增删查改接口
 * 遵循后端RESTful API规范
 */

import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import { transformBaseResponse } from './utils';
import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';
import type { Base } from '@/models/base';

// 这些辅助函数已移动到 utils/baseConverter.ts 中

// ====== 参数类型定义 ======

type BaseQueryParams = { 
  current: number; 
  pageSize: number; 
  baseCode?: string; 
  baseName?: string; 
  address?: string;
  breederId?: number;
  deptId?: number;
  status?: number; 
  [key: string]: any 
} & Record<string, any>;

// ====== 基地管理API ======

/** 分页及条件查询 GET /api/base/search */
export async function searchBases(
  params: BaseQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<any>>>('/base/search', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取基地列表 GET /api/base/list (兼容旧版本) */
export async function getBaseList(
  params?: BaseQueryParams,
  options?: { [key: string]: any },
) {
  // 设置默认参数
  const queryParams = {
    current: 1,
    pageSize: 100,
    ...params,
  };
 
  const response = await request<BaseResponse<PageResult<any>>>('/base/search', {
    method: 'GET',
    params: queryParams,
    ...(options || {}),
  });
  
  // 使用转换函数处理完整的响应转换
  return transformBaseResponse(response);
}

/** 获取基地下拉选项 - 专门用于选择框 */
export async function getBaseOptions(
  params?: BaseQueryParams,
  options?: { [key: string]: any },
) {
  try {
    // 设置默认参数
    const queryParams = {
      current: 1,
      pageSize: 1000, // 获取更多数据，确保覆盖所有基地
      ...params,
    };
    
    // 直接调用API获取基地数据
    const response = await request<BaseResponse<PageResult<any>>>('/base/search', {
      method: 'GET',
      params: queryParams,
      ...(options || {}),
    });
    
    // 提取基地数据 - 根据后端返回的数据结构
    // 后端返回格式: {code, message, data: {records: [...], total, size, current, pages}}
    const records = response.data?.records || [];
    
    // 打印调试信息
    console.log('getBaseOptions - response.data:', response.data);
    console.log('getBaseOptions - records:', records);
    
    // 转换为下拉选项格式
    return records.map(base => ({
      label: base.baseName || base.name || '未命名基地',
      value: base.id,
      key: base.id,
      data: base, // 保留完整数据供需要时使用
    }));
  } catch (error) {
    console.error('获取基地选项失败:', error);
    return [];
  }
}





/** 根据ID查询单个实体 GET /api/base/{id} */
export async function getBaseById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/base/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 新增实体 POST /api/base */
export async function createBase(
  body: { baseName: string; address: string; contactPerson?: string; phone?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/base', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID更新实体 PUT /api/base/{id} */
export async function updateBase(
  id: string | number,
  body: { baseName?: string; address?: string; contactPerson?: string; phone?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/base/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID删除实体 DELETE /api/base/{id} */
export async function deleteBase(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>(`/base/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
