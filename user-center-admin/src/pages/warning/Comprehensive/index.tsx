import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, message } from 'antd';
import React, { useState } from 'react';
import AlertSummary from './components/AlertSummary';
import RealTimeAlertList, { AlertItem } from './components/RealTimeAlertList';
import RiskDistribution from './components/RiskDistribution';

// 模拟预警流水数据
const MOCK_ALERTS: AlertItem[] = [
  {
    key: '1',
    level: 'P0',
    time: '2026-03-27 10:45:12',
    source: '萧山基地 / 1号塘',
    description: '溶氧量 (DO) 骤降: 2.1 mg/L ↓ (阈值 5.0)',
    duration: '15m',
    status: 'pending',
  },
  {
    key: '2',
    level: 'P1',
    time: '2026-03-27 10:30:45',
    source: '余杭基地 / 2号塘',
    description: '水温异常上升: 28.5 ℃ ↑ (阈值 26.0)',
    duration: '30m',
    status: 'pending',
  },
  {
    key: '3',
    level: 'P0',
    time: '2026-03-27 10:15:00',
    source: '富阳基地 / 3号塘',
    description: '投喂设备离线 [ID: FD-003]',
    duration: '45m',
    status: 'pending',
  },
  {
    key: '4',
    level: 'P2',
    time: '2026-03-27 09:50:22',
    source: '桐庐基地 / 4号塘',
    description: 'PH 值轻微偏移: 8.6 ↑ (阈值 8.5)',
    duration: '1h 10m',
    status: 'pending',
  },
  {
    key: '5',
    level: 'P1',
    time: '2026-03-27 09:30:11',
    source: '萧山基地 / 5号塘',
    description: '水位偏低报警: 1.2m ↓ (阈值 1.5)',
    duration: '1h 30m',
    status: 'pending',
  },
  {
    key: '6',
    level: 'P0',
    time: '2026-03-27 09:15:00',
    source: '余杭基地 / 1号塘',
    description: '氨氮超标预警: 0.8 mg/L ↑ (阈值 0.5)',
    duration: '1h 45m',
    status: 'pending',
  },
];

const ComprehensiveWarning: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  const summaryData = {
    unprocessed: 12,
    newInHour: 4,
    processedToday: 45,
    avgResponseTime: '4m 30s',
  };

  const handleProcessAlert = (item: AlertItem) => {
    message.success(`正在为您跳转至 [${item.source}] 的实时处理页面...`);
    // 实际业务中这里会跳转到详情页或弹出处理弹窗
  };

  const handleIgnoreAlert = (item: AlertItem) => {
    message.warning(`预警 [${item.key}] 已被标记为误报。`);
    setAlerts(prev => prev.filter(a => a.key !== item.key));
  };

  return (
    <PageContainer header={{ title: '综合预警 COMMAND CENTER' }}>
      <AlertSummary data={summaryData} />
      
      <Row gutter={8}>
        {/* 左侧：实时流水 */}
        <Col xs={24} lg={16}>
          <RealTimeAlertList 
            data={alerts} 
            onHandle={handleProcessAlert}
            onIgnore={handleIgnoreAlert}
          />
        </Col>
        
        {/* 右侧：风险分布 */}
        <Col xs={24} lg={8}>
          <RiskDistribution />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ComprehensiveWarning;
