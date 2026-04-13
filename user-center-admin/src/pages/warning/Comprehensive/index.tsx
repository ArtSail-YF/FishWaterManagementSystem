import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import AlertSummary from './components/AlertSummary';
import RealTimeAlertList from './components/RealTimeAlertList';
import RiskDistribution from './components/RiskDistribution';
import { getRealTimeAlerts, getWarningSummary, processWarning, type AlertItem, type AlertSummaryData } from '@/services/ant-design-pro/warning';
import { MOCK_ALERTS, MOCK_ALERT_SUMMARY } from '@/services/ant-design-pro/mock';

const ComprehensiveWarning: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [summaryData, setSummaryData] = useState<AlertSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, summaryRes] = await Promise.all([
        getRealTimeAlerts(),
        getWarningSummary()
      ]);
      setAlerts(alertsRes.data || []);
      setSummaryData(summaryRes.data || null);
    } catch (error) {
      console.error('获取预警数据失败，使用降级数据:', error);
      setAlerts(MOCK_ALERTS as any);
      setSummaryData(MOCK_ALERT_SUMMARY);
      message.warning('预警指挥中心已降级为模拟模式');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessAlert = async (item: AlertItem) => {
    const hide = message.loading(`正在处理预警 [${item.key}]...`);
    try {
      await processWarning(item.key, { status: 'resolved' });
      message.success(`预警 [${item.key}] 已转交现场处理。`);
      fetchData(); // 重新加载数据
    } catch (error) {
      console.warn('处理请求失败 (模拟环境直接更新状态)');
      setAlerts(prev => prev.map(a => a.key === item.key ? { ...a, status: 'resolved' } : a));
      message.success(`[模拟] 预警 ${item.key} 已处理`);
    } finally {
      hide();
    }
  };

  const handleIgnoreAlert = async (item: AlertItem) => {
    try {
      await processWarning(item.key, { status: 'ignored' });
      message.warning(`预警 [${item.key}] 已标记为误报。`);
      setAlerts(prev => prev.filter(a => a.key !== item.key));
    } catch (error) {
      message.error('操作失败');
    }
  };

  if (loading && !summaryData) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <Spin size="large" tip="加载指挥中心数据..." />
      </div>
    );
  }

  return (
    <PageContainer header={undefined} title={false}>
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
