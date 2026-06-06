/**
 * 设备协议映射管理 API
 * 对应 iot_device_protocol_map 表
 * 统一入口：/iot/device-type-config/protocol-maps
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

export interface IoTProtocolMap {
  id?: number;
  deviceTypeId: number;
  deviceSn?: string;
  sourceField: string;
  metricKey: string;
}

const BASE = '/iot/device-type-config/protocol-maps';

/** 获取协议映射列表 */
export async function getProtocolMapList(deviceTypeId?: number, deviceSn?: string) {
  return request<BaseResponse<IoTProtocolMap[]>>(BASE, {
    method: 'GET',
    params: { deviceTypeId, deviceSn },
  });
}

/** 新增映射 */
export async function createProtocolMap(body: Partial<IoTProtocolMap>) {
  return request<BaseResponse<boolean>>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新映射 */
export async function updateProtocolMap(id: number, body: Partial<IoTProtocolMap>) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除映射 */
export async function deleteProtocolMap(id: number) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'DELETE',
  });
}
