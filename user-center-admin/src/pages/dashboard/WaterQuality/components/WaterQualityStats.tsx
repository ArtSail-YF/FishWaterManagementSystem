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
    <Card styles={{ body: { padding: '14px 20px' } }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="监测塘口" value={stats.total} suffix="个" valueStyle={{ fontSize: 20, fontWeight: 600 }} />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span><Badge status="success" />水质正常</span>}
            value={stats.normal}
            suffix="个"
            valueStyle={{ color: '#52c41a', fontSize: 20, fontWeight: 600 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span><Badge status="warning" />低氧预警</span>}
            value={stats.warning}
            suffix="个"
            valueStyle={{ color: '#faad14', fontSize: 20, fontWeight: 600 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={<span><Badge status="error" />水质异常</span>}
            value={stats.error}
            suffix="个"
            valueStyle={{ color: '#ff4d4f', fontSize: 20, fontWeight: 600 }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WaterQualityStats;
