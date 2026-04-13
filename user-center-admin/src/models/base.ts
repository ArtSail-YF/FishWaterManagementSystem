/**
 * 基地模型
 * 前端自己使用的理想模型
 */

import type { BaseWaterSummary } from './water';

/** 基地状态 */
export type BaseStatus = 'normal' | 'warning' | 'todo';

/** 基地类型 */
export type BaseType = '近海' | '深远海' | '陆基工厂化';

/** 基地基础模型 */
export interface Base {
  id: string;
  name: string;
  location: [number, number];  // [经度, 纬度]
  status: BaseStatus;
  waterQuality: BaseWaterSummary;
  baseType: string;              // 基地类型（近海/深远海/陆基工厂化）
  deepSeaCertified: number;     // 是否深远海认证基地
  taiwanCooperation: number;     // 是否有台资合作
  greenCertification: string;    // 绿色认证等级
}

/** 基地详情模型 */
export interface BaseDetail extends Base {
  stats?: {
    totalPonds: number;
    warningPonds: number;
    todoTasks: number;
  };
}

/** 地图API配置 */
export interface MapApiConfig {
  apiKey: string;
}
