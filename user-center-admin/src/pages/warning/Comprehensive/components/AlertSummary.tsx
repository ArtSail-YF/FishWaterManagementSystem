import { Badge, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import type { AlertSummaryData } from '@/services/api/warning';

const { Text } = Typography;

interface AlertSummaryProps {
  data: AlertSummaryData;
}

const AlertSummary: React.FC<AlertSummaryProps> = ({ data }) => {
  const renderCard = (title: string, value: string | number, color: string, subValue?: string, subColor?: string) => (
    <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
      <div className="fin-ticker-label">{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="fin-ticker-value fin-number" style={{ color }}>
          {value}
        </div>
        {subValue && (
          <div className="fin-number" style={{ fontSize: '12px', color: subColor || '#8c8c8c' }}>
            {subValue}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <Row gutter={8} style={{ marginBottom: 16 }}>
      <Col span={6}>
        {renderCard('🚨 未处理预警总数', data.unprocessed, '#cf1322', 'CRITICAL', '#cf1322')}
      </Col>
      <Col span={6}>
        {renderCard('⚡ 近 1 小时新增', data.newInHour, '#faad14', `+${data.newInHour} NEW`)}
      </Col>
      <Col span={6}>
        {renderCard('✅ 今日已处理', data.processedToday, '#3f8600', 'EFFICIENCY')}
      </Col>
      <Col span={6}>
        {renderCard('⏱️ 平均响应时间', data.avgResponseTime, '#1890ff', 'SLA: 5m')}
      </Col>
    </Row>
  );
};

export default AlertSummary;
