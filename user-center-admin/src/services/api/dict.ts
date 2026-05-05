// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { convertToProTable } from '@/services/api/utils/convert';
import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';
import type { SysDictType, SysDictData } from '@/types/model';

/**
 * 字典管理API接口
 * 统一管理字典类型和字典数据的增删改查接口
 * 遵循阿里Ant Design Pro规范
 */

// ====== 参数类型定义 ======

type DictTypeQueryParams = { current: number; pageSize: number; keyword?: string; dictType?: string; dictName?: string; status?: number; [key: string]: any } & Record<string, any>;

type DictDataQueryParams = { current: number; pageSize: number; keyword?: string; dictType?: string; dictLabel?: string; dictValue?: string; status?: number; [key: string]: any } & Record<string, any>;

// ====== 下拉选项类型定义 ======

type DropdownOption = {
  label: string;
  value: string;
};

type DictDropdownOptions = {
  [dictType: string]: DropdownOption[];
};

// ====== 字典类型API ======

/** 获取字典类型列表 GET /api/system/dict/type/list */
export async function getSysDictTypeList(
  params: DictTypeQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<SysDictType>>>('/system/dict/type/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}



/** 获取字典类型详情 GET /api/system/dict/type/detail */
export async function getSysDictTypeDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<SysDictType>>('/system/dict/type/detail', {
    method: 'GET',
    params: {
      id,
    },  
    ...(options || {}),
  });
}

/** 创建字典类型 POST /api/system/dict/type/create */
export async function createSysDictType(
  body: { dictType: string; dictName: string; status: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/system/dict/type/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新字典类型 PUT /api/system/dict/type/update */
export async function updateSysDictType(
  body: { id: string; dictType?: string; dictName?: string; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/type/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除字典类型 DELETE /api/system/dict/type/delete */
export async function deleteSysDictType(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/type/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 启用/禁用字典类型 POST /api/system/dict/type/toggle */
export async function toggleSysDictType(
  body: { id: string; status: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/type/toggle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 字典数据API ======

/** 获取字典数据列表 GET /api/system/dict/data/list */
export async function getSysDictDataList(
  params: DictDataQueryParams,
  options?: { [key: string]: any },
) {
  const response = await request<BaseResponse<PageResult<SysDictData>>>('/system/dict/data/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  return convertToProTable(response);
}

/** 获取字典数据详情 GET /api/system/dict/data/detail */
export async function getSysDictDataDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<SysDictData>>('/system/dict/data/detail', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 创建字典数据 POST /api/system/dict/data/create */
export async function createSysDictData(
   options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/system/dict/data/create', {
    method: 'POST',

    ...(options || {}),
  });
}


/** 搜索用户列表 GET /api/user/search */
export async function searchUsers(options?: { [key: string]: any }) {

 return request<API.BaseResponse<API.CurrentUser[]>>('/user/search', {
    method: 'GET',
    ...(options || {}),
  });

}

/** 更新字典数据 PUT /api/system/dict/data/update */
export async function updateSysDictData(
  body: { id: string; dictType?: string; dictLabel?: string; dictValue?: string; sortOrder?: number; status?: number; remark?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/data/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除字典数据 DELETE /api/system/dict/data/delete */
export async function deleteSysDictData(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/data/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 启用/禁用字典数据 POST /api/system/dict/data/toggle */
export async function toggleSysDictData(
  body: { id: string; status: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/system/dict/data/toggle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据字典类型获取字典数据 GET /api/system/dict/data/by-type */
export async function getDictDataByType(
  dictType: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<SysDictData[]>>('/system/dict/data/by-type', {
    method: 'GET',
    params: {
      dictType,
    },
    ...(options || {}),
  });
}

// ====== 字典下拉选项API ======

/** 获取所有字典类型的下拉选项 GET /api/system/dict/data/dropdown/options */
export async function getDictDropdownOptions(
  options?: { [key: string]: any },
) {
  return request<BaseResponse<DictDropdownOptions>>('/system/dict/data/dropdown/options', {
    method: 'GET',
    ...(options || {}),
  });
}