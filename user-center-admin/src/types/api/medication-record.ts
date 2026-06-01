/**
 * 用药记录 API 返回的数据结构（契约）
 */

/** 用药记录  */
export interface MedicationRecord {
  id: number;
  taskId: number;
  planId: number;
  baseId: number;
  targetType: string;
  targetId: number;
  drugName: string;
  dosage: number;
  unit: string;
  method: string;
  withdrawalDays: number;
  source: string;
  photoUrls: string | null;
  actualWorkerId: number;
  verifyStatus: string;
  remark: string;
  actionTime: string;
  createTime: string;
}
