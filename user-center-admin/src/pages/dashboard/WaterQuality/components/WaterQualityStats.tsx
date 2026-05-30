import { Badge, Card, Col, Row, Statistic } from 'antd';
import React from 'react';

interface WaterQualityStatsProps {
  stats: {
    total: number;
    normal: number;
    warning: number;
    error: number;
  };
}

const WaterQualityStats: React.FC<WaterQualityStatsProps> = ({ stats }) => {
  return (
    <Card variant="borderless" styles={{ body: { padding: '16px 24px' } }} style={{ marginBottom: 16 }}>
      <Row gutter={24} justify="space-around">
        <Col span={6}>
          <Statistic title="监测塘口总数" value={stats.total} suffix="个" />
        </Col>
        <Col span={6}>
          <Statistic
            title={
              <span>
                <Badge status="success" style={{ marginRight: 8 }} />
                水质正常
              </span>
            }
            value={stats.normal}
            valueStyle={{ color: '#6b7280' }}
            suffix="个"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={
              <span>
                <Badge status="warning" style={{ marginRight: 8 }} />
                低溶氧预警
              </span>
            }
            value={stats.warning}
            valueStyle={{ color: '#9ca3af' }}
            suffix="个"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={
              <span>
                <Badge status="error" style={{ marginRight: 8 }} />
                水质异常
              </span>
            }
            value={stats.error}
            valueStyle={{ color: '#ef4444' }}
            suffix="个"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WaterQualityStats;
