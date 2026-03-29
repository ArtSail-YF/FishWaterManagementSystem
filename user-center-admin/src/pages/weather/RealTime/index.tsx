import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Space } from 'antd';
import React from 'react';
import AquacultureAdvice from './components/AquacultureAdvice';
import EmergencyPanel from './components/EmergencyPanel';
import SpecialForecast from './components/SpecialForecast';
import StatusHeader from './components/StatusHeader';
import TideModule from './components/TideModule';
import WeatherSummary from './components/WeatherSummary';

const WeatherRealTime: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部行情条 */}
      <WeatherSummary />
      
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }} // 紧凑布局
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 核心状态 */}
          <StatusHeader />

          <Row gutter={16}>
            <Col span={15}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* 未来建议 */}
                <AquacultureAdvice />
                {/* 专项预测 */}
                <SpecialForecast />
              </Space>
            </Col>

            <Col span={9}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* 潮汐模块 */}
                <TideModule />
                {/* 灾害联动 */}
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
