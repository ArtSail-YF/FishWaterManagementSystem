import { request } from '@umijs/max';

/**
 * 投喂记录类型
 */
export type FeedingLogItem = {
  id: string;
  time: string;
  pondId: string;
  feedType: string;
  amount: number;
  method: 'auto' | 'manual';
  operator: string;
  status: 'normal' | 'low' | 'high';
  remarks?: string;
};

/**
 * 用药记录类型
 */
export type MedicineLogItem = {
  id: string;
  time: string;
  pondId: string;
  medicineName: string;
  dose: number;
  reason: string;
  withdrawalDays: number;
  withdrawalRemaining: number;
  operator: string;
  status: 'locked' | 'safe';
  remarks?: string;
};

/**
 * 获取投喂记录
 * GET /api/logs/feeding
 */
export async function getFeedingLogs(options?: any) {
  return request<API.BaseResponse<FeedingLogItem[]>>('/api/logs/feeding', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 统一生产日志查询接口
 * GET /api/production/logs
 */
export async function getProductionLogs(type: 'feeding' | 'medicine' | 'patrol', options?: any) {
  return request<API.BaseResponse<Pond.ProductionLogItem[]>>('/api/production/logs', {
    method: 'GET',
    params: { type, ...options },
  });
}

/**
 * 获取用药记录
 * GET /api/logs/medicine
 */
export async function getMedicineLogs(options?: any) {
  return request<API.BaseResponse<MedicineLogItem[]>>('/api/logs/medicine', {
    method: 'GET',
    ...(options || {}),
  });
}
