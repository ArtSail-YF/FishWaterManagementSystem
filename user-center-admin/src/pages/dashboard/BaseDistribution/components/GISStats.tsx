import { Badge, Card, Col, Row, Statistic } from 'antd';
import React from 'react';

interface GISStatsProps {
  stats: {
    normal: number;
    todo: number;
    warning: number;
  };
}

const GISStats: React.FC<GISStatsProps> = ({ stats }) => {
  return (
    <Card variant="borderless" styles={{ body: { padding: '16px 24px' } }} style={{ marginBottom: 16 }}>
      <Row gutter={24} justify="space-around">
        <Col span={8}>
          <Statistic
            title={
              <span>
                <Badge status="success" style={{ marginRight: 8 }} />
                正常运行基地
              </span>
            }
            value={stats.normal}
            valueStyle={{ color: '#52c41a' }}
            suffix="个"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={
              <span>
                <Badge status="processing" style={{ marginRight: 8 }} />
                待办任务
              </span>
            }
            value={stats.todo}
            valueStyle={{ color: '#1890ff' }}
            suffix="项"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={
              <span>
                <Badge status="error" style={{ marginRight: 8 }} />
                预警报警
              </span>
            }
            value={stats.warning}
            valueStyle={{ color: '#ff4d4f' }}
            suffix="处"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default GISStats;
