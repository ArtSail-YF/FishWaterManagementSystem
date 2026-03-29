import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';
import PondCardGrid, { PondStatus } from './components/PondCardGrid';
import QualityTrendChart from './components/QualityTrendChart';
import RecentAlerts from './components/RecentAlerts';
import WaterQualityStats from './components/WaterQualityStats';

const { Title } = Typography;

// 模拟塘口数据
const MOCK_PONDS: PondStatus[] = [
  {
    id: '1',
    name: '萧山 1 号塘',
    baseName: '萧山基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.8, trend: 'stable' },
      temp: { value: 24.5, trend: 'up' },
      ph: { value: 7.8, trend: 'stable' },
    },
  },
  {
    id: '2',
    name: '余杭 2 号塘',
    baseName: '余杭基地',
    status: 'warning',
    indicators: {
      oxygen: { value: 4.8, trend: 'down' },
      temp: { value: 26.1, trend: 'up' },
      ph: { value: 8.2, trend: 'up' },
    },
  },
  {
    id: '3',
    name: '富阳 3 号塘',
    baseName: '富阳基地',
    status: 'error',
    indicators: {
      oxygen: { value: 3.5, trend: 'down' },
      temp: { value: 23.8, trend: 'down' },
      ph: { value: 7.5, trend: 'stable' },
    },
  },
  {
    id: '4',
    name: '桐庐 4 号塘',
    baseName: '桐庐基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
    {
    id: '5',
    name: '桐庐 4 号塘',
    baseName: '桐庐基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
];

const WaterQuality: React.FC = () => {
  const [selectedPond, setSelectedPond] = useState<PondStatus | undefined>(MOCK_PONDS[0]);
  const [loading, setLoading] = useState(false);

  const stats = {
    total: MOCK_PONDS.length,
    normal: MOCK_PONDS.filter((p) => p.status === 'normal').length,
    warning: MOCK_PONDS.filter((p) => p.status === 'warning').length,
    error: MOCK_PONDS.filter((p) => p.status === 'error').length,
  };

  const handleSelectPond = (pond: PondStatus) => {
    setLoading(true);
    setSelectedPond(pond);
    // 模拟数据加载延迟
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <PageContainer header={{ title: '水质监控' }}>
      <WaterQualityStats stats={stats} />
      
      <Row gutter={16}>
        <Col span={24}>
          <PondCardGrid
            ponds={MOCK_PONDS}
            selectedPondId={selectedPond?.id}
            onSelect={handleSelectPond}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <QualityTrendChart pond={selectedPond} loading={loading} />
        </Col>
        <Col xs={24} lg={8}>
          <Card
            styles={{
              body: { padding: '16px' },
            }}
            style={{ height: '420px', overflowY: 'auto' }}
          >
            <RecentAlerts pond={selectedPond} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default WaterQuality;
