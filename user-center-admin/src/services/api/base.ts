import { request } from '@umijs/max';

/**
 * 获取基地列表
 * GET /api/base/list
 */
export async function getBaseList(options?: any) {
  return request<API.BaseResponse<Pond.BaseItem[]>>('base/list', {
    method: 'GET',
    ...(options || {}),
  });
}
