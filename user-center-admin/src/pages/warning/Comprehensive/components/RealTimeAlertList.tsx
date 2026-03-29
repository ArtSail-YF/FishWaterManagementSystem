import { Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface AlertItem {
  key: string;
  level: 'P0' | 'P1' | 'P2';
  time: string;
  source: string;
  description: string;
  duration: string;
  status: 'pending' | 'processing' | 'resolved';
}

interface RealTimeAlertListProps {
  data: AlertItem[];
  onHandle: (item: AlertItem) => void;
  onIgnore: (item: AlertItem) => void;
}

const RealTimeAlertList: React.FC<RealTimeAlertListProps> = ({ data, onHandle, onIgnore }) => {
  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'P0':
        return { color: '#fff', backgroundColor: '#cf1322', fontWeight: 'bold' };
      case 'P1':
        return { color: '#faad14', backgroundColor: 'transparent', border: '1px solid #faad14' };
      case 'P2':
        return { color: '#1890ff', backgroundColor: 'transparent', border: '1px solid #1890ff' };
      default:
        return {};
    }
  };

  const columns = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 60,
      align: 'center' as const,
      render: (level: string) => (
        <span style={{ 
          display: 'inline-block', 
          padding: '2px 6px', 
          borderRadius: '2px', 
          fontSize: '11px',
          ...getLevelStyle(level)
        }}>
          {level}
        </span>
      ),
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      width: 140,
      className: 'fin-number',
      render: (text: string) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (text: string) => <span style={{ fontWeight: 600, fontSize: '12px' }}>{text}</span>,
    },
    {
      title: '预警描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span style={{ fontSize: '12px', color: text.includes('↓') || text.includes('↑') ? '#cf1322' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: '持续时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      className: 'fin-number',
      render: (text: string) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'right' as const,
      render: (_: any, record: AlertItem) => (
        <Space size={8}>
          <Button 
            type="primary" 
            size="small" 
            style={{ fontSize: '11px', height: '22px', borderRadius: '2px' }}
            onClick={() => onHandle(record)}
          >
            立即处理
          </Button>
          <Button 
            size="small" 
            style={{ fontSize: '11px', height: '22px', borderRadius: '2px' }}
            onClick={() => onIgnore(record)}
          >
            忽略
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      className="fin-card" 
      title="REAL-TIME ALERT STREAM / 实时预警流水"
      styles={{ body: { padding: 0 } }}
      style={{ height: '100%' }}
    >
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false} 
        size="small"
        bordered={false}
        scroll={{ y: 500 }}
      />
    </Card>
  );
};

export default RealTimeAlertList;
