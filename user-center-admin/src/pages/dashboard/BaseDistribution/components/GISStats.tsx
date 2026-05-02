import { Badge, Card, Col, Row, Statistic } from 'antd';
import React from 'react';


interface GISStatsProps {
  stats: {
    normal: number;
    todo: number;
    warning: number;
  };
  onStatusClick: (status: string) => void;
}

const GISStats: React.FC<GISStatsProps> = ({ stats, onStatusClick }) => {
  return (
    <Card 
      variant="borderless" 
      styles={{ body: { padding: '16px 24px' } }} 
      style={{ 
        marginBottom: 16, 


      }}
    >
      <Row gutter={24} justify="space-around" style={{ width: '100%' }}>
        <Col span={8}>
          <div 
            onClick={() => onStatusClick('normal')}
            style={{ 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: 8, 
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
          >
            <Statistic
              title={
                <span>
                  <Badge status="success" style={{ marginRight: 8 }} />
                  正常基地
                </span>
              }
              value={stats.normal}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
              size="small"
            />
          </div>
        </Col>
        <Col span={8}>
          <div 
            onClick={() => onStatusClick('todo')}
            style={{ 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: 8, 
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
          >
            <Statistic
              title={
                <span>
                  <Badge status="processing" style={{ marginRight: 8 }} />
                  待办任务
                </span>
              }
              value={stats.todo}
              valueStyle={{ color: '#1890ff' }}
              suffix="项"
              size="small"
            />
          </div>
        </Col>
        <Col span={8}>
          <div 
            onClick={() => onStatusClick('warning')}
            style={{ 
              cursor: 'pointer', 
              padding: 8, 
              borderRadius: 8, 
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
          >
            <Statistic
              title={
                <span>
                  <Badge status="error" style={{ marginRight: 8 }} />
                  预警报警
                </span>
              }
              value={stats.warning}
              valueStyle={{ color: '#ff4d4f' }}
              suffix="处"
              size="small"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default GISStats;
