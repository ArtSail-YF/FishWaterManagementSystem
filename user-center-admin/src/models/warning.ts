/**
 * 预警模型
 * 前端自己使用的理想模型
 */

/** 预警级别 */
export type AlertLevel = 'P0' | 'P1' | 'P2';

/** 实时预警项 */
export interface AlertItem {
  key: string;
  level: AlertLevel;
  time: string;
  source: string;
  description: string;
  duration: string;
  status: 'pending' | 'resolved' | 'ignored';
}

/** 预警统计 */
export interface AlertSummary {
  unprocessed: number;
  newInHour: number;
  processedToday: number;
  avgResponseTime: string;
}

/** 历史预警复盘记录 */
export interface WarningHistory {
  id: string;
  level: AlertLevel;
  startTime: string;
  endTime: string;
  duration: string;
  source: string;
  description: string;
  handler: string;
  status: 'resolved' | 'ignored' | 'pending';
  comment: string;
}

/** 预警历史统计 */
export interface WarningStats {
  total: number;
  solveRate: number;
  avgHandleTime: string;
  trend: { value: number; isUp: boolean };
}

/** 风险分布数据 */
export interface RiskDistribution {
  heatmap: { x: string[]; y: string[]; data: [number, number, number][] };
  composition: { name: string; value: number; color: string }[];
}
