import { Card, Table, Space, Button, Tag, Typography, Select, DatePicker, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Certificate {
  key: string;
  id: string;
  pondId: string;
  pondName: string;
  productName: string;
  type: 'A' | 'B';
  batchNumber: string;
  issueDate: string;
  expirationDate: string;
  status: 'valid' | 'expired';
}

const HistoryRecords: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 模拟获取历史记录
    setLoading(true);
    setTimeout(() => {
      setCertificates([
        {
          key: '1',
          id: 'C001',
          pondId: 'P001',
          pondName: '1号池塘',
          productName: '南美白对虾',
          type: 'A',
          batchNumber: '20260301',
          issueDate: '2026-03-01',
          expirationDate: '2026-09-01',
          status: 'valid',
        },
        {
          key: '2',
          id: 'C002',
          pondId: 'P002',
          pondName: '2号池塘',
          productName: '大黄鱼',
          type: 'B',
          batchNumber: '20260302',
          issueDate: '2026-03-02',
          expirationDate: '2026-09-02',
          status: 'valid',
        },
        {
          key: '3',
          id: 'C003',
          pondId: 'P003',
          pondName: '3号池塘',
          productName: '南美白对虾',
          type: 'A',
          batchNumber: '20260201',
          issueDate: '2026-02-01',
          expirationDate: '2026-08-01',
          status: 'valid',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const columns = [
    {
      title: '合格证编号',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '塘口信息',
      key: 'pond',
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.pondName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.pondId}</Text>
        </Space>
      ),
    },
    {
      title: '产品信息',
      key: 'product',
      render: (_, record) => (
        <Space direction="vertical">
          <Text>{record.productName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>批次：{record.batchNumber}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === 'A' ? 'green' : 'blue'}>
          {text === 'A' ? 'A类' : 'B类'}
        </Tag>
      ),
    },
    {
      title: '有效期',
      key: 'validity',
      render: (_, record) => (
        <Space direction="vertical" style={{ fontSize: '12px' }}>
          <Text>开具：{record.issueDate}</Text>
          <Text>到期：{record.expirationDate}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === 'valid' ? 'green' : 'red'}>
          {text === 'valid' ? '有效' : '已过期'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size={8}>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">下载</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      className="fin-card" 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>历史记录查询 / HISTORY RECORDS</span>}
      variant="borderless"
      extra={
        <Space size={8}>
          <Input 
            placeholder="搜索编号或塘口" 
            prefix={<SearchOutlined />} 
            style={{ width: 200 }} 
          />
          <Select placeholder="类型" style={{ width: 120 }}>
            <Option value="">全部</Option>
            <Option value="A">A类</Option>
            <Option value="B">B类</Option>
          </Select>
          <RangePicker style={{ width: 200 }} />
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={certificates} 
        loading={loading}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        size="small"
      />
    </Card>
  );
};

export default HistoryRecords;