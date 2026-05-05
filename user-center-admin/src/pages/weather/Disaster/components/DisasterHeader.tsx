import { Badge, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const DisasterHeader: React.FC = () => {
  return (
    <Card 
      variant="borderless" 
      className="fin-card" 
      style={{ backgroundColor: '#fff1f0', border: '1px solid #ffa39e' }}
      styles={{ body: { padding: '16px 24px' } }}
    >
      <Row gutter={24} align="middle">
        <Col span={6}>
          <Space direction="vertical" size={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge status="error" />
              <Text strong style={{ fontSize: '16px', color: '#cf1322' }}>强台风“格美” (GAEMI)</Text>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>编号：2403号 | 预警等级：红色</Text>
          </Space>
        </Col>

        <Col span={4}>
          <Statistic 
            title={<span style={{ fontSize: '12px' }}>中心最大风力</span>}
            value={15}
            suffix="级"
            valueStyle={{ fontSize: '24px', color: '#cf1322', fontWeight: 'bold' }}
            className="fin-number"
          />
        </Col>

        <Col span={4}>
          <Statistic 
            title={<span style={{ fontSize: '12px' }}>移动速度</span>}
            value={20}
            suffix="km/h"
            valueStyle={{ fontSize: '24px', color: '#cf1322' }}
            className="fin-number"
          />
        </Col>

        <Col span={4}>
          <Statistic 
            title={<span style={{ fontSize: '12px' }}>中心气压</span>}
            value={945}
            suffix="hPa"
            valueStyle={{ fontSize: '24px' }}
            className="fin-number"
          />
        </Col>

        <Col span={6} style={{ borderLeft: '1px solid #ffa39e', paddingLeft: '24px' }}>
          <Space direction="vertical" size={4}>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>风险评估统计</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ fontSize: '13px' }}>受影响基地</Text>
              <Text strong className="fin-number" style={{ color: '#cf1322' }}>12 个</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Text style={{ fontSize: '13px' }}>高风险资产</Text>
              <Text strong className="fin-number" style={{ color: '#cf1322' }}>¥45.8M</Text>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DisasterHeader;
