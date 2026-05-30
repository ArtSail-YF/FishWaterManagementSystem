/**
 * IoT 设备参数配置 API
 * 对应 iot_device_config 表
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

/** 设备配置项 */
export interface DeviceConfigItem {
  id?: number;
  deviceId?: number;
  paramKey: string;
  paramValue: string;
  isActive?: number;
  updateTime?: string;
}

/** 获取设备所有配置 GET /iot/device-config/{deviceId} */
export async function getDeviceConfigs(deviceId: number) {
  return request<BaseResponse<DeviceConfigItem[]>>(`/iot/device-config/${deviceId}`, {
    method: 'GET',
  });
}

/** 全量保存设备配置 POST /iot/device-config/{deviceId} */
export async function saveDeviceConfigs(deviceId: number, configs: DeviceConfigItem[]) {
  return request<BaseResponse<null>>(`/iot/device-config/${deviceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: configs,
  });
}

/** 新增单条配置 POST /iot/device-config */
export async function addDeviceConfig(config: DeviceConfigItem) {
  return request<BaseResponse<boolean>>('/iot/device-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: config,
  });
}

/** 删除配置 DELETE /iot/device-config/{id} */
export async function deleteDeviceConfig(id: number) {
  return request<BaseResponse<boolean>>(`/iot/device-config/${id}`, {
    method: 'DELETE',
  });
}
