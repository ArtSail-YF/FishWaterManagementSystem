import { CheckCircleOutlined, ClockCircleOutlined, DeploymentUnitOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

interface PlanStatsProps {
  stats: {
    todayTasks: number;
    completedTasks: number;
    activePlans: number;
    overdueTasks: number;
  };
}

const PlanStats: React.FC<PlanStatsProps> = ({ stats }) => {
  return (
    <Card variant="borderless" styles={{ body: { padding: '16px 24px' } }} style={{ marginBottom: 16 }}>
      <Row gutter={24} justify="space-around">
        <Col span={6}>
          <Statistic
            title="今日待执行"
            value={stats.todayTasks}
            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            suffix="项"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="已完成任务"
            value={stats.completedTasks}
            valueStyle={{ color: '#52c41a' }}
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
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<WarningOutlined />}
            suffix="项"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PlanStats;
