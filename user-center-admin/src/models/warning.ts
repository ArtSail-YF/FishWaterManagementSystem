/**
 * 预警中心数据模型
 * 前端使用的理想数据模型
 */

import type { WarningRule, WarningRuleParam, WarningRecord, WarningTypeEnum, WarningLevelEnum } from '@/types';

// ====== 预警规则模型扩展 ======

export interface WarningRuleModel extends WarningRule {
  // 前端扩展字段
  warningTypeLabel?: string;     // 预警类型标签
  warningLevelLabel?: string;    // 预警级别标签
  statusLabel?: string;          // 状态标签
  creatorName?: string;          // 创建人姓名
  
  // 关联数据
  params?: WarningRuleParamModel[]; // 预警参数列表
  triggerCount?: number;         // 触发次数
  lastTriggerTime?: string;      // 最后触发时间
  
  // 格式化字段
  createTimeFormatted?: string;  // 格式化创建时间
  updateTimeFormatted?: string;  // 格式化更新时间
}

// ====== 预警规则参数模型扩展 ======

export interface WarningRuleParamModel extends WarningRuleParam {
  // 前端扩展字段
  paramTypeLabel?: string;       // 参数类型标签
  valueRange?: string;           // 值范围显示
  
  // 表单字段
  editing?: boolean;             // 是否编辑中
}

// ====== 预警记录模型扩展 ======

export interface WarningRecordModel extends WarningRecord {
  // 前端扩展字段
  ruleName?: string;             // 规则名称
  pondName?: string;             // 塘口名称
  handlerName?: string;          // 处理人姓名
  warningLevelLabel?: string;    // 预警级别标签
  handledLabel?: string;         // 处理状态标签
  
  // 业务字段
  isRealTime?: boolean;          // 是否实时预警
  canHandle?: boolean;           // 是否可处理
  
  // 格式化字段
  createTimeFormatted?: string;  // 格式化创建时间
  handleTimeFormatted?: string;  // 格式化处理时间
  
  // 详情数据
  detailData?: any;              // 预警详情数据
}

// ====== 预警规则表单模型 ======

export interface WarningRuleForm {
  name: string;
  warningType: WarningTypeEnum;
  warningLevel: WarningLevelEnum;
  condition: string;
  enabled: number;
  notifyChannels?: string[];
  params: WarningRuleParamForm[];
}

export interface WarningRuleParamForm {
  paramName: string;
  paramType: string;
  paramValue: string;
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

// ====== 预警记录表单模型 ======

export interface WarningRecordForm {
  id: string;
  handleNotes: string;
}

// ====== 预警统计模型 ======

export interface WarningStatisticsModel {
  // 总体统计
  totalWarnings: number;
  handledWarnings: number;
  pendingWarnings: number;
  
  // 按类型统计
  warningByType: Array<{
    type: WarningTypeEnum;
    typeLabel: string;
    count: number;
    percentage: number;
  }>;
  
  // 按级别统计
  warningByLevel: Array<{
    level: WarningLevelEnum;
    levelLabel: string;
    count: number;
    percentage: number;
  }>;
  
  // 时间统计
  todayWarnings: number;         // 今日预警
  weekWarnings: number;          // 本周预警
  monthWarnings: number;         // 本月预警
  
  // 趋势统计
  trendData: Array<{
    date: string;
    count: number;
    handled: number;
  }>;
}

// ====== 实时预警模型 ======

export interface RealTimeWarningModel {
  id: string;
  ruleId: string;
  ruleName: string;
  pondId: string;
  pondName: string;
  content: string;
  warningLevel: WarningLevelEnum;
  warningLevelLabel: string;
  createTime: string;
  createTimeFormatted: string;
  
  // 实时数据
  currentValue?: number;         // 当前值
  thresholdValue?: number;       // 阈值
  unit?: string;                // 单位
}

// ====== 预警配置模型 ======

export interface WarningConfigModel {
  // 通知配置
  smsEnabled: boolean;          // 短信通知
  emailEnabled: boolean;        // 邮件通知
  appEnabled: boolean;          // APP推送
  wechatEnabled: boolean;       // 微信通知
  
  // 预警阈值配置
  thresholds: {
    waterQuality: {
      phMin: number;            // pH最小值
      phMax: number;            // pH最大值
      doMin: number;            // 溶解氧最小值
      temperatureMax: number;   // 温度最大值
    };
    feeding: {
      dailyMax: number;         // 日投喂量最大值
      intervalMin: number;      // 投喂间隔最小值
    };
    // 其他类型阈值配置
  };
  
  // 自动处理配置
  autoHandle: {
    enabled: boolean;           // 是否启用自动处理
    delayMinutes: number;       // 延迟处理时间（分钟）
    handleNotes: string;        // 自动处理备注
  };
}

// ====== 预警分析模型 ======

export interface WarningAnalysisModel {
  // 高频预警分析
  highFrequencyWarnings: Array<{
    ruleId: string;
    ruleName: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  
  // 响应时间分析
  responseTimeAnalysis: {
    avgResponseTime: number;    // 平均响应时间（分钟）
    maxResponseTime: number;    // 最长响应时间
    minResponseTime: number;    // 最短响应时间
  };
  
  // 预警有效性分析
  effectivenessAnalysis: {
    truePositive: number;       // 真阳性（有效预警）
    falsePositive: number;      // 假阳性（误报）
    accuracy: number;           // 准确率
  };
}

// ====== 查询参数模型 ======

export interface WarningQueryModel {
  current?: number;
  pageSize?: number;
  keyword?: string;
  warningType?: WarningTypeEnum;
  warningLevel?: WarningLevelEnum;
  handled?: number;
  startTime?: string;
  endTime?: string;
  pondId?: string;
}

// ====== 批量操作模型 ======

export interface WarningBatchOperationModel {
  ids: string[];
  operation: 'handle' | 'delete' | 'enable' | 'disable';
  params?: any;
}

// ====== 预警测试模型 ======

export interface WarningTestModel {
  ruleId: string;
  testData: any;
  expectedResult: boolean;
  actualResult?: boolean;
  testTime?: string;
}