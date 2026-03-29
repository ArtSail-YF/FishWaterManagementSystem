import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import PlanCalendar, { CalendarTask } from './components/PlanCalendar';
import PlanDetailTimeline from './components/PlanDetailTimeline';
import PlanStats from './components/PlanStats';
import TaskCenter, { TaskItem } from './components/TaskCenter';

const { Title } = Typography;

// 模拟日历任务
const MOCK_CALENDAR_TASKS: Record<string, CalendarTask[]> = {
  '2026-03-27': [
    { type: 'feed', content: '1号塘 投喂 20kg' },
    { type: 'medicine', content: '2号塘 用药防疫' },
    { type: 'water', content: '3号塘 换水调水' },
  ],
  '2026-03-28': [
    { type: 'feed', content: '4号塘 投喂 15kg' },
    { type: 'harvest', content: '5号塘 成品捕捞' },
  ],
  '2026-03-26': [
    { type: 'feed', content: '1号塘 投喂 20kg' },
    { type: 'water', content: '2号塘 换水' },
  ],
};

// 模拟详细任务列表
const MOCK_TASKS: Record<string, TaskItem[]> = {
  '2026-03-27': [
    { id: '1', time: '08:00', type: 'feed', content: '萧山 1 号塘 投喂 20kg 颗粒饲料', status: 'completed', executor: '张三' },
    { id: '2', time: '10:00', type: 'medicine', content: '余杭 2 号塘 全塘用药防疫', status: 'pending', executor: '李四' },
    { id: '3', time: '14:30', type: 'water', content: '富阳 3 号塘 换水 30%', status: 'pending', executor: '王五' },
    { id: '4', time: '16:00', type: 'feed', content: '桐庐 4 号塘 投喂 15kg', status: 'overdue', executor: '张三' },
  ],
  '2026-03-28': [
    { id: '5', time: '09:00', type: 'feed', content: '萧山 1 号塘 投喂 20kg', status: 'pending', executor: '张三' },
    { id: '6', time: '15:00', type: 'harvest', content: '桐庐 4 号塘 成品捕捞 500斤', status: 'pending', executor: '李四' },
  ],
};

const ProductionPlan: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs('2026-03-27'));
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS['2026-03-27'] || []);

  const stats = {
    todayTasks: 4,
    completedTasks: 1,
    activePlans: 12,
    overdueTasks: 1,
  };

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    const dateStr = date.format('YYYY-MM-DD');
    setTasks(MOCK_TASKS[dateStr] || []);
  };

  const getTasksForDate = (date: Dayjs): CalendarTask[] => {
    const dateStr = date.format('YYYY-MM-DD');
    return MOCK_CALENDAR_TASKS[dateStr] || [];
  };

  const handleExecuteTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'completed' as const } : task
    ));
  };

  return (
    <PageContainer header={{ title: '生产计划' }}>
      <PlanStats stats={stats} />
      
      <Row gutter={16}>
        {/* 左侧：日志（任务列表）和日历 */}
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
        
        {/* 右侧：进度追踪 */}
        <Col xs={24} lg={10}>
          <PlanDetailTimeline pondName="萧山 1 号塘" />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ProductionPlan;
