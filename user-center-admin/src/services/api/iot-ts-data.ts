import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';
import type { PondStatusItem } from '@/models/pond';

/** 水质趋势数据 */
export interface PondWaterLog {
  timestamp: string;
  dissolvedOxygen: number;
  waterTemperature: number;
  pH: number;
}

export async function getLatestTsData(params?: any) {
  return request('/iot/ts-data/latest', { method: 'GET', params });
}

export async function searchTsData(params: any) {
  const response = await request('/iot/ts-data/search', { method: 'GET', params });
  return convertToProTable(response);
}

export async function createTsData(body: any) {
  return request('/iot/ts-data', { method: 'POST', data: body });
}

export async function deleteTsData(id: number) {
  return request(`/iot/ts-data/${id}`, { method: 'DELETE' });
}

/** 获取所有塘口的最新水质指标（用于总览看板） */
export async function getPondSummary(): Promise<BaseResponse<PondStatusItem[]>> {
  try {
    const res = await request('/iot/ts-data/pond-summary', { method: 'GET' });
    const rawList: any[] = res?.data || [];
    const list: PondStatusItem[] = rawList.map((item: any) => ({
      id: item.id,
      name: item.name,
      baseName: item.baseName,
      status: item.status || 'normal',
      indicators: {
        oxygen: { value: item.oxygen?.value ?? 0, trend: item.oxygen?.trend || 'stable' },
        temp: { value: item.temp?.value ?? 0, trend: item.temp?.trend || 'stable' },
        ph: { value: item.ph?.value ?? 0, trend: item.ph?.trend || 'stable' },
      },
    }));
    return { code: 200, message: 'success', data: list };
  } catch (e) {
    console.error('获取塘口水质汇总失败', e);
    return { code: 500, message: 'failed', data: [] };
  }
}

/** 获取指定塘口的水质趋势数据 */
export async function getPondTrend(pondId: string): Promise<BaseResponse<PondWaterLog[]>> {
  try {
    const res = await request(`/iot/ts-data/pond-trend/${pondId}`, { method: 'GET' });
    const records: any[] = res?.data || [];
    return {
      code: 200,
      message: 'success',
      data: records.map((r: any) => ({
        timestamp: r.timestamp || '',
        dissolvedOxygen: r.dissolvedOxygen ?? 0,
        waterTemperature: r.waterTemperature ?? 0,
        pH: r.pH ?? 0,
      })),
    };
  } catch (e) {
    console.error('获取塘口趋势数据失败', e);
    return { code: 500, message: 'failed', data: [] };
  }
}

/** 获取 env_wq 水质数据（水质快照，数据源直接查 env_wq 表） */
export async function getEnvWqList(): Promise<BaseResponse<PondStatusItem[]>> {
  try {
    const res = await request('/env/wq/list', { method: 'GET' });
    const rawList: any[] = res?.data || [];
    const list: PondStatusItem[] = rawList.map((item: any) => {
      // 根据 do_status / ph_status 判断整体状态
      let status: 'normal' | 'warning' | 'error' = 'normal';
      if (item.doStatus === 'error' || item.phStatus === 'error') status = 'error';
      else if (item.doStatus === 'warning' || item.phStatus === 'warning') status = 'warning';

      return {
        id: String(item.pondId),
        name: item.pondName || '塘口' + item.pondId,
        baseName: item.baseName || '',
        status,
        indicators: {
          oxygen: { value: item.dissolvedOxygen ?? 0, trend: 'stable' },
          temp: { value: item.waterTemperature ?? 0, trend: 'stable' },
          ph: { value: item.phValue ?? 0, trend: 'stable' },
        },
      };
    });
    return { code: 200, message: 'success', data: list };
  } catch (e) {
    console.error('获取env_wq水质数据失败', e);
    return { code: 500, message: 'failed', data: [] };
  }
}

/** 获取综合监测看板的字典数据（基地、塘口状态、品种等选项） */
export async function getEnvWqDict(): Promise<any> {
  try {
    const res = await request('/env/wq/dict', { method: 'GET' });
    return res?.data || {};
  } catch (e) {
    console.error('获取监测看板字典数据失败', e);
    return {};
  }
}
