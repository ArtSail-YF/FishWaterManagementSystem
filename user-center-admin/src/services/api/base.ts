import { request } from '@umijs/max';
import type { BaseResponse } from '@/types';

/**
 * 获取基地列表
 * GET /api/base/list
 */
export async function getBaseList(options?: any) {
  return request<BaseResponse<any[]>>('base/list', {
    method: 'GET',
    ...(options || {}),
  });
}
