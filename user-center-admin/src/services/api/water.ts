// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type {
  WaterQualityParams,
  WaterQualityList,
  BaseResponse,
  WaterQuality
} from '@/types';
import type { PondWaterLog } from '@/models/water';

/**
 * 水质监测API接口
 * 遵循阿里Ant Design Pro规范
 */

// ====== 水质实时监测 ======

/** 获取水质实时监测列表 GET /api/water/quality/list */
export async function getWaterQualityList(
  params: WaterQualityParams,
  options?: { [key: string]: any },
  
) {
  return request<WaterQualityList>('/water/quality/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取水质实时监测详情 GET /api/water/quality/detail */
export async function getWaterQualityDetail(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<WaterQuality>>('/water/quality/detail', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

/** 创建水质监测记录 POST /api/water/quality/create */
export async function createWaterQuality(
  body: Omit<WaterQuality, 'id' | 'createTime' | 'updateTime'>,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<string>>('/water/quality/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新水质监测记录 PUT /api/water/quality/update */
export async function updateWaterQuality(
  body: Partial<WaterQuality> & { id: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/water/quality/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除水质监测记录 DELETE /api/water/quality/delete */
export async function deleteWaterQuality(
  id: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/water/quality/delete', {
    method: 'DELETE',
    params: {
      id,
    },
    ...(options || {}),
  });
}

// ====== 水质历史数据 ======

/** 获取水质历史数据 GET /api/water/history */
export async function getWaterHistory(
  params: {
    pondId: string;
    startTime: string;
    endTime: string;
    dataType?: string; // 数据类型：ph,do,temperature等
  },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/water/history', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量导入水质数据 POST /api/water/import */
export async function importWaterData(
  body: {
    pondId: string;
    data: Array<Omit<WaterQuality, 'id' | 'createTime' | 'updateTime'>>;
  },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/water/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 水质统计 ======

/** 获取水质统计 GET /api/water/statistics */
export async function getWaterStatistics(
  params: { pondId?: string; startTime?: string; endTime?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/water/statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取水质趋势分析 GET /api/water/trend */
export async function getWaterTrend(
  params: { pondId: string; dataType: string; days: number },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/water/trend', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// ====== 水质报警 ======

/** 获取水质报警列表 GET /api/water/alarm */
export async function getWaterAlarmList(
  params: { pondId?: string; alarmStatus?: string; startTime?: string; endTime?: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>('/water/alarm', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 处理水质报警 POST /api/water/alarm/handle */
export async function handleWaterAlarm(
  body: { id: string; handlerId: string; handleNotes: string },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<boolean>>('/water/alarm/handle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ====== 新增缺失的函数 ======

/** 获取水质数据列表 GET /api/water/data/list */
export async function getWaterDataList(
  options?: { [key: string]: any },
) {
  return request<BaseResponse<API.PondStatus[]>>('/water/data/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取池塘详细趋势数据 GET /api/water/pond/trend */
export async function getPondDetailTrend(
  pondId: string,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<PondWaterLog[]>>('/water/pond/trend', {
    method: 'GET',
    params: {
      pondId,
    },
    ...(options || {}),
  });
}