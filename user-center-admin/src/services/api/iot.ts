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
  return request<BaseResponse<IoTDevice>>(`/iot/device/${id}`, {
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
  return request<BaseResponse<boolean>>(`/iot/device/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

/** 删除设备 DELETE /iot/device/{id} */
export async function deleteIotDevice(id: number) {
  return request<BaseResponse<boolean>>(`/iot/device/${id}`, {
    method: 'DELETE',
  });
}

/** 根据基地ID获取在线设备列表（供发布弹窗下拉选择） GET /iot/device/by-base/{baseId} */
export async function getIotDevicesByBase(baseId: number) {
  return request<BaseResponse<IoTDevice[]>>(`/iot/device/by-base/${baseId}`, {
    method: 'GET',
  });
}

/** 根据设备类型和基地获取设备 GET /iot/device/by-type */
export async function getIotDevicesByType(typeId: number, baseId: number) {
  return request<BaseResponse<IoTDevice[]>>('/iot/device/by-type', {
    method: 'GET',
    params: { typeId, baseId },
  });
}


/** 启停设备 PUT /iot/device/{id}/status */
export async function setDeviceStatus(id: number, status: number) {
  return request<BaseResponse<boolean>>(`/iot/device/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: { status },
  });
}
