import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface FeedingStatsProps {
  totalQuantity: number;
  recordCount: number;
  planExecRate: number;
  loading?: boolean;
}

const FeedingStats: React.FC<FeedingStatsProps> = ({ totalQuantity, recordCount, planExecRate, loading }) => {
  return (
    <Row gutter={12}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>总投喂量 (kg)</Text>}
            value={totalQuantity}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">记录条数: </Text>
            <Text className="fin-number" strong>{recordCount}</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>计划执行率</Text>}
            value={planExecRate}
            precision={1}
            suffix="%"
valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#2C2416' }}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">有量记录占比 </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>平均单次投喂</Text>}
            value={recordCount > 0 ? (totalQuantity / recordCount) : 0}
            precision={2}
            suffix="kg"
valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#2C2416' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>筛选结果</Text>}
            value={recordCount}
            suffix="条记录"
valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#2C2416' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default FeedingStats;
