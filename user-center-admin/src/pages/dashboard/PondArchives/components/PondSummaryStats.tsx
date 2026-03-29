import { Card, Col, Row, Statistic, Typography, Space, Badge } from 'antd';
import React from 'react';

const { Text } = Typography;

const PondSummaryStats: React.FC = () => {
  return (
    <Row gutter={12}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>总塘口数 / TOTAL PONDS</Text>}
            value={24}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个</span>}
          />
          <div style={{ marginTop: '8px' }}>
            <Space size={12}>
              <Badge status="processing" text={<span style={{ fontSize: '11px' }}>养殖中: 18</span>} />
              <Badge status="success" text={<span style={{ fontSize: '11px' }}>空塘: 4</span>} />
              <Badge status="error" text={<span style={{ fontSize: '11px' }}>锁定: 2</span>} />
            </Space>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>总水体规模 / CAPACITY</Text>}
            value={12500}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>m²</span>}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">平均水深: </Text>
            <Text className="fin-number">1.8m</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>存塘估算总量 / STOCK BIOMASS</Text>}
            value={45.8}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>吨</span>}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">主要品种: </Text>
            <Text strong>南美白对虾, 大黄鱼</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>当前存塘货值 / EST. VALUE</Text>}
            value={324.5}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#cf1322' }}
            className="fin-number"
            prefix={<span style={{ fontSize: '18px', marginRight: '4px' }}>¥</span>}
            suffix={<span style={{ fontSize: '14px', fontWeight: 'normal' }}>万</span>}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">资产增长: </Text>
            <Text className="fin-trend-up">+2.4%</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PondSummaryStats;
