import {
  PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, ReloadOutlined, EyeOutlined,
  BarsOutlined, FileTextOutlined, CheckCircleOutlined, SyncOutlined,
  ClockCircleOutlined, TagOutlined, UserOutlined, DatabaseOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Card, Row, Col, Statistic, Typography, Descriptions } from 'antd';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { searchHarvestRecords, deleteHarvestRecord } from '@/services/api/harvest-record';

const { Text } = Typography;

const STATUS_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  completed: { label: '已完成', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  in_progress: { label: '进行中', bgColor: '#F5EDD6', textColor: '#A0843A' },
  planned: { label: '计划中', bgColor: '#EBE5DE', textColor: '#5C4F42' },
};

const METHOD_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  net: { label: '网捕', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  trap: { label: '陷阱', bgColor: '#F5EDD6', textColor: '#A0843A' },
  hook: { label: '钩钓', bgColor: '#EBE5DE', textColor: '#5C4F42' },
  other: { label: '其他', bgColor: '#EBE5DE', textColor: '#7A6E64' },
};

const FishingRecords: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, weight: 0, completed: 0, inProgress: 0 });
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await searchHarvestRecords({ current: 1, pageSize: 999 });
      if (res.success) {
        const records = res.data || [];
        setStats({
          total: records.length,
          weight: records.reduce((s: number, r: any) => s + (r.weight || 0), 0),
          completed: records.filter((r: any) => r.status === 'completed').length,
          inProgress: records.filter((r: any) => r.status === 'in_progress').length,
        });
      }
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleView = (record: any) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const columns: ProColumns<any>[] = [
    { title: '记录编号', dataIndex: 'recordNo', width: 120, render: (t) => t || '-' },
    { title: '时间', dataIndex: 'harvestTime', width: 150,
      render: (_, r) => r.harvestTime ? dayjs(r.harvestTime).format('MM-DD HH:mm') : '-',
    },
    { title: '品种', dataIndex: 'species', width: 100 },
    { title: '重量', dataIndex: 'weight', width: 100, align: 'right',
      render: (t, r) => <Text className="fin-number" strong>{t} {r.unit || 'kg'}</Text>,
    },
    {
      title: '捕捞方式', dataIndex: 'method', width: 100,
      render: (_, r) => {
        const c = METHOD_MAP[r.method as string];
        return c ? <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none', fontSize: '11px' }}>{c.label}</Tag> : (r.method || '-');
      },
    },
    { title: '作业班组', dataIndex: 'teamName', width: 100 },
    { title: '操作人', dataIndex: 'operatorName', width: 100 },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (_, r) => {
        const c = STATUS_MAP[r.status as string];
        return c ? <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none', fontSize: '11px' }}>{c.label}</Tag> : (r.status || '-');
      },
    },
    { title: '备注', dataIndex: 'remark', width: 200, ellipsis: true },
    {
      title: '操作', valueType: 'option', fixed: 'right', width: 180,
      render: (_, record) => [
        <Button key="view" type="link" size="small" icon={<EyeOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => handleView(record)}>查看</Button>,
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => message.info('编辑捕捞记录: ' + (record.recordNo || record.id))}>编辑</Button>,
        <Button key="delete" type="link" size="small" icon={<DeleteOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => {
            Modal.confirm({ title: '删除确认', content: '确定要删除该捕捞记录吗？', onOk: async () => { await deleteHarvestRecord(record.id); message.success('删除成功'); } });
          }}>删除</Button>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>总捕捞量</Text>}
              value={stats.weight}
              suffix="kg"
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<BarsOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>捕捞记录</Text>}
              value={stats.total}
              suffix="条"
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已完成</Text>}
              value={stats.completed}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>进行中</Text>}
              value={stats.inProgress}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SyncOutlined spin={stats.inProgress > 0} />}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<any>
        headerTitle="捕捞记录清单"
        columns={columns}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const res = await searchHarvestRecords({ current: params.current, pageSize: params.pageSize });
          return { data: res.data || [], success: res.success, total: res.total };
        }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        rowSelection={{ onChange: (_, rows) => setSelectedRows(rows) }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}><span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span><a onClick={onCleanSelected}>取消选择</a></Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}><Button type="link" icon={<ExportOutlined />} style={{ color: '#8c8c8c' }}>导出报表</Button></Space>
        )}
        toolBarRender={() => [
          <Button key="refresh" icon={<ReloadOutlined />} style={{ color: '#8c8c8c', borderColor: '#d9d9d9' }} onClick={() => { fetchStats(); }}>刷新</Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />}>新增记录</Button>,
        ]}
        size="small"
        scroll={{ x: 1200 }}
      />

      <Modal title="捕捞记录详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700} destroyOnClose>
        <Card size="small" style={{ marginBottom: 16, background: '#F7F3EF' }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<><BarsOutlined style={{ marginRight: 4 }} />记录摘要</>}>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>{detailRecord?.recordNo || '捕捞记录 #' + detailRecord?.id}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label={<><FileTextOutlined style={{ marginRight: 4 }} />记录编号</>}>{detailRecord?.recordNo || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><ClockCircleOutlined style={{ marginRight: 4 }} />时间</>}>{detailRecord?.harvestTime ? dayjs(detailRecord.harvestTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label={<><TagOutlined style={{ marginRight: 4 }} />品种</>}>{detailRecord?.species || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><BarsOutlined style={{ marginRight: 4 }} />重量</>}>
            <Text className="fin-number" strong>{detailRecord?.weight ? detailRecord.weight + ' ' + (detailRecord.unit || 'kg') : '-'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="捕捞方式">
            {detailRecord ? (METHOD_MAP[detailRecord.method as string]?.label || detailRecord.method || '-') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {detailRecord ? <Tag style={{ backgroundColor: (STATUS_MAP[detailRecord.status as string]?.bgColor || '#f0f0f0'), color: (STATUS_MAP[detailRecord.status as string]?.textColor || '#666'), border: 'none' }}>{STATUS_MAP[detailRecord.status as string]?.label || detailRecord.status}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined style={{ marginRight: 4 }} />作业班组</>}>{detailRecord?.teamName || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined style={{ marginRight: 4 }} />操作人</>}>{detailRecord?.operatorName || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<><DatabaseOutlined style={{ marginRight: 4 }} />创建时间</>}>{detailRecord?.createdAt || detailRecord?.createTime || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default FishingRecords;