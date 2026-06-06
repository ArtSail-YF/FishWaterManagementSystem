/**
 * 设备类型指令管理 API
 * 对应 iot_device_type_command 表
 * 统一入口：/iot/device-type-config/commands
 */
import { request } from '@umijs/max';
import type { BaseResponse } from '@/types/common';

export interface IoTDeviceTypeCommand {
  id?: number;
  deviceTypeId: number;
  commandKey: string;
  commandName: string;
  confirmText?: string;
  isStop?: number;
  sortOrder?: number;
  isActive?: number;
}

const BASE = '/iot/device-type-config/commands';

/** 获取指令列表 */
export async function getCommandList(deviceTypeId?: number) {
  return request<BaseResponse<IoTDeviceTypeCommand[]>>(BASE, {
    method: 'GET',
    params: { deviceTypeId },
  });
}

/** 新增指令 */
export async function createCommand(body: Partial<IoTDeviceTypeCommand>) {
  return request<BaseResponse<boolean>>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新指令 */
export async function updateCommand(id: number, body: Partial<IoTDeviceTypeCommand>) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除指令 */
export async function deleteCommand(id: number) {
  return request<BaseResponse<boolean>>(BASE + '/' + id, {
    method: 'DELETE',
  });
}
