import { request } from '@umijs/max';

/** 历史气象项 */
export type WeatherHistoryItem = {
  id: string;
  time: string;
  base: string;
  weather: string;
  avgTemp: number;
  maxWind: number;
  totalRain: number;
  avgPressure: number;
  status: 'normal' | 'extreme';
};

/** 实时气象简报 */
export type WeatherSummaryItem = {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
};

/** 专项预测项 */
export type SpecialForecastItem = {
  time: string;
  type: 'temp' | 'wind' | 'rain' | 'tide';
  value: string;
  advice: string;
  level: 'normal' | 'warning' | 'danger';
};

/** 养殖建议项 */
export type AquacultureAdviceItem = {
  indices: { label: string; value: number; desc: string }[];
  forecast: { day: string; weather: string; isWarning: boolean; advice: string; color: string }[];
};

/** 灾害信息项 */
export type DisasterInfo = {
  name: string;
  id: string;
  level: string;
  maxWind: number;
  speed: number;
  pressure: number;
  affectedBases: number;
  highRiskAssets: string;
};

// ================== API 请求函数 ==================

/**
 * 获取历史气象记录
 * GET /api/weather/history
 */
export async function getWeatherHistory(options?: any) {
  return request<API.BaseResponse<WeatherHistoryItem[]>>('/api/weather/history', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取实时气象摘要 (滚动条数据)
 * GET /api/weather/summary
 */
export async function getWeatherSummary(options?: any) {
  return request<API.BaseResponse<WeatherSummaryItem[]>>('/api/weather/summary', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取实时天气详情 (各基地详细数据)
 * GET /api/weather/realtime
 */
export async function getRealTimeWeather(options?: any) {
  return request<API.BaseResponse<any>>('/api/weather/realtime', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取养殖建议
 * GET /api/weather/advice
 */
export async function getAquacultureAdvice(options?: any) {
  return request<API.BaseResponse<AquacultureAdviceItem>>('/api/weather/advice', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取当前灾害信息 (如台风)
 * GET /api/weather/disaster
 */
export async function getDisasterInfo(options?: any) {
  return request<API.BaseResponse<DisasterInfo>>('/api/weather/disaster', {
    method: 'GET',
    ...(options || {}),
  });
}
