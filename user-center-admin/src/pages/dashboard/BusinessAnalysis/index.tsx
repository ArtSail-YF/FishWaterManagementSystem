import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import BaseRanking from './components/BaseRanking';
import BusinessStats from './components/BusinessStats';
import CategoryDistribution from './components/CategoryDistribution';
import ProfitTrendChart from './components/ProfitTrendChart';

const BusinessAnalysis: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('12月');

  // 模拟 KPI 数据
  const kpiData = {
    revenue: { value: 12500000, percent: 12.5, isUp: true, target: 15000000 },
    cost: { value: 8500000, percent: 5.2, isUp: false, target: 9000000 },
    profit: { value: 4000000, percent: 22.8, isUp: true, target: 6000000 },
    roi: { value: 1.47, percent: 8.5, isUp: true, target: 2.0 },
  };

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <PageContainer header={{ title: '经营分析 TERMINAL' }}>
      <BusinessStats data={kpiData} />
      
      <ProfitTrendChart onMonthClick={handleMonthClick} />
      
      <Row gutter={8}>
        <Col span={8}>
          <CategoryDistribution month={selectedMonth} type="cost" />
        </Col>
        <Col span={8}>
          <CategoryDistribution month={selectedMonth} type="income" />
        </Col>
        <Col span={8}>
          <Card className="fin-card" styles={{ body: { padding: '16px' } }}>
            <BaseRanking month={selectedMonth} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default BusinessAnalysis;
