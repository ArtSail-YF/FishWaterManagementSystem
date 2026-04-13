/**
 * 水质模型
 * 前端自己使用的理想模型
 */

/** 水质指标 */
export interface WaterMetrics {
  level?: number;            // 水位/水深
  temperature?: number;      // 水温
  pH?: number;               // pH值
  dissolvedOxygen?: number;  // 溶氧量
  salinity?: number;         // 盐度
}

/** 基地水质汇总 */
export interface BaseWaterSummary {
  oxygen: number;            // 最低溶氧量
  temperature: number;       // 平均水温
  pH: number;                // 平均pH值
  warningUnits?: number;     // 异常单元数量
}

/** 池塘水质日志 */
export interface PondWaterLog {
  timestamp: string;
  dissolvedOxygen: number;
  waterTemperature?: number;
  pH?: number;
}

/** 水质统计 */
export interface WaterStats {
  total: number;
  normal: number;
  warning: number;
  error: number;
}

/** 水质告警日志 */
export interface WaterAlarmLog {
  id: string;
  time: string;
  metric?: string;
  value?: number;
  threshold?: number;
  status?: 'normal' | 'warning' | 'error';
  handle?: '未处理' | '已处理';
}

/** 海水水质指标 */
export interface SeawaterMetrics extends WaterMetrics {
  salinity: number;        // 盐度（‰，通常 25~35）
  turbidity: number;       // 浊度（NTU）
  chlorophyll: number;     // 叶绿素 a（μg/L，反映藻类密度）
  currentSpeed?: number;   // 水流速度（m/s，影响网箱溶氧交换）
  tideLevel?: number;      // 潮位（m）
}
