import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect, useCallback } from 'react';
import PlanCalendar from './components/PlanCalendar';
import PlanDetailTimeline from './components/PlanDetailTimeline';
import PlanStats from './components/PlanStats';
import TaskCenter, { TaskItem } from './components/TaskCenter';
import { getPlanStats, getTasksByDate } from '@/services/api/production/task';
import { getPlanStats as getPlanStatsApi } from '@/services/api/production/plan';
import { getPondOptions } from '@/services/api/pond';

// ====== 类型定义 ======

type CalendarTask = {
  type: 'feed' | 'water' | 'harvest' | 'medicine';
  content: string;
};

export interface PlanStatsData {
  todayTasks: number;
  completedTasks: number;
  activePlans: number;
  overdueTasks: number;
}

// ====== 工具函数 ======

/** 从任务标题推断类型 */
function inferTaskType(title: string): 'feed' | 'medicine' | 'water' | 'harvest' {
  if (/投喂|投饲|feed/i.test(title)) return 'feed';
  if (/用药|投药|药|medication|medicine/i.test(title)) return 'medicine';
  if (/换水|water/i.test(title)) return 'water';
  if (/捕捞|收获|harvest/i.test(title)) return 'harvest';
  return 'feed';
}

/** 映射后端状态到 TaskItem 状态 */
function mapTaskStatus(status: string): 'pending' | 'completed' | 'overdue' {
  if (status === 'done') return 'completed';
  if (status === 'expired') return 'overdue';
  return 'pending';
}

/** 后端 ProdTask → 前端 TaskItem */
function toTaskItem(task: any): TaskItem {
  const timeStr = task.actionTime || '';
  const time = timeStr.length >= 16 ? timeStr.substring(11, 16) : timeStr;
  return {
    id: String(task.id),
    time,
    type: inferTaskType(task.taskTitle || ''),
    content: task.taskTitle || '',
    status: mapTaskStatus(task.status),
    executor: task.assigneeName || '',
  };
}

/** 后端 ProdTask → 前端 CalendarTask */
function toCalendarTask(task: any): CalendarTask {
  return {
    type: inferTaskType(task.taskTitle || ''),
    content: task.taskTitle || '',
  };
}

// ====== 主组件 ======

const ProductionPlan: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tasksMap, setTasksMap] = useState<Record<string, CalendarTask[]>>({});
  const [stats, setStats] = useState<PlanStatsData>({
    todayTasks: 0, completedTasks: 0, activePlans: 0, overdueTasks: 0,
  });
  const [pondOptions, setPondOptions] = useState<{ label: string; value: number }[]>([]);
  const [pond, setPond] = useState<{ Name: string; Id: string }>({ Name: '', Id: '' });
  const [loading, setLoading] = useState(true);

  // 加载塘口选项
  useEffect(() => {
    getPondOptions().then(opts => {
      setPondOptions(opts);
      if (opts.length > 0) {
        const first = opts[0];
        setPond({ Name: first.label, Id: String(first.value) });
      }
    });
  }, []);

  // 获取统计
  const fetchStats = async () => {
    try {
      const [taskResp, planResp] = await Promise.all([
        getPlanStats(),
        getPlanStatsApi(),
      ]);
      const taskData = taskResp.data || {};
      const planData = planResp.data || {};
      setStats({
        todayTasks: taskData.todayTasks ?? 0,
        completedTasks: taskData.completedTasks ?? 0,
        activePlans: (planData.published ?? 0) + (planData.active ?? 0),
        overdueTasks: taskData.overdueTasks ?? 0,
      });
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  // 加载指定日期的任务
  const loadTasks = useCallback(async (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    try {
      const response = await getTasksByDate(dateStr);
      const list = Array.isArray(response.data) ? response.data : [];
      setTasks(list.map(toTaskItem));
    } catch (error) {
      console.error('获取任务失败:', error);
      setTasks([]);
    }
  }, []);

  // 批量加载月份内各日期的任务（用于日历展示）
  const loadMonthTasks = useCallback(async (date: Dayjs) => {
    const start = date.startOf('month');
    const end = date.endOf('month');
    const map: Record<string, CalendarTask[]> = {};

    const promises: Promise<void>[] = [];
    let d = start.subtract(3, 'day');
    while (!d.isAfter(end.add(3, 'day'))) {
      const ds = d.format('YYYY-MM-DD');
      promises.push(
        getTasksByDate(ds).then(resp => {
          const list = Array.isArray(resp.data) ? resp.data : [];
          if (list.length > 0) {
            map[ds] = list.map(toCalendarTask);
          }
        }).catch(() => {})
      );
      d = d.add(1, 'day');
    }
    await Promise.all(promises);
    setTasksMap(map);
  }, []);

  // 初始加载
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStats(),
      loadTasks(dayjs()),
      loadMonthTasks(dayjs()),
    ]).finally(() => setLoading(false));
  }, []);

  // 选择日期
  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    loadTasks(date);
  };

  // 日历组件回调查询某日任务
  const getTasksForDate = (date: Dayjs): CalendarTask[] => {
    return tasksMap[date.format('YYYY-MM-DD')] || [];
  };

  // 确认执行任务
  const handleExecuteTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, status: 'completed' as const } : task
    ));
  };

  // 切换塘口
  const handlePondChange = (value: number) => {
    const option = pondOptions.find(o => o.value === value);
    if (option) {
      setPond({ Name: option.label, Id: String(value) });
    }
  };

  if (loading) {
    return (
      <PageContainer header={undefined} title={false}>
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer header={undefined} title={false}>
      <PlanStats stats={stats} />

      <Row gutter={16}>
        {/* 左侧：任务列表 + 日历 */}
        <Col xs={24} lg={14}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TaskCenter
              selectedDate={selectedDate}
              tasks={tasks}
              onExecute={handleExecuteTask}
            />
            <PlanCalendar
              onSelect={handleSelectDate}
              getTasksForDate={getTasksForDate}
            />
          </div>
        </Col>

        {/* 右侧：塘口选择 + 进度追踪 */}
        <Col xs={24} lg={10}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ whiteSpace: 'nowrap', color: '#595959' }}>选择塘口：</span>
            <Select
              style={{ flex: 1 }}
              value={pond.Id ? Number(pond.Id) : undefined}
              placeholder="请选择塘口"
              options={pondOptions}
              onChange={handlePondChange}
            />
          </div>
          <PlanDetailTimeline pond={pond} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ProductionPlan;
