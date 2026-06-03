import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Space, Tag, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import AquacultureAdvice from './components/AquacultureAdvice';
import EmergencyPanel from './components/EmergencyPanel';
import SpecialForecast from './components/SpecialForecast';
import StatusHeader from './components/StatusHeader';
import TideModule from './components/TideModule';
import WeatherSummary from './components/WeatherSummary';

const { Text } = Typography;

const WeatherRealTime: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <WeatherSummary />

      <PageContainer
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              数据每 1-3 分钟自动刷新
            </Text>
            <Tag color="blue" style={{ fontSize: 11 }}>
              最后更新 {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </Tag>
          </div>

          <StatusHeader />

          <Row gutter={16}>
            <Col span={15}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <AquacultureAdvice />
                <SpecialForecast />
              </Space>
            </Col>

            <Col span={9}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <TideModule />
                <EmergencyPanel />
              </Space>
            </Col>
          </Row>
        </Space>
      </PageContainer>
    </div>
  );
};

export default WeatherRealTime;
