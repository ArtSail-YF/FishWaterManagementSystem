import { ArrowDownOutlined, ArrowUpOutlined, DashboardOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Row, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface PondStatus {
  id: string;
  name: string;
  baseName: string;
  status: 'normal' | 'warning' | 'error';
  indicators: {
    oxygen: { value: number; trend: 'up' | 'down' | 'stable' };
    temp: { value: number; trend: 'up' | 'down' | 'stable' };
    ph: { value: number; trend: 'up' | 'down' | 'stable' };
  };
}

interface PondCardGridProps {
  ponds: PondStatus[];
  selectedPondId?: string;
  onSelect: (pond: PondStatus) => void;
}

const PondCardGrid: React.FC<PondCardGridProps> = ({ ponds, selectedPondId, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'error':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <ArrowUpOutlined style={{ color: '#cf1322', fontSize: 12 }} />;
    if (trend === 'down') return <ArrowDownOutlined style={{ color: '#3f8600', fontSize: 12 }} />;
    return null;
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16, maxHeight: '400px', overflowY: 'auto' }}>
      {ponds.map((pond) => (
        <Col xs={24} sm={12} md={8} lg={6} key={pond.id}>
          <Card
            hoverable
            size="small"
            onClick={() => onSelect(pond)}
            styles={{
              body: { padding: 12 },
            }}
            style={{
              border: `1px solid ${selectedPondId === pond.id ? '#1890ff' : '#f0f0f0'}`,
              borderLeft: `4px solid ${getStatusColor(pond.status)}`,
              boxShadow: selectedPondId === pond.id ? '0 0 8px rgba(24,144,255,0.2)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>{pond.name}</Text>
              <Tag color="blue" style={{ margin: 0 }}>{pond.baseName}</Tag>
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>溶氧 (DO)</Text>
                <Space size={4}>
                  <Text strong style={{ color: pond.indicators.oxygen.value < 5 ? '#ff4d4f' : 'inherit' }}>
                    {pond.indicators.oxygen.value.toFixed(1)} mg/L
                  </Text>
                  <TrendIcon trend={pond.indicators.oxygen.trend} />
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>水温 (Temp)</Text>
                <Space size={4}>
                  <Text strong>{pond.indicators.temp.value.toFixed(1)} ℃</Text>
                  <TrendIcon trend={pond.indicators.temp.trend} />
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>PH 值</Text>
                <Space size={4}>
                  <Text strong>{pond.indicators.ph.value.toFixed(1)}</Text>
                  <TrendIcon trend={pond.indicators.ph.trend} />
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PondCardGrid;
