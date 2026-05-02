import { PlusOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Space, Tag, Typography, Modal, message, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import BatchFeedingModal from './BatchFeedingModal';
import FeedingModal from '../../components/FeedingModal';
import dayjs from 'dayjs';
import { getProductionLogs } from '@/services/api/logs';
import { MOCK_FEEDING_LOGS } from '@/services/api/mock';

const { Text } = Typography;
const { Option } = Select;

const FeedingLogTable: React.FC = () => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<Pond.ProductionLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Pond.ProductionLogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'pond' | 'cage' | 'workboat'>('pond');
  const [editingRecord, setEditingRecord] = useState<Pond.ProductionLogItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProductionLogs('feeding');
      setData(res.data || []);
    } catch (error) {
      console.error('获取投喂记录失败，使用降级数据:', error);
      setData(MOCK_FEEDING_LOGS);
      message.warning('当前展示为投喂模拟数据');
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
  const handleExport = (dataList: Pond.ProductionLogItem[], fileName: string = '投喂记录报表') => {
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
            <p>涉及总投喂: <span className="fin-number" style={{ color: '#1890ff', fontWeight: 600 }}>
              {dataList.reduce((sum, item) => sum + (item.details?.amount || 0), 0).toFixed(2)} kg
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<Pond.ProductionLogItem>[] = [
    {
      title: '投喂时间',
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
      render: (text, record) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '方式',
      dataIndex: ['details', 'method'],
      width: 80,
      valueEnum: {
        auto: { text: '智能', status: 'Processing' },
        manual: { text: '人工', status: 'Default' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        normal: { text: '正常', status: 'Success' },
        low: { text: '偏低', status: 'Warning' },
        high: { text: '偏高', status: 'Error' },
      },
    },
    {
      title: '记录人',
      dataIndex: 'operator',
      width: 100,
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
    setFeedingModalVisible(true);
  };

  const handleEdit = (record: Pond.ProductionLogItem) => {
    setEditingRecord(record);
    setFeedingModalVisible(true);
  };

  const handleFeedingSuccess = (values: any) => {
    // 模拟添加/更新数据
    if (editingRecord) {
      // 更新逻辑
      message.success('更新成功');
    } else {
      // 添加逻辑
      message.success('添加成功');
    }
    setFeedingModalVisible(false);
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
            onClick={() => handleExport(data, `全量投喂记录_${dayjs().format('YYYYMMDD')}`)}
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
            onClick={handleAdd}
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

      <FeedingModal
        visible={feedingModalVisible}
        type={selectedCategory}
        initialValues={editingRecord}
        onCancel={() => setFeedingModalVisible(false)}
        onSuccess={handleFeedingSuccess}
      />
    </Card>
  );
};

export default FeedingLogTable;
