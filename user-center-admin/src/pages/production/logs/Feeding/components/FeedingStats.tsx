import { BarsOutlined, FileTextOutlined, RiseOutlined, ExperimentOutlined } from '@ant-design/icons';
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
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }} loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>总投喂量</Text>}
            value={totalQuantity}
            precision={1}
            suffix="kg"
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<BarsOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }} loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>计划执行率</Text>}
            value={planExecRate}
            precision={1}
            suffix="%"
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<RiseOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }} loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>平均单次投喂</Text>}
            value={recordCount > 0 ? (totalQuantity / recordCount) : 0}
            precision={2}
            suffix="kg"
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<ExperimentOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }} loading={loading}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>筛选结果</Text>}
            value={recordCount}
            suffix="条记录"
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default FeedingStats;