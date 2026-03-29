import { PlusOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Progress, Space, Tag, Typography, Modal, message } from 'antd';
import React, { useState } from 'react';
import BatchMedicineModal from './BatchMedicineModal';
import dayjs from 'dayjs';

const { Text } = Typography;

export type MedicineLogItem = {
  id: string;
  time: string;
  pondId: string;
  medicineName: string;
  dose: number;
  reason: string;
  withdrawalDays: number;
  withdrawalRemaining: number;
  operator: string;
  status: 'locked' | 'safe';
  remarks?: string;
};

const MedicineLogTable: React.FC = () => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<MedicineLogItem[]>([]);

  /**
   * 模拟数据导出逻辑
   */
  const handleExport = (data: MedicineLogItem[], fileName: string = '用药记录报表') => {
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
            <p>涉及药物: <span style={{ color: '#722ed1', fontWeight: 600 }}>
              {Array.from(new Set(data.map(item => item.medicineName))).join(', ')}
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<MedicineLogItem>[] = [
    {
      title: '用药时间',
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
      title: '药物品种',
      dataIndex: 'medicineName',
      width: 120,
    },
    {
      title: '剂量 (g/ml)',
      dataIndex: 'dose',
      width: 100,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number" strong style={{ fontSize: '13px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '用药原因',
      dataIndex: 'reason',
      width: 120,
      valueEnum: {
        '预防': { text: '预防性消毒', status: 'Default' },
        '烂鳃病': { text: '烂鳃病治疗', status: 'Error' },
        '肠炎': { text: '肠炎治疗', status: 'Error' },
        '寄生虫': { text: '寄生虫治理', status: 'Warning' },
      },
    },
    {
      title: '休药期状态',
      dataIndex: 'withdrawalRemaining',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <Text type={record.status === 'locked' ? 'danger' : 'secondary'}>
              {record.status === 'locked' ? '锁定中' : '安全'}
            </Text>
            <Text className="fin-number">剩 {record.withdrawalRemaining} 天</Text>
          </div>
          <Progress 
            percent={Math.max(0, (1 - record.withdrawalRemaining / record.withdrawalDays) * 100)} 
            size="small" 
            showInfo={false}
            strokeColor={record.status === 'locked' ? '#ff4d4f' : '#52c41a'}
          />
        </Space>
      ),
    },
    {
      title: '记录人/代填',
      dataIndex: 'operator',
      width: 120,
      render: (text: any) => (
        <Space size={4}>
          <Text style={{ fontSize: '12px' }}>{text}</Text>
          {text.includes('代录') || text.includes('技术员') ? (
            <Tag color="cyan" style={{ fontSize: '10px', scale: '0.85', margin: 0 }}>代填</Tag>
          ) : null}
        </Space>
      )
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
    },
  ];

  const mockData: MedicineLogItem[] = [
    { id: '1', time: '2026-03-27 10:30:00', pondId: 'P005', medicineName: '聚维酮碘', dose: 120, reason: '预防', withdrawalDays: 7, withdrawalRemaining: 7, operator: '技术员-李工', status: 'locked', remarks: '常规消毒' },
    { id: '2', time: '2026-03-27 09:15:00', pondId: 'P012', medicineName: '恩诺沙星', dose: 50, reason: '肠炎', withdrawalDays: 15, withdrawalRemaining: 15, operator: '技术员-李工', status: 'locked', remarks: '部分鱼只出现肠炎迹象' },
    { id: '3', time: '2026-03-20 17:45:00', pondId: 'P002', medicineName: '三黄散', dose: 200, reason: '预防', withdrawalDays: 3, withdrawalRemaining: 0, operator: '代录文员-张晓明', status: 'safe', remarks: '拌料投喂' },
    { id: '4', time: '2026-03-15 12:00:00', pondId: 'P001', medicineName: '二氧化氯', dose: 100, reason: '预防', withdrawalDays: 0, withdrawalRemaining: 0, operator: '系统自动', status: 'safe' },
  ];

  return (
    <Card 
      className="fin-card" 
      variant="borderless" 
      styles={{ body: { padding: '0' } }}
    >
      <ProTable<MedicineLogItem>
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
              onClick={() => handleExport(selectedRowsState, `用药批量导出_${dayjs().format('YYYYMMDD')}`)}
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
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>用药明细流水 / MEDICINE LOGS</span>}
        toolBarRender={() => [
          <Button 
            key="export" 
            icon={<ExportOutlined />} 
            onClick={() => handleExport(mockData, `全量用药记录_${dayjs().format('YYYYMMDD')}`)}
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
            批量代填 (文员/技术员专用)
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

      <BatchMedicineModal 
        visible={batchModalVisible} 
        onCancel={() => setBatchModalVisible(false)}
        onSuccess={() => setBatchModalVisible(false)}
      />
    </Card>
  );
};

export default MedicineLogTable;
