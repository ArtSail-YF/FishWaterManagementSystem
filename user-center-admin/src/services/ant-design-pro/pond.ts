import { request } from '@umijs/max';

/**
 * 获取塘口列表及统计摘要 (聚合接口)
 * GET /api/pond/list-with-summary
 */
export async function getPondListWithSummary(options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondListWithSummary>>('/api/pond/list-with-summary', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取塘口列表
 * GET /api/pond/list
 */
export async function getPondList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondItem[]>>('/api/pond/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取塘口宏观统计数据 (基地/全局)
 * GET /api/pond/stats
 */
export async function getPondStats(options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondSummaryStatsProps>>('/api/pond/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取塘口详情 (带聚合数据)
 * GET /api/pond/:id/full
 */
export async function getPondFullDetail(id: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondDetail>>(`/api/pond/${id}/full`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取塘口详情
 * GET /api/pond/:id
 */
export async function getPondDetail(id: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondDetail>>(`/api/pond/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建塘口
 * POST /api/pond
 */
export async function createPond(data: Partial<Pond.PondItem>, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondItem>>('/api/pond', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/**
 * 更新塘口
 * PUT /api/pond/:id
 */
export async function updatePond(id: string, data: Partial<Pond.PondItem>, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Pond.PondDetail>>(`/api/pond/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/**
 * 删除塘口
 * DELETE /api/pond/:id
 */
export async function deletePond(id: string, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/pond/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
