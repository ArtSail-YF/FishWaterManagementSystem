import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, Tag, Space, Button, message, Modal, Typography, Badge } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  BellOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { getRealTimeAlerts, processWarning, getWarningStats } from '@/services/api/warning';
import RiskCharts from './components/RiskCharts';

const { Text } = Typography;

const LEVEL_STYLE: Record<string, { label: string; color: string }> = {
  HIGH: { label: 'P0', color: '#cf1322' },
  MEDIUM: { label: 'P1', color: '#fa8c16' },
  LOW: { label: 'P2', color: '#8c8c8c' },
};

const ComprehensiveWarning: React.FC = () => {
  const [stats, setStats] = useState({ unprocessed: 0, newInHour: 0, processedToday: 0, avgResponseTime: '--' });
  const [alerts, setAlerts] = useState<any[]>([]);

  const loadStats = () => {
    getWarningStats().then(res => {
      if (res?.data) setStats(res.data);
    }).catch(() => {});
  };

  const loadAlerts = () => {
    getRealTimeAlerts().then(res => {
      if (Array.isArray(res?.data)) setAlerts(res.data);
    }).catch(() => {});
  };

  useEffect(() => {
    loadStats();
    loadAlerts();
    const timer = setInterval(() => { loadStats(); loadAlerts(); }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleProcess = (id: number) => {
    Modal.confirm({
      title: '确认处理',
      content: '确认已处理该告警？',
      onOk: async () => {
        try {
          await processWarning({ id });
          message.success('已处理');
          loadAlerts();
          loadStats();
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleIgnore = (id: number) => {
    setAlerts(prev => prev.filter((a: any) => a.id !== id));
  };

  return (
    <PageContainer>
      {/* KPI 卡片行 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '16px 20px' } }}>
            <Statistic
              title={<Space size={4}><WarningOutlined style={{ color: '#ff4d4f' }} /><Text type="secondary" style={{ fontSize: 13 }}>未处理</Text></Space>}
              value={stats.unprocessed}
              valueStyle={{ color: '#ff4d4f', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '16px 20px' } }}>
            <Statistic
              title={<Space size={4}><ClockCircleOutlined style={{ color: '#faad14' }} /><Text type="secondary" style={{ fontSize: 13 }}>近1小时新增</Text></Space>}
              value={stats.newInHour}
              valueStyle={{ color: '#faad14', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '16px 20px' } }}>
            <Statistic
              title={<Space size={4}><CheckCircleFilled style={{ color: '#52c41a' }} /><Text type="secondary" style={{ fontSize: 13 }}>今日已处理</Text></Space>}
              value={stats.processedToday}
              valueStyle={{ color: '#52c41a', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '16px 20px' } }}>
            <Statistic
              title={<Space size={4}><BellOutlined style={{ color: '#595959' }} /><Text type="secondary" style={{ fontSize: 13 }}>平均响应</Text></Space>}
              value={stats.avgResponseTime}
              valueStyle={{ color: '#1f2937', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 内容区域：左侧预警列表 + 右侧图表 */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            size="small"
            title={
              <Space>
                <BellOutlined style={{ color: '#ff4d4f' }} />
                <span>实时预警</span>
                <Tag color="red" style={{ fontSize: 11 }}>{alerts.length} 条</Tag>
              </Space>
            }
            styles={{ body: { padding: 0, maxHeight: 500, overflow: 'auto' } }}
          >
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#bfbfbf' }}>
                <CheckCircleFilled style={{ fontSize: 32, color: '#52c41a', display: 'block', marginBottom: 8 }} />
                暂无告警
              </div>
            ) : (
              alerts.map((alert: any) => {
                const level = LEVEL_STYLE[alert.severity] || LEVEL_STYLE.LOW;
                return (
                  <div
                    key={alert.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <Badge
                      count={level.label}
                      style={{
                        backgroundColor: level.color,
                        fontSize: 10,
                        fontWeight: 'bold',
                        minWidth: 28,
                        lineHeight: '18px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2 }}>
                        {alert.triggerTime || ''}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>
                        {alert.title || `#${alert.id}`}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                        {alert.content || alert.alertNo || ''}
                      </Text>
                    </div>
                    <Space size={4} style={{ flexShrink: 0 }}>
                      {alert.status === 'UNHANDLED' && (
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckCircleOutlined />}
                          onClick={() => handleProcess(alert.id)}
                          style={{ fontSize: 11, height: 24 }}
                        >
                          处理
                        </Button>
                      )}
                      <Button
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => handleIgnore(alert.id)}
                        style={{ fontSize: 11, height: 24 }}
                      />
                    </Space>
                  </div>
                );
              })
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <RiskCharts />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ComprehensiveWarning;
