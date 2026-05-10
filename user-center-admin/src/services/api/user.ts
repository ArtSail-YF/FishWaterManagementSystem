/**
 * 用户管理API接口
 * 用于获取用户列表、选项等
 */

import { request } from '@umijs/max';
import type { BaseResponse, PageResult } from '@/types/common';

/** 获取用户下拉选项 */
export async function getUserOptions(
  options?: { [key: string]: any },
) {
  try {
    const response = await request<BaseResponse<any[]>>('/user/search', {
      method: 'GET',
      params: {
        ...options,
      },
    });

    const records = response.data || [];

    return records.map((user: any) => ({
      label: user.userName || user.username || user.userAccount || `用户${user.id}`,
      value: user.id,
      key: user.id,
      data: user,
    }));
  } catch (error) {
    console.error('获取用户选项失败:', error);
    return [];
  }
}

/** 获取用户列表 */
export async function getUserList(
  params?: { current?: number; pageSize?: number; keyword?: string; [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any[]>>('/user/search', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/** 根据ID查询用户 */
export async function getUserById(
  id: string | number,
  options?: { [key: string]: any },
) {
  return request<BaseResponse<any>>(`/user/${id}`, {
    method: 'GET',
  });
}

/** 获取当前登录用户 */
export async function getCurrentUser() {
  return request<BaseResponse<any>>('/user/currentUser', {
    method: 'GET',
  });
}
