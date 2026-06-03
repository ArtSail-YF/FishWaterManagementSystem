/** 
 * 指标定义 API
 * 对应 iot_metric_def 表
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

export interface MetricDef {
  metricKey: string;
  displayName: string;
  unit: string;
  deviceTypeId: number;
  isActive: number;
}

/** 获取指标列表 GET /iot/metric-def/list */
export async function getMetricDefList(deviceTypeId?: number) {
  return request<BaseResponse<MetricDef[]>>('/iot/metric-def/list', {
    method: 'GET',
    params: { deviceTypeId },
  });
}