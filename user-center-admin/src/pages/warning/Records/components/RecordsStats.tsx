import { Card, Col, Row, Space, Statistic } from 'antd';
import React from 'react';
import type { WarningStatsData } from '@/services/api/warning';

interface RecordsStatsProps {
  data: WarningStatsData;
}

const RecordsStats: React.FC<RecordsStatsProps> = ({ data }) => {
  return (
    <Row gutter={8} style={{ marginBottom: 16 }}>
      <Col span={8}>
        <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
          <div className="fin-ticker-label">总预警数 / TOTAL ALERTS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="fin-ticker-value fin-number" style={{ color: '#595959' }}>{data.total}</div>
            {data.trend && (
              <div className={data.trend.isUp ? 'fin-trend-up' : 'fin-trend-down'} style={{ fontSize: '12px' }}>
                {data.trend.isUp ? '↑' : '↓'} {data.trend.value}% VS LAST MONTH
              </div>
            )}
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
          <div className="fin-ticker-label">平均解决率 / RESOLUTION RATE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="fin-ticker-value fin-number" style={{ color: '#3f8600' }}>{data.solveRate}%</div>
            <div style={{ fontSize: '10px', color: '#bfbfbf' }}>TARGET: 98%</div>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
          <div className="fin-ticker-label">平均处置耗时 / AVG RESPONSE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="fin-ticker-value fin-number" style={{ color: '#1890ff' }}>{data.avgHandleTime}</div>
            <div style={{ fontSize: '10px', color: '#bfbfbf' }}>SLA: &lt; 10m</div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RecordsStats;
