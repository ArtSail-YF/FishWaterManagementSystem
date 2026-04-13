declare namespace Task {

    // =============== 全局状态枚举 ===============
        export type PondStatus = 'breeding' | 'empty' | 'locked' | 'ready';
        export type TaskType = 'feed' | 'medicine' | 'water' | 'harvest';
        export type TaskStatus = 'pending' | 'completed' | 'overdue';
        export type TimelineStatus = 'wait' | 'process' | 'finish';


    // =============== 任务与时间轴 ===============
        export interface TaskItem {
        id: string;
        time: string;       // "08:00"
        type: TaskType;
        content: string;
        status: TaskStatus;
        executor: string;
        }

        export interface CalendarTask {
        type: TaskType;
        content: string;
        }

        export interface PondTimelineItem {
        time: string;      // "2026-03-27 08:00"
        title: string;
        content: string;
        status: TimelineStatus;
        }

        export interface PlanStatsProps {
        todayTasks: number;
        completedTasks: number;
        activePlans: number;
        overdueTasks: number;
        }

}