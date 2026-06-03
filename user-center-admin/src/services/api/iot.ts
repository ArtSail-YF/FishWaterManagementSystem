/**
 * IoT 设备管理 API
 * 对应 iot_device 表
 */
import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { BaseResponse, PageResult } from '@/types/common';
import type { IoTDevice } from '@/types/model';

/** 分页查询设备 GET /iot/device/search */
export async function searchIotDevices(params: any) {
  const response = await request<BaseResponse<PageResult<IoTDevice>>>('/iot/device/search', {
    method: 'GET',
    params,
  });
  return convertToProTable(response);
}

/** 获取设备详情 GET /iot/device/{id} */
export async function getIotDeviceById(id: number) {
  return request<BaseResponse<IoTDevice>>('/iot/device/' + id, {
    method: 'GET',
  });
}

/** 新增设备 POST /iot/device */
export async function createIotDevice(body: Partial<IoTDevice>) {
  return request<BaseResponse<boolean>>('/iot/device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 更新设备 PUT /iot/device/{id} */
export async function updateIotDevice(id: number, body: Partial<IoTDevice>) {
  return request<BaseResponse<boolean>>('/iot/device/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除设备 DELETE /iot/device/{id} */
export async function deleteIotDevice(id: number) {
  return request<BaseResponse<boolean>>('/iot/device/' + id, {
    method: 'DELETE',
  });
}

/** 获取设备下拉选项（供发布弹窗等使用） GET /iot/device/options */
export async function getIotDeviceOptions(baseId?: number, typeId?: number) {
  return request<BaseResponse<IoTDevice[]>>('/iot/device/options', {
    method: 'GET',
    params: { baseId, typeId },
  });
}

/** 启停设备 PUT /iot/device/{id}/status */
export async function setDeviceStatus(id: number, status: number) {
  return request<BaseResponse<boolean>>('/iot/device/' + id + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: { status },
  });
}

/** 发送控制命令到设备 POST /iot/device/{id}/command */
export async function sendDeviceCommand(id: number, command: string) {
  return request<BaseResponse<string>>('/iot/device/' + id + '/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { command },
  });
}

/** 获取设备类型的指令列表 GET /iot/device-type/{id}/commands */
export async function getDeviceTypeCommands(deviceTypeId: number) {
  return request<BaseResponse<{ id: number; commandKey: string; commandName: string; confirmText: string; isStop: number }[]>>('/iot/device-type/' + deviceTypeId + '/commands', {
    method: 'GET',
  });
}

/** 获取指令执行记录 GET /iot/command-log?deviceId= */
export async function getCommandLogs(deviceId: number) {
  return request<BaseResponse<{ id: number; deviceId: number; commandKey: string; status: string; triggerTime: string; responseTime: string | null; responseData: string | null; errorMsg: string | null }[]>>('/iot/command-log', {
    method: 'GET',
    params: { deviceId },
  });
}
