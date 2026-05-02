import { PlusOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Progress, Space, Tag, Typography, Modal, message, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import BatchMedicineModal from './BatchMedicineModal';
import MedicineModal from '../../components/MedicineModal';
import dayjs from 'dayjs';
import { getProductionLogs } from '@/services/api/logs';
import { MOCK_MEDICINE_LOGS } from '@/services/api/mock';

const { Text } = Typography;
const { Option } = Select;

const MedicineLogTable: React.FC = () => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [medicineModalVisible, setMedicineModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<Pond.ProductionLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Pond.ProductionLogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'pond' | 'cage' | 'workboat'>('pond');
  const [editingRecord, setEditingRecord] = useState<Pond.ProductionLogItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProductionLogs('medicine');
      setData(res.data || []);
    } catch (error) {
      console.error('获取用药记录失败，使用降级数据:', error);
      setData(MOCK_MEDICINE_LOGS);
      message.warning('当前展示为用药模拟数据');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 模拟数据导出逻辑
   */
  const handleExport = (dataList: Pond.ProductionLogItem[], fileName: string = '用药记录报表') => {
    if (dataList.length === 0) {
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
            <p>包含记录: <span className="fin-number">{dataList.length}</span> 条</p>
            <p>涉及药物: <span style={{ color: '#722ed1', fontWeight: 600 }}>
              {Array.from(new Set(dataList.map(item => item.details?.medicineName || '未知'))).join(', ')}
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<Pond.ProductionLogItem>[] = [
    {
      title: '用药时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      width: 160,
      render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 80,
      valueEnum: {
        pond: { text: '塘口', status: 'Processing' },
        cage: { text: '网箱', status: 'Default' },
        workboat: { text: '工船', status: 'Success' },
      },
      filters: [
        { text: '塘口', value: 'pond' },
        { text: '网箱', value: 'cage' },
        { text: '工船', value: 'workboat' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '编号',
      dataIndex: 'categoryName',
      width: 100,
      render: (text) => <Tag color="blue" style={{ borderRadius: '2px', fontSize: '11px', margin: 0 }}>{text}</Tag>,
    },
    {
      title: '行为摘要',
      dataIndex: 'content',
      width: 180,
      ellipsis: true,
    },
    {
      title: '药物品种',
      dataIndex: ['details', 'medicineName'],
      width: 120,
    },
    {
      title: '剂量 (g/ml)',
      dataIndex: ['details', 'dose'],
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
      dataIndex: ['details', 'reason'],
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
      key: 'withdrawal',
      width: 180,
      render: (_, record) => {
        const details = record.details || {};
        const withdrawalRemaining = details.withdrawalRemaining || 0;
        const withdrawalDays = details.withdrawalDays || 1;
        const status = details.status;

        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <Text type={status === 'locked' ? 'danger' : 'secondary'}>
                {status === 'locked' ? '锁定中' : '安全'}
              </Text>
              <Text className="fin-number">剩 {withdrawalRemaining} 天</Text>
            </div>
            <Progress 
              percent={Math.max(0, (1 - withdrawalRemaining / withdrawalDays) * 100)} 
              size="small" 
              showInfo={false}
              strokeColor={status === 'locked' ? '#ff4d4f' : '#52c41a'}
            />
          </Space>
        );
      },
    },
    {
      title: '记录人/代填',
      dataIndex: 'operator',
      width: 120,
      render: (text: any) => (
        <Space size={4}>
          <Text style={{ fontSize: '12px' }}>{text}</Text>
          {text?.includes('代录') || text?.includes('技术员') ? (
            <Tag color="cyan" style={{ fontSize: '10px', scale: '0.85', margin: 0 }}>代填</Tag>
          ) : null}
        </Space>
      )
    },
    {
      title: '备注',
      dataIndex: ['details', 'remarks'],
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setMedicineModalVisible(true);
  };

  const handleEdit = (record: Pond.ProductionLogItem) => {
    setEditingRecord(record);
    setMedicineModalVisible(true);
  };

  const handleMedicineSuccess = (values: any) => {
    // 模拟添加/更新数据
    if (editingRecord) {
      // 更新逻辑
      message.success('更新成功');
    } else {
      // 添加逻辑
      message.success('添加成功');
    }
    setMedicineModalVisible(false);
    fetchData();
  };

  return (
    <Card 
      className="fin-card" 
      variant="borderless" 
      styles={{ body: { padding: '0' } }}
    >
      <ProTable<Pond.ProductionLogItem>
        columns={columns}
        dataSource={data}
        loading={loading}
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
          <Select 
            key="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 100 }}
          >
            <Option value="pond">塘口</Option>
            <Option value="cage">网箱</Option>
            <Option value="workboat">工船</Option>
          </Select>,
          <Button 
            key="export" 
            icon={<ExportOutlined />} 
            onClick={() => handleExport(data, `全量用药记录_${dayjs().format('YYYYMMDD')}`)}
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
            onClick={handleAdd}
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

      <MedicineModal
        visible={medicineModalVisible}
        type={selectedCategory}
        initialValues={editingRecord}
        onCancel={() => setMedicineModalVisible(false)}
        onSuccess={handleMedicineSuccess}
      />
    </Card>
  );
};

export default MedicineLogTable;
