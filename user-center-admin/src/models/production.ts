/**
 * 生产管理数据模型
 * 前端使用的理想数据模型
 */

import type { ProductionPlan, ProductionTask, PlanTypeEnum, PlanStatusEnum, TaskStatusEnum } from '@/types';
import type { FeedingRecord, MedicationRecord, HarvestRecord } from '@/types';

// ====== 生产计划模型扩展 ======

export interface ProductionPlanModel extends ProductionPlan {
  // 前端扩展字段
  pondNames?: string[];          // 塘口名称列表（前端显示用）
  creatorName?: string;          // 创建人姓名
  approverName?: string;         // 审批人姓名
  planTypeLabel?: string;        // 计划类型标签
  statusLabel?: string;          // 状态标签
  approvalStatusLabel?: string;  // 审批状态标签
  
  // 业务计算字段
  progress?: number;             // 执行进度（0-100）
  taskCount?: number;            // 任务总数
  completedTaskCount?: number;   // 已完成任务数
  
  // 时间格式化字段
  startTimeFormatted?: string;   // 格式化开始时间
  endTimeFormatted?: string;     // 格式化结束时间
  createTimeFormatted?: string;  // 格式化创建时间
}

// ====== 生产任务模型扩展 ======

export interface ProductionTaskModel extends ProductionTask {
  // 前端扩展字段
  planName?: string;             // 计划名称
  pondName?: string;             // 塘口名称
  executorName?: string;         // 执行人姓名
  taskTypeLabel?: string;        // 任务类型标签
  statusLabel?: string;          // 状态标签
  
  // 时间格式化字段
  executionTimeFormatted?: string; // 格式化执行时间
  actualTimeFormatted?: string;   // 格式化实际时间
  
  // 业务状态字段
  isOverdue?: boolean;           // 是否逾期
  canExecute?: boolean;          // 是否可执行
}

// ====== 生产统计模型 ======

export interface ProductionStatisticsModel {
  // 计划统计
  totalPlans: number;
  draftPlans: number;
  publishedPlans: number;
  executingPlans: number;
  completedPlans: number;
  delayedPlans: number;
  cancelledPlans: number;
  
  // 任务统计
  totalTasks: number;
  pendingTasks: number;
  executedTasks: number;
  notExecutedTasks: number;
  
  // 执行率统计
  planCompletionRate: number;    // 计划完成率
  taskCompletionRate: number;    // 任务完成率
  
  // 时间统计
  todayPlans: number;            // 今日计划
  weekPlans: number;             // 本周计划
  monthPlans: number;            // 本月计划
}

// ====== 计划表单模型 ======

export interface ProductionPlanForm {
  planType: PlanTypeEnum;
  planName: string;
  pondIds: string[];
  startTime: string;
  endTime: string;
  content?: any;
}

// ====== 任务表单模型 ======

export interface ProductionTaskForm {
  planId: string;
  taskName: string;
  taskType: PlanTypeEnum;
  pondId: string;
  executionTime: string;
  notes?: string;
}

// ====== 审批模型 ======

export interface ApprovalModel {
  id: string;
  approvalStatus: number;
  approvalNotes?: string;
}

// ====== 批量操作模型 ======

export interface BatchOperationModel {
  ids: string[];
  operation: 'delete' | 'publish' | 'cancel' | 'approve' | 'reject';
  params?: any;
}

// ====== 查询参数模型 ======

export interface ProductionQueryModel {
  current?: number;
  pageSize?: number;
  keyword?: string;
  planType?: PlanTypeEnum;
  status?: PlanStatusEnum;
  approvalStatus?: number;
  startTime?: string;
  endTime?: string;
  creatorId?: string;
}

// ====== 日历视图模型 ======

export interface CalendarEventModel {
  id: string;
  title: string;
  start: string;
  end: string;
  type: PlanTypeEnum;
  status: PlanStatusEnum;
  pondNames: string[];
  color?: string;
}

// ====== 甘特图模型 ======

export interface GanttItemModel {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string[];
  type: PlanTypeEnum;
  status: PlanStatusEnum;
}

// ====== 导出模型 ======

export interface ExportModel {
  type: 'plan' | 'task' | 'statistics';
  format: 'excel' | 'pdf' | 'csv';
  params: ProductionQueryModel;
  fileName?: string;
}

// ====== 模板模型 ======

export interface PlanTemplateModel {
  id: string;
  name: string;
  planType: PlanTypeEnum;
  content: any;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

// ====== 投喂记录模型 (feeding_record) ======


export interface FeedingRecordModel extends FeedingRecord {
  // 前端扩展字段
  baseName?: string;            // 基地名称
  targetName?: string;           // 目标名称
  time?: string;                    // actionTime 别名
  content?: string;                 // 显示内容
  operator?: string;                // 执行人名称
  status?: string;                  // 状态标签
  targetLabel?: string;             // 目标对象显示文本
  sourceLabel?: string;             // 来源显示文本
  verifyLabel?: string;             // 审核状态显示文本
}

// ====== 用药记录模型 (medication_record) ======

export interface MedicationRecordModel extends MedicationRecord {
  // 前端扩展字段
  baseName?: string;            // 基地名称
  targetName?: string;           // 目标名称
  time?: string;                    // actionTime 别名
  content?: string;                 // 显示内容
  operator?: string;                // 执行人
  status?: string;                  // 休药期状态
  targetLabel?: string;             // 目标对象显示文本
  sourceLabel?: string;             // 来源显示文本
  verifyLabel?: string;             // 审核状态显示文本
  details?: {
    medicineName?: string;
    dose?: number;
    withdrawalDays?: number;
    status?: string;
    remarks?: string;
  };
}

// ====== 捕捞记录模型 (harvest_record) ======

export interface HarvestRecordModel extends HarvestRecord {}
