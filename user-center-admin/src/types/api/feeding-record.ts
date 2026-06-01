/**
 * 投喂记录 API 返回的数据结构（契约）
 */

/** 投喂记录  */
export interface FeedingRecord {
  id: number;
  taskId: number;
  planId: number;
  baseId: number;
  targetType: string;
  targetId: number;
  quantity: number;
  unit: string;
  feedType: string;
  source: string;
  photoUrls: string | null;
  actualWorkerId: number;
  verifyStatus: string;
  remark: string;
  actionTime: string;
  createTime: string;
}
