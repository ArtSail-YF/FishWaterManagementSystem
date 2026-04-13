import { request } from '@umijs/max';



export type PondWaterLog= {
  timestamp: string; // 时间戳，例如 "2023-09-01T08:00:00Z"
  dissolvedOxygen: number; // 溶氧值，单位 mg/L
  waterTemperature?: number; // 水温，单位 ℃
  pH?: number; // pH 值
  // 可能还有其他字段，如电导率、浊度等
}

export type stats= {
    total: number;
    normal: number;
    warning: number;
    error: number;
};

export type WaterAlarmLog={
  id: string;
  time: string;
  metric?: string;
  value?: number;
  threshold?: number;
  status?: 'normal' | 'warning' | 'error';
  handle?: '未处理' | '已处理';
}


// 获取塘口水情数据
export async function getWaterDataList() {
  return request<{ data:Pond.PondStatus[] }>('water/list', {
    method: 'GET',
  });
}

// 获取塘口水情状态数据
export async function getPondSate() {
  return request<{ data: stats }>('water/stats', {
    method: 'GET',
  });
}
//获取详情趋势线
export async function getPondDetailTrend(id: string) {
  return request<{ data: PondWaterLog[] }>(`water/pond/${id}/trend`, {
    method: 'GET',
  });
}

//水质报警列表
export async function getWaterAlarmList() {
  return request<{ data: WaterAlarmLog[]}>('water/alarm', {
    method: 'GET',
  });
}