import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Space } from 'antd';
import React from 'react';
import DisasterHeader from './components/DisasterHeader';
import EmergencyChecklist from './components/EmergencyChecklist';
import RiskDashboard from './components/RiskDashboard';
import TyphoonMap from './components/TyphoonMap';

const TyphoonDisaster: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 灾害概览看板 */}
          <DisasterHeader />

          {/* 2. 中部核心：地图与风险评估 */}
          <Row gutter={16}>
            <Col span={14}>
              <TyphoonMap />
            </Col>
            <Col span={10}>
              <RiskDashboard />
            </Col>
          </Row>

          {/* 3. 底部：应急响应与指挥清单 */}
          <EmergencyChecklist />
        </Space>
      </PageContainer>
    </div>
  );
};

export default TyphoonDisaster;
