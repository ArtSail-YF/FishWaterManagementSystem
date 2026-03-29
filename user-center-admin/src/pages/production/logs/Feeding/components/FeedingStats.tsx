import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const FeedingStats: React.FC = () => {
  return (
    <Row gutter={12}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>今日总投喂量 (kg)</Text>}
            value={1245.8}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={
              <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                <span className="fin-trend-up"><ArrowUpOutlined /> 12.5%</span>
              </span>
            }
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">计划执行率: </Text>
            <Text className="fin-number" strong>98.2%</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>预估料肉比 (FCR)</Text>}
            value={1.15}
            precision={2}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={
              <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                <span className="fin-trend-down"><ArrowDownOutlined /> 0.02</span>
              </span>
            }
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">行业基准: </Text>
            <Text className="fin-number">1.20</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>饲料剩余库存 (吨)</Text>}
            value={45.2}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}
            className="fin-number"
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">预计可用: </Text>
            <Text className="fin-number" strong>12 天</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>异常投喂提醒 (池塘)</Text>}
            value={2}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#cf1322' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#cf1322' }}>⚠️</span>}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">主要原因: </Text>
            <Text type="danger">摄食欲望下降</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default FeedingStats;
