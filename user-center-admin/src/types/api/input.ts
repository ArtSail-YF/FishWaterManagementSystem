/**
 * 投入记录相关API返回的数据结构（契约）
 * 这些类型定义应该与后端API文档保持一致
 */

import { BaseResponse } from '../common';

/** 投入记录项 */
export interface InputRecordDTO {
  id: string;
  date: string;
  name: string;
  category: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other';
  type: 'in' | 'out';
  specification: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  pondName?: string;
  operator: string;
  supplier?: string;
  status: 'pending' | 'approved' | 'rejected';
}

/** 投入记录列表响应 */
export type InputRecordListResponse = BaseResponse<InputRecordDTO[]>;

/** 投入记录操作响应 */
export type InputRecordOperationResponse = BaseResponse<boolean>;
