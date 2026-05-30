import { CheckCircleOutlined, ClockCircleOutlined, DeploymentUnitOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

export interface PlanStatsProps {
  stats?: {
    todayTasks: number;
    completedTasks: number;
    activePlans: number;
    overdueTasks: number;
  };
}


const PlanStats: React.FC<PlanStatsProps> = ({ stats }) => {

  if (!stats) {
    return <Card>暂无统计数据</Card>;
  }

  return (

    <Card variant="borderless" styles={{ body: { padding: '16px 24px' } }} style={{ marginBottom: 16 }}>
      <Row gutter={24} justify="space-around">
        <Col span={6}>
          <Statistic
            title="今日待执行"
            value={stats.todayTasks}
            prefix={<ClockCircleOutlined style={{ color: '#1f2937' }} />}
            suffix="项"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="已完成任务"
            value={stats.completedTasks}
            valueStyle={{ color: '#6b7280' }}
            prefix={<CheckCircleOutlined />}
            suffix="项"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="进行中计划"
            value={stats.activePlans}
            prefix={<DeploymentUnitOutlined style={{ color: '#722ed1' }} />}
            suffix="个"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="逾期未完成"
            value={stats.overdueTasks}
            valueStyle={{ color: '#ef4444' }}
            prefix={<WarningOutlined />}
            suffix="项"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PlanStats;
