/**
 * 后端返回的通用响应结构（契约）
 * 这些类型定义应该与后端API文档保持一致
 */

/** 通用响应结构 */
export interface BaseResponse<T = any> {
  code: number;       // 200 表示成功
  message: string;    // 描述信息
  data: T;            // 业务数据
  description?: string;
}

/** 分页参数 */
export interface PageParams {
  current?: number;
  pageSize?: number;
}

/** 分页响应 */
export interface PageResponse<T> {
  data: T[];
  total: number;
  success?: boolean;
}

/** 下拉选项 */
export interface SelectOption {
  label: string;
  value: string;
}

/** 数据字典 */
export interface DictData {
  baseList?: SelectOption[];
  speciesList?: SelectOption[];
  pondList?: SelectOption[];
  pondStatusList?: SelectOption[];
}

/** 通知图标项 */
export interface NoticeIconItem {
  id?: string;
  extra?: string;
  key?: string;
  read?: boolean;
  avatar?: string;
  title?: string;
  status?: string;
  datetime?: string;
  description?: string;
  type?: 'notification' | 'message' | 'event';
}

/** 通知图标列表 */
export interface NoticeIconList {
  data?: NoticeIconItem[];
  total?: number;
  success?: boolean;
}
