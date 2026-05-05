import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, FileTextOutlined, FishOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Badge, Card, Row, Col, Statistic, Select } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

// 捕捞记录数据类型定义
export interface FishingRecordItem {
  id: string;
  date: string;
  pondName: string;
  facilityCategory: 'pond' | 'cage' | 'workboat' | 'none';
  species: string;
  weight: number;
  unit: string;
  method: 'net' | 'trap' | 'hook' | 'other';
  team: string;
  operator: string;
  status: 'completed' | 'in_progress' | 'planned';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockData: FishingRecordItem[] = [
  {
    id: 'F001',
    date: '2024-01-15',
    pondName: '一号塘口',
    facilityCategory: 'pond',
    species: '南美白对虾',
    weight: 1500,
    unit: 'kg',
    method: 'net',
    team: '捕捞一组',
    operator: '张三',
    status: 'completed',
    notes: '正常捕捞，虾体健康',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'F002',
    date: '2024-01-16',
    pondName: '二号网箱',
    facilityCategory: 'cage',
    species: '罗非鱼',
    weight: 800,
    unit: 'kg',
    method: 'net',
    team: '捕捞二组',
    operator: '李四',
    status: 'completed',
    notes: '网箱捕捞，鱼体规格均匀',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
  },
  {
    id: 'F003',
    date: '2024-01-17',
    pondName: '三号工船',
    facilityCategory: 'workboat',
    species: '海鲈鱼',
    weight: 500,
    unit: 'kg',
    method: 'hook',
    team: '捕捞三组',
    operator: '王五',
    status: 'in_progress',
    notes: '工船作业中',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
  },
  {
    id: 'F004',
    date: '2024-01-18',
    pondName: '四号塘口',
    facilityCategory: 'pond',
    species: '草鱼',
    weight: 2000,
    unit: 'kg',
    method: 'net',
    team: '捕捞一组',
    operator: '张三',
    status: 'planned',
    notes: '计划明天捕捞',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
];

// 统计组件 - 简化版本，移除图标
const FishingStats: React.FC<{ data: FishingRecordItem[] }> = ({ data }) => {
  const completedCount = data.filter(item => item.status === 'completed').length;
  const inProgressCount = data.filter(item => item.status === 'in_progress').length;
  const plannedCount = data.filter(item => item.status === 'planned').length;
  
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
  
  const speciesStats = {
    '南美白对虾': data.filter(item => item.species === '南美白对虾').length,
    '罗非鱼': data.filter(item => item.species === '罗非鱼').length,
    '海鲈鱼': data.filter(item => item.species === '海鲈鱼').length,
    '草鱼': data.filter(item => item.species === '草鱼').length,
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card className="fin-card" bodyStyle={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
            {totalWeight} kg
          </div>
          <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
            总捕捞量
          </div>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
            累计捕捞总量
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="fin-card" bodyStyle={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
            {data.length} 条
          </div>
          <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
            捕捞记录
          </div>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
            <Tag color="green">完成: {completedCount}</Tag>
            <Tag color="orange">进行中: {inProgressCount}</Tag>
            <Tag color="blue">计划: {plannedCount}</Tag>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="fin-card" bodyStyle={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
            {new Set(data.map(item => item.team)).size} 组
          </div>
          <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
            作业团队
          </div>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
            活跃捕捞团队
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="fin-card" bodyStyle={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
            {Object.keys(speciesStats).length} 种
          </div>
          <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
            养殖品种
          </div>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
            多样化养殖
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const FishingRecords: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<FishingRecordItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'in_progress' | 'planned'>('all');

  // 批量删除处理
  const handleBatchDelete = (selectedRows: FishingRecordItem[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条捕捞记录吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        message.success(`已成功删除 ${selectedRows.length} 条捕捞记录`);
        setSelectedRows([]);
      },
    });
  };

  // 批量导出处理
  const handleBatchExport = (selectedRows: FishingRecordItem[]) => {
    message.loading('正在生成导出文件...');
    setTimeout(() => {
      message.success(`已成功导出 ${selectedRows.length} 条捕捞记录数据 (Excel格式)`);
    }, 1000);
  };

  // 设施分类渲染
  const renderFacilityCategory = (category: string) => {
    const categoryMap = {
      pond: { color: 'blue', text: '塘口' },
      cage: { color: 'green', text: '网箱' },
      workboat: { color: 'orange', text: '工船' },
      none: { color: 'default', text: '未关联' },
    };
    const config = categoryMap[category as keyof typeof categoryMap] || categoryMap.none;
    return <Tag color={config.color} variant="filled" style={{ borderRadius: '2px' }}>{config.text}</Tag>;
  };

  // 捕捞方法渲染
  const renderMethod = (method: string) => {
    const methodMap = {
      net: { color: 'blue', text: '网捕' },
      trap: { color: 'green', text: '陷阱' },
      hook: { color: 'orange', text: '钩钓' },
      other: { color: 'default', text: '其他' },
    };
    const config = methodMap[method as keyof typeof methodMap] || methodMap.other;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 状态渲染
  const renderStatus = (status: string) => {
    const statusMap = {
      completed: { color: 'success', text: '已完成' },
      in_progress: { color: 'processing', text: '进行中' },
      planned: { color: 'default', text: '计划中' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status || '未知' };
    return <Badge status={config.color as any} text={config.text} />;
  };

  // 表格列定义
  const columns: ProColumns<FishingRecordItem>[] = [
    {
      title: '捕捞日期',
      dataIndex: 'date',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '塘口名称',
      dataIndex: 'pondName',
      width: 120,
    },
    {
      title: '设施分类',
      dataIndex: 'facilityCategory',
      width: 100,
      valueEnum: {
        pond: { text: '塘口', color: 'blue' },
        cage: { text: '网箱', color: 'green' },
        workboat: { text: '工船', color: 'orange' },
        none: { text: '未关联', color: 'default' },
      },
      render: (category) => renderFacilityCategory(category as string),
    },
    {
      title: '养殖品种',
      dataIndex: 'species',
      width: 120,
      valueEnum: {
        '南美白对虾': { text: '南美白对虾' },
        '罗非鱼': { text: '罗非鱼' },
        '海鲈鱼': { text: '海鲈鱼' },
        '草鱼': { text: '草鱼' },
      },
    },
    {
      title: '捕捞重量',
      dataIndex: 'weight',
      width: 100,
      search: false,
      render: (weight, record) => <span>{weight} {record.unit}</span>,
      sorter: (a, b) => a.weight - b.weight,
    },
    {
      title: '捕捞方法',
      dataIndex: 'method',
      width: 100,
      valueEnum: {
        net: { text: '网捕' },
        trap: { text: '陷阱' },
        hook: { text: '钩钓' },
        other: { text: '其他' },
      },
      render: (method) => renderMethod(method as string),
    },
    {
      title: '作业团队',
      dataIndex: 'team',
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        completed: { text: '已完成', status: 'Success' },
        in_progress: { text: '进行中', status: 'Processing' },
        planned: { text: '计划中', status: 'Default' },
      },
      render: (status) => renderStatus(status as string),
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        <Button 
          key="edit" 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => {
            message.info(`编辑捕捞记录: ${record.pondName}`);
          }}
        >
          编辑
        </Button>,
        <Button 
          key="delete" 
          type="link" 
          danger 
          size="small" 
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '删除确认',
              content: `确定要删除 ${record.pondName} 的捕捞记录吗？`,
              onOk: () => {
                message.success('捕捞记录删除成功');
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <FishingStats data={mockData} />
      
      <ProTable<FishingRecordItem>
        headerTitle="捕捞记录清单"
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleBatchDelete(selectedRowsState)}
              >
                批量删除
              </Button>
              <Button 
                type="link" 
                icon={<ExportOutlined />} 
                onClick={() => handleBatchExport(selectedRowsState)}
              >
                批量导出
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Select 
            key="status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 120 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="completed">已完成</Option>
            <Option value="in_progress">进行中</Option>
            <Option value="planned">计划中</Option>
          </Select>,
          <Button 
            key="export" 
            icon={<ExportOutlined />} 
            onClick={() => handleBatchExport(mockData)}
          >
            导出全部
          </Button>,
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              message.info('新增捕捞记录');
            }}
          >
            新增记录
          </Button>,
        ]}
        size="small"
        bordered
      />
    </PageContainer>
  );
};

export default FishingRecords;