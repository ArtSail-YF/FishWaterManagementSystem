import { Card, Row, Col, Statistic, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React from 'react';

interface FinancialKPICardsProps {
  data?: {
    revenue: { value: number; percent: number; isUp: boolean; target: number };
    cost: { value: number; percent: number; isUp: boolean; target: number };
    profit: { value: number; percent: number; isUp: boolean; target: number };
    roi: { value: number; percent: number; isUp: boolean; target: number };
  };
}

const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({ 
  data = {
    revenue: { value: 12500000, percent: 12.5, isUp: true, target: 15000000 },
    cost: { value: 8500000, percent: 5.2, isUp: false, target: 9000000 },
    profit: { value: 4000000, percent: 22.8, isUp: true, target: 6000000 },
    roi: { value: 1.47, percent: 8.5, isUp: true, target: 2.0 },
  }
}) => {
  const formatValue = (value: number, type: string) => {
    if (type === 'roi') return value.toFixed(2);
    return (value / 10000).toFixed(0) + '万';
  };

  const getProgressColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 100) return '#52c41a';
    if (progress >= 80) return '#faad14';
    return '#ff4d4f';
  };

  const kpis = [
    {
      key: 'revenue',
      title: '总收入',
      value: data.revenue.value,
      percent: data.revenue.percent,
      isUp: data.revenue.isUp,
      target: data.revenue.target,
      color: '#1890ff',
      icon: '💰',
    },
    {
      key: 'cost',
      title: '总成本',
      value: data.cost.value,
      percent: data.cost.percent,
      isUp: data.cost.isUp,
      target: data.cost.target,
      color: '#ff4d4f',
      icon: '💸',
    },
    {
      key: 'profit',
      title: '净利润',
      value: data.profit.value,
      percent: data.profit.percent,
      isUp: data.profit.isUp,
      target: data.profit.target,
      color: '#52c41a',
      icon: '📈',
    },
    {
      key: 'roi',
      title: '投资回报率',
      value: data.roi.value,
      percent: data.roi.percent,
      isUp: data.roi.isUp,
      target: data.roi.target,
      color: '#722ed1',
      icon: '🎯',
    },
  ];

  return (
    <Row gutter={16}>
      {kpis.map((kpi) => (
        <Col span={6} key={kpi.key}>
          <Card 
            size="small" 
            style={{ 
              borderRadius: 8,
              borderLeft: `4px solid ${kpi.color}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>
                  {kpi.icon} {kpi.title}
                </div>
                <Statistic
                  value={kpi.value}
                  formatter={(value) => (
                    <span style={{ fontSize: 24, fontWeight: 'bold', color: kpi.color }}>
                      {formatValue(Number(value), kpi.key)}
                    </span>
                  )}
                />
                <div style={{ marginTop: 8 }}>
                  <Tag 
                    color={kpi.isUp ? 'success' : 'error'} 
                    icon={kpi.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  >
                    {kpi.isUp ? '+' : ''}{kpi.percent}%
                  </Tag>
                  <span style={{ fontSize: 12, color: '#8c8c8c', marginLeft: 8 }}>
                    同比
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>目标</div>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: getProgressColor(kpi.value, kpi.target) }}>
                  {formatValue(kpi.target, kpi.key)}
                </div>
                <div style={{ 
                  width: 60, 
                  height: 4, 
                  background: '#f0f0f0', 
                  borderRadius: 2,
                  marginTop: 4,
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`, 
                      height: '100%', 
                      background: getProgressColor(kpi.value, kpi.target),
                      transition: 'all 0.3s'
                    }} 
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FinancialKPICards;