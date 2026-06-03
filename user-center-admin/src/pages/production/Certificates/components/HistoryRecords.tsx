import { Card, Table, Space, Button, Tag, Typography, Select, DatePicker, Input, message } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { ExportOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { searchCertificates, getCertificateDetail } from '@/services/api/certificate';
import type { CertificateVO } from '@/types/api/certificate';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface CertificateRecord {
  id: number;
  certNo: string;
  strategyName: string;
  specType: string;
  issueDate: string;
  status: string;
}

const HistoryRecords: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadData = useCallback(async (page: number, status?: string) => {
    setLoading(true);
    try {
      const params: any = { current: page, pageSize: 10 };
      if (status) params.status = status;
      const res = await searchCertificates(params);
      if (res?.data) {
        setCertificates(res.data as unknown as CertificateRecord[]);
        setTotal(res?.total || 0);
      }
    } catch (e: any) {
      message.error('获取历史记录失败: ' + (e?.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(current, statusFilter);
  }, [current, statusFilter, loadData]);

  const handleView = async (id: number) => {
    try {
      const res = await getCertificateDetail(id);
      if (res?.code === 200 && res?.data) {
        message.info('合格证编号: ' + res.data.certNo);
      }
    } catch (e) {
      message.error('获取详情失败');
    }
  };

  const columns = [
    {
      title: '合格证编号',
      dataIndex: 'certNo',
      key: 'certNo',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '合格证类型',
      key: 'strategy',
      render: (_: any, record: CertificateRecord) => (
        <Space direction="vertical">
          <Text>{record.strategyName || '-'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.specType || ''}</Text>
        </Space>
      ),
    },
    {
      title: '开具日期',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          valid: { color: 'green', label: '有效' },
          expired: { color: 'red', label: '已过期' },
          used: { color: 'blue', label: '已使用' },
        };
        const info = statusMap[text] || { color: 'default', label: text };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CertificateRecord) => (
        <Space size={8}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            查看
          </Button>
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
            placeholder="搜索编号"
            prefix={<SearchOutlined />}
            style={{ width: 160 }}
            onPressEnter={(e) => setCurrent(1)}
          />
          <Select
            placeholder="状态"
            style={{ width: 120 }}
            value={statusFilter || undefined}
            onChange={(val) => { setStatusFilter(val); setCurrent(1); }}
            allowClear
            onClear={() => { setStatusFilter(''); setCurrent(1); }}
          >
            <Option value="">全部</Option>
            <Option value="valid">有效</Option>
            <Option value="expired">已过期</Option>
            <Option value="used">已使用</Option>
          </Select>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={certificates}
        loading={loading}
        rowKey="id"
        pagination={{
          current,
          pageSize: 10,
          total,
          onChange: (page) => setCurrent(page),
          showSizeChanger: false,
        }}
        size="small"
      />
    </Card>
  );
};

export default HistoryRecords;
