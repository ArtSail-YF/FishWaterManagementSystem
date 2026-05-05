/**
 * 数据格式转换工具
 * 用于将后端响应格式转换为前端组件可用的格式
 */

import type { BaseResponse, PageResult, PaginationResponse } from '@/types/common';

/**
 * 通用转换函数 - 将MyBatis Plus风格的后端响应转换为ProTable格式
 * @param res 后端响应
 * @returns 前端ProTable可用的响应格式
 */
export function convertToProTable<T>(res: BaseResponse<PageResult<T>>): PaginationResponse<T> {
  if (!res || !res.data) {
    return {
      data: [],
      total: 0,
      success: false,
      current: 1,
      pageSize: 10
    };
  }

  return {
    data: res.data.records || [],
    total: res.data.total || 0,
    success: res.code === 200,
    current: res.data.current || 1,
    pageSize: res.data.size || 10
  };
}
