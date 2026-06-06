/**
 * 设备类型 API
 * 对应 iot_device_type 表
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

export interface IoTDeviceType {
  id?: number;
  typeCode: string;
  typeName: string;
  manufacturer?: string;
  protocolType?: string;
  description?: string;
  status?: number;
}

/** 获取全部设备类型列表 GET /iot/device-type/list */
export async function getDeviceTypeList() {
  return request<BaseResponse<IoTDeviceType[]>>('/iot/device-type/list', {
    method: 'GET',
  });
}

/** 新增设备类型 POST /iot/device-type */
export async function createDeviceType(body: Partial<IoTDeviceType>) {
  return request<BaseResponse<boolean>>('/iot/device-type', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新设备类型 PUT /iot/device-type/{id} */
export async function updateDeviceType(id: number, body: Partial<IoTDeviceType>) {
  return request<BaseResponse<boolean>>('/iot/device-type/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除设备类型 DELETE /iot/device-type/{id} */
export async function deleteDeviceType(id: number) {
  return request<BaseResponse<boolean>>('/iot/device-type/' + id, {
    method: 'DELETE',
  });
}
