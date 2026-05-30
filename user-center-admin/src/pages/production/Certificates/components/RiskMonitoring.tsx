import { Card, Space, Tag, Typography, Progress, Table, Badge, Button } from 'antd';
import React, { useState, useEffect } from 'react';

const { Title, Text } = Typography;

interface RiskItem {
  key: string;
  pondId: string;
  pondName: string;
  riskLevel: 'high' | 'medium' | 'low';
  remainingDays: number;
  totalDays: number;
  medicineName: string;
  useTime: string;
  endDate: string;
  status: string;
}

const RiskMonitoring: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 模拟获取风险数据
    setLoading(true);
    setTimeout(() => {
      setRiskData([
        {
          key: '1',
          pondId: 'P005',
          pondName: '5号池塘',
          riskLevel: 'high',
          remainingDays: 7,
          totalDays: 7,
          medicineName: '聚维酮碘',
          useTime: '2026-03-27 10:30',
          endDate: '2026-04-03',
          status: '锁定中',
        },
        {
          key: '2',
          pondId: 'P012',
          pondName: '12号池塘',
          riskLevel: 'high',
          remainingDays: 15,
          totalDays: 15,
          medicineName: '恩诺沙星',
          useTime: '2026-03-27 09:15',
          endDate: '2026-04-11',
          status: '锁定中',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const columns = [
    {
      title: '塘口信息',
      key: 'pond',
      render: (_, record) => (
        <Space direction="vertical">
          <Tag color="blue">{record.pondId}</Tag>
          <Text>{record.pondName}</Text>
        </Space>
      ),
    },
    {
      title: '风险等级',
      key: 'riskLevel',
      render: (_, record) => (
        <Badge 
          status={record.riskLevel === 'high' ? 'error' : record.riskLevel === 'medium' ? 'warning' : 'success'}
          text={record.riskLevel === 'high' ? '高风险' : record.riskLevel === 'medium' ? '中风险' : '低风险'}
        />
      ),
    },
    {
      title: '休药期状态',
      key: 'withdrawal',
      render: (_, record) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <Text type={record.status === '锁定中' ? 'danger' : 'secondary'}>
              {record.status}
            </Text>
            <Text className="fin-number">剩 {record.remainingDays} 天</Text>
          </div>
          <Progress 
            percent={Math.max(0, (1 - record.remainingDays / record.totalDays) * 100)} 
            size="small" 
            showInfo={false}
            strokeColor={record.status === '锁定中' ? '#ef4444' : '#6b7280'}
          />
        </Space>
      ),
    },
    {
      title: '用药信息',
      key: 'medicine',
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.medicineName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>用药时间: {record.useTime}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>截止日期: {record.endDate}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <Card 
      className="fin-card" 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>休药期风险监控 / WITHDRAWAL PERIOD RISK MONITORING</span>}
      variant="borderless"
    >
      <Table 
        columns={columns} 
        dataSource={riskData} 
        loading={loading}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        size="small"
      />
    </Card>
  );
};

export default RiskMonitoring;