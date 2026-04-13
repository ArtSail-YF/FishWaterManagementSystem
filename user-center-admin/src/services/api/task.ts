import { request } from '@umijs/max';


export type CalendarTask = {
  type: 'feed' | 'water' | 'harvest' | 'medicine';
  content: string;
};

export type TaskItem = {
  id: string;
  time: string; // "08:00"
  type: 'feed' | 'water' | 'harvest' | 'medicine';
  content: string;
  status: 'pending' | 'overdue' | 'completed';
  executor: string;
};

type TimelineStatus = 'finish' | 'process' | 'wait';

export type TimelineItem ={
  time: string;
  title: string;
  content: string;
  status: TimelineStatus;
}

export type PlanStatsProps ={
    todayTasks: number;
    completedTasks: number;
    activePlans: number;
    overdueTasks: number;

}

// 获取生产计划统计数据
export async function getPlanStats() {
  return request<API.BaseResponse<PlanStatsProps>>('tasks/stats', {
    method: 'GET',
  });
}

// 获取日历视图任务（按日期分组）
export async function getTaskSchedule(params: { start: string; end: string }) {
  return request<API.BaseResponse< Record<string, CalendarTask[]>>>('tasks/schedule', {
    method: 'GET',
    params,
  });
}


//获取某一天的任务列表
export async function getTaskDetails(date: string) {
  return request<API.BaseResponse<Record<string, TaskItem[]>>>('tasks/detail', {
    method: 'GET',
    params: { date },
  });
}

//获取某个塘口生产计划时间轴
export async function getPondTimeline(pondId: string) {
  return request<API.BaseResponse<TimelineItem[]>>('tasks/pond', {
    method: 'GET',
    params: { pondId },
  });
}




