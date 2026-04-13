import { Card, Col, Row, Statistic, Typography, Space, Badge, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';

const { Text } = Typography;

// 定义组件 Props 接口，方便未来传入动态数据
export interface PondSummaryStatsProps {
  totalPonds?: number;
  breedingCount?: number;
  emptyCount?: number;
  lockedCount?: number;
  totalArea?: number;
  avgDepth?: number;
  totalBiomass?: number;
  species?: string[];
  estimatedValue?: number;
  growthRate?: number;
}

const PondSummaryStats: React.FC<PondSummaryStatsProps> = ({
  totalPonds = 24,
  breedingCount = 18,
  emptyCount = 4,
  lockedCount = 2,
  totalArea = 12500,
  avgDepth = 1.8,
  totalBiomass = 45.8,
  species = ['南美白对虾', '大黄鱼'],
  estimatedValue = 324.5,
  growthRate = 2.4,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {/* 1. 塘口数量统计 */}
      <Col xs={24} sm={12} lg={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                总塘口数 / TOTAL PONDS
                <Tooltip title="包含所有状态的塘口">
                  <InfoCircleOutlined style={{ marginLeft: 4, cursor: 'pointer' }} />
                </Tooltip>
              </Text>
            }
            value={totalPonds}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个</span>}
          />
          <div style={{ marginTop: '12px' }}>
            <Space size={12} wrap>
              <Badge status="processing" text={<span style={{ fontSize: '12px' }}>养殖中 {breedingCount}</span>} />
              <Badge status="success" text={<span style={{ fontSize: '12px' }}>空塘 {emptyCount}</span>} />
              <Badge status="error" text={<span style={{ fontSize: '12px' }}>锁定 {lockedCount}</span>} />
            </Space>
          </div>
        </Card>
      </Col>

      {/* 2. 水体规模统计 */}
      <Col xs={24} sm={12} lg={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>总水体规模 / CAPACITY</Text>}
            value={totalArea.toLocaleString()}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>m²</span>}
          />
          <div style={{ marginTop: '12px', fontSize: '12px' }}>
            <Text type="secondary">平均水深: </Text>
            <Text className="fin-number">{avgDepth}m</Text>
          </div>
        </Card>
      </Col>

      {/* 3. 存塘生物量统计 */}
      <Col xs={24} sm={12} lg={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>存塘估算总量 / STOCK BIOMASS</Text>}
            value={totalBiomass}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
            className="fin-number"
            suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>吨</span>}
          />
          <div style={{ marginTop: '12px', fontSize: '12px' }}>
            <Text type="secondary">主要品种: </Text>
            <Text strong>{species.join('、')}</Text>
          </div>
        </Card>
      </Col>

      {/* 4. 资产估值统计 */}
      <Col xs={24} sm={12} lg={6}>
        <Card variant="borderless" className="fin-card">
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>当前存塘货值 / EST. VALUE</Text>}
            value={estimatedValue}
            precision={1}
            valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#cf1322' }}
            className="fin-number"
            prefix={<span style={{ fontSize: '18px', marginRight: '4px' }}>¥</span>}
            suffix={<span style={{ fontSize: '14px', fontWeight: 'normal' }}>万</span>}
          />
          <div style={{ marginTop: '12px', fontSize: '12px' }}>
            <Text type="secondary">资产增长: </Text>
            <Text className="fin-trend-up" style={{ color: '#cf1322' }}>+{growthRate}%</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PondSummaryStats;