/**
 * 任务模型
 * 前端自己使用的理想模型
 */

/** 任务类型 */
export type TaskType = 'feed' | 'medicine' | 'water' | 'harvest';

/** 任务状态 */
export type TaskStatus = 'pending' | 'completed' | 'overdue';

/** 时间轴状态 */
export type TimelineStatus = 'wait' | 'process' | 'finish';

/** 任务项 */
export interface TaskItem {
  id: string;
  time: string;       // "08:00"
  type: TaskType;
  content: string;
  status: TaskStatus;
  executor: string;
}

/** 日历任务 */
export interface CalendarTask {
  type: TaskType;
  content: string;
}

/** 池塘时间轴项 */
export interface PondTimelineItem {
  time: string;      // "2026-03-27 08:00"
  title: string;
  content: string;
  status: TimelineStatus;
}

/** 计划统计 */
export interface PlanStats {
  todayTasks: number;
  completedTasks: number;
  activePlans: number;
  overdueTasks: number;
}
