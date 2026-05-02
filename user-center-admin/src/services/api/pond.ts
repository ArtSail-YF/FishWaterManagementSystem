// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { PondInfoParams, PondInfoList, PondInfoDetail, BaseResponse, PondInfo } from '@/types';

/**
 * 塘口管理API接口
 * 遵循阿里Ant Design Pro规范
 */

// ====== 塘口管理 ======

/** 获取塘口列表 GET /api/pond/list */
export async function getPondList(
  params: PondInfoParams,
  options?: { [key: string]: any },
) {
  return request<PondInfoList>('/pond/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取塘口详情 GET /api/pond/detail */
export async function getPondDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<PondInfoDetail>('/pond/detail', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 创建塘口 POST /api/pond/create */
export async function createPond(
  body: Omit<PondInfo, 'id' | 'createTime' | 'updateTime' | 'isDeleted'>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/pond/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新塘口 PUT /api/pond/update */
export async function updatePond(
  body: Partial<PondInfo> & { id: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除塘口 DELETE /api/pond/delete */
export async function deletePond(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 启用/禁用塘口 POST /api/pond/toggle */
export async function togglePond(
  body: { id: string; status: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/toggle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 塘口统计 ======

/** 获取塘口统计 GET /api/pond/statistics */
export async function getPondStatistics(
  params: { baseId?: string; pondType?: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/pond/statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取塘口分布地图数据 GET /api/pond/map */
export async function getPondMapData(
  params: { baseId?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/pond/map', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// ====== 塘口扩展信息 ======

/** 获取塘口扩展信息 GET /api/pond/ext */
export async function getPondExtInfo(
  pondId: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/pond/ext', {
    method: 'GET',
    params: {
      pondId,
    },
    ...(options || {}),
  });
}

/** 更新塘口扩展信息 PUT /api/pond/ext */
export async function updatePondExtInfo(
  body: { pondId: string; extData: any },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/pond/ext', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 塘口综合查询 (Dashboard专用) ======

/** 获取塘口列表带汇总数据 GET /api/pond/list-with-summary */
export async function getPondListWithSummary(
  params: PondInfoParams,
  options?: { [key: string]: any },
): Promise<BaseResponse<{
  list: PondInfo[];
  summary: {
    total: number;
    breeding: number;
    empty: number;
    locked: number;
    totalArea: number;
    avgDepth: number;
  };
}>> {
  return request<BaseResponse<{
    list: PondInfo[];
    summary: {
      total: number;
      breeding: number;
      empty: number;
      locked: number;
      totalArea: number;
      avgDepth: number;
    };
  }>>('/pond/list-with-summary', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取塘口完整详情 GET /api/pond/full-detail */
export async function getPondFullDetail(
  pondId: string,
  options?: { [key: string]: any },
): Promise<BaseResponse<PondInfo & {
  extInfo?: any;
  waterQuality?: any;
  productionStats?: any;
  warningHistory?: any[];
}>> {
  return request<BaseResponse<PondInfo & {
    extInfo?: any;
    waterQuality?: any;
    productionStats?: any;
    warningHistory?: any[];
  }>>('/pond/full-detail', {
    method: 'GET',
    params: {
      pondId,
    },
    ...(options || {}),
  });
}