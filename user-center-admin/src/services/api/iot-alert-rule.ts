/**
 * IoT 预警规则 API
 * 对应 iot_alert_rule 表
 * 统一入口：/iot/device-type-config/alert-rules
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

export interface IoTAlertRule {
  id?: number;
  ruleName: string;
  deviceTypeId: number;
  metricKey: string;
  conditionExpr: string;
  severity: string;
  isEnabled?: number;
  remark?: string;
  /** 通知渠道，逗号分隔：sms,email,system */
  notifyChannels?: string;
}

const BASE = '/iot/device-type-config/alert-rules';

/** 获取预警规则列表 */
export async function getAlertRuleList(deviceTypeId?: number) {
  return request<BaseResponse<IoTAlertRule[]>>(BASE, {
    method: 'GET',
    params: { deviceTypeId },
  });
}

/** 新增规则 */
export async function createAlertRule(body: Partial<IoTAlertRule>) {
  return request<BaseResponse<boolean>>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新规则 */
export async function updateAlertRule(id: number, body: Partial<IoTAlertRule>) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除规则 */
export async function deleteAlertRule(id: number) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'DELETE',
  });
}
