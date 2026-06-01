/**
 * 捕捞记录 API 返回的数据结构（契约）
 */

/** 捕捞记录  */
export interface HarvestRecord {
  id: number;
  recordNo: string;
  baseId: number;
  pondId: number;
  species: string;
  weight: number;
  unit: string;
  method: string;
  teamName: string;
  operatorName: string;
  status: string;
  remark: string;
  harvestTime: string;
  createTime: string;
}
