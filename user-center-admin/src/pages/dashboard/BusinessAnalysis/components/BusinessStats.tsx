import { ArrowDownOutlined, ArrowUpOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Tooltip } from 'antd';
import React from 'react';

interface BusinessStatsProps {
  data: {
    revenue: { value: number; percent: number; isUp: boolean; target: number };
    cost: { value: number; percent: number; isUp: boolean; target: number };
    profit: { value: number; percent: number; isUp: boolean; target: number };
    roi: { value: number; percent: number; isUp: boolean; target: number };
  };
}

const BusinessStats: React.FC<BusinessStatsProps> = ({ data }) => {
  const renderCard = (title: string, current: any, isROI: boolean = false) => {
    const progress = Math.min(Math.round((current.value / current.target) * 100), 100);
    const trendClass = current.isUp ? 'fin-trend-up' : 'fin-trend-down';
    const showWarning = title === '总成本' && current.isUp;

    return (
      <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
        <div className="fin-ticker-label">
          <Space size={4}>
            {title}
            {showWarning && (
              <Tooltip title="成本上升，需关注！">
                <WarningOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            )}
          </Space>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className={`fin-ticker-value fin-number ${trendClass}`}>
            {!isROI && <span style={{ fontSize: '14px', marginRight: '2px' }}>¥</span>}
            {isROI ? current.value.toFixed(2) : (current.value / 10000).toFixed(1)}
            {!isROI && <span style={{ fontSize: '12px', marginLeft: '2px' }}>万</span>}
          </div>
          <div className={`fin-number ${trendClass}`} style={{ fontSize: '13px' }}>
            {current.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {current.percent}%
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Progress 
            percent={progress} 
            size={[Infinity, 4]} 
            strokeColor={current.isUp ? '#cf1322' : '#3f8600'} 
            showInfo={false} 
            trailColor="#f0f0f0"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#bfbfbf', marginTop: 4 }}>
            <span>TARGET达成</span>
            <span>{progress}%</span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Row gutter={8} style={{ marginBottom: 16 }}>
      <Col span={6}>{renderCard('总产值/收入', data.revenue)}</Col>
      <Col span={6}>{renderCard('总成本', data.cost)}</Col>
      <Col span={6}>{renderCard('净利润', data.profit)}</Col>
      <Col span={6}>{renderCard('投入产出比', data.roi, true)}</Col>
    </Row>
  );
};

export default BusinessStats;
