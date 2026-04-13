/**
 * 投入记录模型
 * 前端自己使用的理想模型
 */

/** 投入记录类型 */
export type InputRecordType = 'in' | 'out';

/** 投入记录分类 */
export type InputRecordCategory = 'feed' | 'medicine' | 'seed' | 'equipment' | 'other';

/** 投入记录状态 */
export type InputRecordStatus = 'pending' | 'approved' | 'rejected';

/** 投入记录项 */
export interface InputRecord {
  id: string;
  date: string;
  name: string;
  category: InputRecordCategory;
  type: InputRecordType;
  specification: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  pondName?: string;
  operator: string;
  supplier?: string;
  status: InputRecordStatus;
}

/** 投入记录统计 */
export interface InputRecordStats {
  totalIn: number;
  totalOut: number;
  pendingCount: number;
  totalAmount: number;
}
