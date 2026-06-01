import { AlertOutlined, HistoryOutlined, MedicineBoxOutlined, StockOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const MedicineStats: React.FC = () => {
  return (
    <Row gutter={12}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>今日用药总量</Text>}
            value={850}
            precision={0}
            suffix="g/ml"
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<MedicineBoxOutlined />}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">成本预计: </Text>
            <Text className="fin-number" strong>¥2,450.00</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>休药期监控中 (池塘)</Text>}
            value={5}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<HistoryOutlined />}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">最近出塘预计: </Text>
            <Text className="fin-number" strong>12 天后</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>库存周转警报 (品种)</Text>}
            value={2}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<StockOutlined />}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">急需采购: </Text>
            <Text type="danger">聚维酮碘, 恩诺沙星</Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>违禁/异常用药预警</Text>}
            value={0}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
            prefix={<AlertOutlined />}
          />
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <Text type="secondary">状态: </Text>
            <Text type="success">全部合规</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default MedicineStats;