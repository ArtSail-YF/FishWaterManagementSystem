import { Badge, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const StatusHeader: React.FC = () => {
  return (
    <Card variant="borderless" className="fin-card" styles={{ body: { padding: '12px 20px' } }}>
      <Row gutter={24} align="middle">
        <Col span={6}>
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: '12px' }}>当前养殖气象状态 / LIVE STATUS</Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="fin-number" style={{ fontSize: '28px', color: '#cf1322' }}>26.4°C</span>
              <Text type="secondary">体感 28°C</Text>
            </div>
          </Space>
        </Col>
        
        <Col span={6}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic 
                title={<span style={{ fontSize: '12px' }}>持续风速</span>}
                value={4.2}
                precision={1}
                suffix="m/s"
                valueStyle={{ fontSize: '18px' }}
                className="fin-number"
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title={<span style={{ fontSize: '12px' }}>阵风</span>}
                value={6.8}
                precision={1}
                suffix="m/s"
                valueStyle={{ fontSize: '18px', color: '#fa8c16' }}
                className="fin-number"
              />
            </Col>
          </Row>
        </Col>

        <Col span={6} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '24px' }}>
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: '12px' }}>🌊 潮汐状态 (厦门港)</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Badge status="processing" text="正在涨潮" />
              <span className="fin-number" style={{ fontSize: '20px', fontWeight: 'bold' }}>+1.2m</span>
            </div>
          </Space>
        </Col>

        <Col span={6}>
          <div style={{ backgroundColor: '#f6ffed', padding: '8px 12px', borderRadius: '2px', border: '1px solid #b7eb8f' }}>
            <div style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>最佳纳水窗口期</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="fin-number" style={{ fontSize: '20px', color: '#389e0d' }}>01:42:05</span>
              <Text style={{ fontSize: '12px', color: '#389e0d' }}>适合纳水</Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default StatusHeader;
