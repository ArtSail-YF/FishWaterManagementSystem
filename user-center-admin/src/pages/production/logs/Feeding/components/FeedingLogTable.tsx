import { PlusOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Space, Tag, Typography, Modal, message } from 'antd';
import React, { useState } from 'react';
import BatchFeedingModal from './BatchFeedingModal';
import dayjs from 'dayjs';

const { Text } = Typography;

export type FeedingLogItem = {
  id: string;
  time: string;
  pondId: string;
  feedType: string;
  amount: number;
  method: 'auto' | 'manual';
  operator: string;
  status: 'normal' | 'low' | 'high';
  remarks?: string;
};

const FeedingLogTable: React.FC = () => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<FeedingLogItem[]>([]);

  /**
   * 模拟数据导出逻辑
   */
  const handleExport = (data: FeedingLogItem[], fileName: string = '投喂记录报表') => {
    if (data.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    
    const hide = message.loading(`正在准备 ${fileName}...`, 0);
    
    setTimeout(() => {
      hide();
      Modal.success({
        title: '导出成功',
        content: (
          <div>
            <p>已成功生成 <b>{fileName}.xlsx</b></p>
            <p>包含记录: <span className="fin-number">{data.length}</span> 条</p>
            <p>总投喂量: <span className="fin-number" style={{ color: '#1890ff', fontWeight: 600 }}>
              {data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)} kg
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<FeedingLogItem>[] = [
    {
      title: '投喂时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      width: 160,
      render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text>,
    },
    {
      title: '池塘编号',
      dataIndex: 'pondId',
      width: 100,
      render: (text) => <Tag color="blue" style={{ borderRadius: '2px', fontSize: '11px', margin: 0 }}>{text}</Tag>,
    },
    {
      title: '饲料品种',
      dataIndex: 'feedType',
      width: 120,
    },
    {
      title: '投喂量 (kg)',
      dataIndex: 'amount',
      width: 100,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number" strong style={{ fontSize: '13px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '投喂方式',
      dataIndex: 'method',
      width: 100,
      valueEnum: {
        auto: { text: '智能自动', status: 'Processing' },
        manual: { text: '人工投喂', status: 'Default' },
      },
    },
    {
      title: '记录人/代填',
      dataIndex: 'operator',
      width: 120,
      render: (text: any) => (
        <Space size={4}>
          <Text style={{ fontSize: '12px' }}>{text}</Text>
          {text.includes('代录') && <Tag color="cyan" style={{ fontSize: '10px', scale: '0.85', margin: 0 }}>代填</Tag>}
        </Space>
      )
    },
    {
      title: '摄食状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        normal: { text: '正常', status: 'Success' },
        low: { text: '摄食下降', status: 'Error' },
        high: { text: '摄食旺盛', status: 'Warning' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
    },
  ];

  const mockData: FeedingLogItem[] = [
    { id: '1', time: '2026-03-27 18:30:00', pondId: 'P001', feedType: '1.5mm 高蛋白', amount: 45.2, method: 'auto', operator: '系统自动', status: 'normal', remarks: '定时任务执行' },
    { id: '2', time: '2026-03-27 18:15:00', pondId: 'P003', feedType: '1.5mm 高蛋白', amount: 38.5, method: 'manual', operator: '王大牛', status: 'high', remarks: '补投 5kg' },
    { id: '3', time: '2026-03-27 17:45:00', pondId: 'P002', feedType: '1.0mm 幼鱼料', amount: 12.0, method: 'auto', operator: '代录文员-张晓明', status: 'low', remarks: '摄食欲望一般，水温偏低' },
    { id: '4', time: '2026-03-27 12:00:00', pondId: 'P001', feedType: '1.5mm 高蛋白', amount: 42.0, method: 'auto', operator: '系统自动', status: 'normal' },
    { id: '5', time: '2026-03-27 08:30:00', pondId: 'P001', feedType: '1.5mm 高蛋白', amount: 45.0, method: 'auto', operator: '系统自动', status: 'normal' },
  ];

  return (
    <Card 
      className="fin-card" 
      variant="borderless" 
      styles={{ body: { padding: '0' } }}
    >
      <ProTable<FeedingLogItem>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={false}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button 
              type="link" 
              icon={<ExportOutlined />} 
              onClick={() => handleExport(selectedRowsState, `投喂批量导出_${dayjs().format('YYYYMMDD')}`)}
            >
              导出报表
            </Button>
          </Space>
        )}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        size="small"
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>投喂明细流水 / FEEDING LOGS</span>}
        toolBarRender={() => [
          <Button 
            key="export" 
            icon={<ExportOutlined />} 
            onClick={() => handleExport(mockData, `全量投喂记录_${dayjs().format('YYYYMMDD')}`)}
          >
            导出全部
          </Button>,
          <Button 
            key="batch" 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={() => setBatchModalVisible(true)}
            style={{ borderRadius: '2px' }}
          >
            批量代填 (文员专用)
          </Button>,
          <Button 
            key="add" 
            icon={<PlusOutlined />}
            style={{ borderRadius: '2px' }}
          >
            单笔录入
          </Button>,
        ]}
      />

      <BatchFeedingModal 
        visible={batchModalVisible} 
        onCancel={() => setBatchModalVisible(false)}
        onSuccess={() => setBatchModalVisible(false)}
      />
    </Card>
  );
};

export default FeedingLogTable;
