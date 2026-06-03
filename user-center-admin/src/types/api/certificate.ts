/**
 * 合格证相关类型定义
 */

/** 合格证策略 */
export interface CertificateStrategy {
  id: number;
  strategyName: string;
  specType: string;
  requiredTests: string;
  status: number;
}

/** 合格证主表 */
export interface CertificateInfo {
  id: number;
  certNo: string;
  strategyId: number;
  strategyName?: string;
  specType?: string;
  issueDate: string;
  status: 'valid' | 'expired' | 'used';
}

/** 合格证明细 */
export interface CertificateDetail {
  id: number;
  certId: number;
  targetType: string;
  targetId: number;
  targetName?: string;
  quantity: number;
  withdrawalPassed: boolean;
  testPassed: boolean;
  testReportUrl: string;
}

/** 合格证完整信息 */
export interface CertificateVO {
  id: number;
  certNo: string;
  strategyId: number;
  strategyName: string;
  specType: string;
  issueDate: string;
  status: string;
  details: CertificateDetail[];
}

/** 休药期状态 */
export interface WithdrawalStatus {
  pondId: number;
  pondName: string;
  locked: boolean;
  remainingDays: number;
  lockedUntil: string;
  relatedDrugs: WithdrawalDrugInfo[];
}

/** 休药期关联药品信息 */
export interface WithdrawalDrugInfo {
  drugName: string;
  adminDate: string;
  withdrawalDays: number;
  banHarvestUntil: string;
}

/** 合规校验结果 */
export interface ComplianceResult {
  passed: boolean;
  reasons: string[];
}

/** 合格证申请参数 */
export interface CertificateApplyParams {
  pondId: number;
  strategyId: number;
  harvestRecordIds?: number[];
  quantity: number;
  testReportUrl?: string;
}

/** 合格证列表查询参数 */
export interface CertificateSearchParams {
  current?: number;
  pageSize?: number;
  status?: string;
}
