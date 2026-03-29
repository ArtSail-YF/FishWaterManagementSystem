import { PlusOutlined, VideoCameraOutlined, ApiOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Badge } from 'antd';
import React, { useState } from 'react';
import DeviceHubDrawer from './components/DeviceHubDrawer';
import PondManagementStats from './components/PondManagementStats';

export interface PondManagementItem {
  id: string;
  name: string;
  type: string;
  area: number;
  depth: number;
  videoStatus: 'online' | 'offline' | 'error';
  videoUrl?: string;
  sensorCount: number;
  iotNodes: string[];
  status: 'active' | 'inactive';
}

const PondManagement: React.FC = () => {
  const [deviceDrawerVisible, setDeviceDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<PondManagementItem | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<PondManagementItem[]>([]);

  // 模拟数据
  const mockData: PondManagementItem[] = [
    {
      id: 'P001',
      name: '1号精养塘',
      type: '南美白对虾',
      area: 5.5,
      depth: 1.8,
      videoStatus: 'online',
      videoUrl: 'rtsp://admin:12345@192.168.1.100:554/ch1/main',
      sensorCount: 3,
      iotNodes: ['NODE-001', 'NODE-002', 'NODE-003'],
      status: 'active',
    },
    {
      id: 'P002',
      name: '2号育苗塘',
      type: '蟹苗',
      area: 2.1,
      depth: 1.2,
      videoStatus: 'offline',
      sensorCount: 1,
      iotNodes: ['NODE-005'],
      status: 'active',
    },
    {
      id: 'P003',
      name: '3号暂养池',
      type: '混养',
      area: 3.2,
      depth: 1.5,
      videoStatus: 'online',
      videoUrl: 'rtsp://admin:12345@192.168.1.102:554/ch1/main',
      sensorCount: 2,
      iotNodes: ['NODE-007', 'NODE-008'],
      status: 'active',
    },
  ];

  /**
   * 批量删除
   * @param selectedRows 
   */
  const handleBatchDelete = (selectedRows: PondManagementItem[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 个塘口吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        message.success(`已成功删除 ${selectedRows.length} 个塘口资产`);
        setSelectedRows([]);
      },
    });
  };

  /**
   * 批量导出
   */
  const handleBatchExport = (selectedRows: PondManagementItem[]) => {
    message.loading('正在生成导出文件...');
    setTimeout(() => {
      message.success(`已成功导出 ${selectedRows.length} 条塘口数据 (Excel格式)`);
    }, 1000);
  };

  const columns: ProColumns<PondManagementItem>[] = [
    {
      title: '塘口编号',
      dataIndex: 'id',
      copyable: true,
      fixed: 'left',
      width: 100,
      render: (dom) => <span className="fin-number">{dom}</span>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '养殖类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        '南美白对虾': { text: '南美白对虾' },
        '蟹苗': { text: '蟹苗' },
        '混养': { text: '混养' },
      },
    },
    {
      title: '规格 (亩/m)',
      dataIndex: 'area',
      render: (_, record) => (
        <Space>
          <span className="fin-number">{record.area}</span>
          <span style={{ color: '#999' }}>/</span>
          <span className="fin-number">{record.depth}</span>
        </Space>
      ),
    },
    {
      title: '视频监控',
      dataIndex: 'videoStatus',
      render: (status) => {
        const statusMap = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'default', text: '离线' },
          error: { color: 'error', text: '故障' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: 'IoT 设备',
      dataIndex: 'sensorCount',
      render: (count) => (
        <Space>
          <ApiOutlined style={{ color: '#1890ff' }} />
          <span className="fin-number">{count}</span>
          <span style={{ fontSize: '12px', color: '#999' }}>个节点</span>
        </Space>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 220,
      render: (_, record) => [
        <Button 
          key="edit" 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => {
            message.info('编辑塘口基础信息');
          }}
        >
          编辑
        </Button>,
        <Button 
          key="device" 
          type="link" 
          size="small" 
          icon={<SettingOutlined />}
          onClick={() => {
            setCurrentRow(record);
            setDeviceDrawerVisible(true);
          }}
        >
          配置设备
        </Button>,
        <Button 
          key="delete" 
          type="link" 
          size="small" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除塘口 ${record.name} 及其所有关联资产吗？`,
              onOk: () => message.success('已删除'),
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
      <PondManagementStats />
      <ProTable<PondManagementItem>
        headerTitle="塘口资产列表"
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
                icon={<PlusOutlined style={{ transform: 'rotate(45deg)' }} />} 
                onClick={() => handleBatchExport(selectedRowsState)}
              >
                批量导出
              </Button>
              <Button 
                type="link" 
                icon={<SettingOutlined />} 
                onClick={() => message.info('正在批量更新设备协议...')}
              >
                批量协议更新
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建塘口
          </Button>,
        ]}
        size="small"
        bordered
      />

      <DeviceHubDrawer
        visible={deviceDrawerVisible}
        onClose={() => setDeviceDrawerVisible(false)}
        pond={currentRow}
      />
    </PageContainer>
  );
};

export default PondManagement;
