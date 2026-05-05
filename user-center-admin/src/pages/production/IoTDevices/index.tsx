import { PlusOutlined, WifiOutlined, ApiOutlined, SettingOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Badge, Card, Row, Col, Statistic, Progress } from 'antd';
import React, { useState } from 'react';

// IoT 设备数据类型定义
export interface IoTDeviceItem {
  id: string;
  deviceId: string;
  name: string;
  type: 'sensor' | 'gateway' | 'controller' | 'camera';
  status: 'online' | 'offline' | 'error';
  location: string;
  pondId: string;
  pondName: string;
  firmwareVersion: string;
  lastCommunication: string;
  batteryLevel?: number;
  signalStrength?: number;
  dataPoints: number;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockData: IoTDeviceItem[] = [
  {
    id: 'D001',
    deviceId: 'SENSOR-001',
    name: '水质传感器-1号塘',
    type: 'sensor',
    status: 'online',
    location: '1号精养塘-东北角',
    pondId: 'P001',
    pondName: '1号精养塘',
    firmwareVersion: 'v1.2.3',
    lastCommunication: '2024-01-15 14:30:25',
    batteryLevel: 85,
    signalStrength: 92,
    dataPoints: 1250,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 'D002',
    deviceId: 'GATEWAY-001',
    name: '网关设备-中心区域',
    type: 'gateway',
    status: 'online',
    location: '养殖基地中心',
    pondId: 'P001',
    pondName: '1号精养塘',
    firmwareVersion: 'v2.1.0',
    lastCommunication: '2024-01-15 14:28:10',
    batteryLevel: 100,
    signalStrength: 95,
    dataPoints: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 'D003',
    deviceId: 'CAMERA-001',
    name: '监控摄像头-南侧',
    type: 'camera',
    status: 'error',
    location: '1号精养塘-南侧',
    pondId: 'P001',
    pondName: '1号精养塘',
    firmwareVersion: 'v1.5.2',
    lastCommunication: '2024-01-14 09:15:30',
    batteryLevel: 45,
    signalStrength: 78,
    dataPoints: 320,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
  },
  {
    id: 'D004',
    deviceId: 'SENSOR-002',
    name: '温度传感器-2号塘',
    type: 'sensor',
    status: 'offline',
    location: '2号混养塘-西侧',
    pondId: 'P002',
    pondName: '2号混养塘',
    firmwareVersion: 'v1.2.1',
    lastCommunication: '2024-01-13 16:45:20',
    batteryLevel: 25,
    signalStrength: 65,
    dataPoints: 890,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13',
  },
  {
    id: 'D005',
    deviceId: 'CONTROLLER-001',
    name: '投喂控制器',
    type: 'controller',
    status: 'online',
    location: '1号精养塘-投喂区',
    pondId: 'P001',
    pondName: '1号精养塘',
    firmwareVersion: 'v1.8.0',
    lastCommunication: '2024-01-15 14:25:15',
    batteryLevel: 92,
    signalStrength: 88,
    dataPoints: 560,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
];

// 统计组件
const IoTDeviceStats: React.FC<{ data: IoTDeviceItem[] }> = ({ data }) => {
  const onlineCount = data.filter(item => item.status === 'online').length;
  const offlineCount = data.filter(item => item.status === 'offline').length;
  const errorCount = data.filter(item => item.status === 'error').length;
  const onlineRate = data.length > 0 ? (onlineCount / data.length) * 100 : 0;
  
  const totalDataPoints = data.reduce((sum, item) => sum + item.dataPoints, 0);
  const avgBatteryLevel = data.reduce((sum, item) => sum + (item.batteryLevel || 0), 0) / data.length;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="设备总数"
            value={data.length}
            suffix="台"
            valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            prefix={<WifiOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <Tag color="green" size="small">在线: {onlineCount}</Tag>
            <Tag color="orange" size="small">离线: {offlineCount}</Tag>
            <Tag color="red" size="small">异常: {errorCount}</Tag>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="设备在线率"
            value={onlineRate}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            prefix={<ApiOutlined />}
          />
          <div style={{ marginTop: 8 }}>
            <Progress percent={onlineRate} size="small" strokeColor="#52c41a" showInfo={false} />
            <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
              <span>运行状态</span>
              <span>{onlineRate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="数据采集总量"
            value={totalDataPoints}
            suffix="条"
            valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            prefix={<SettingOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span>今日新增: 125条</span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="平均电池电量"
            value={avgBatteryLevel}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#722ed1', fontFamily: 'AlibabaSans' }}
            prefix={<ReloadOutlined />}
          />
          <div style={{ marginTop: 8 }}>
            <Progress percent={avgBatteryLevel} size="small" strokeColor="#722ed1" showInfo={false} />
            <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
              <span>电量状态</span>
              <span>{avgBatteryLevel.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const IoTDevices: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<IoTDeviceItem[]>([]);

  // 批量删除处理
  const handleBatchDelete = (selectedRows: IoTDeviceItem[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 个设备吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        message.success(`已成功删除 ${selectedRows.length} 个设备`);
        setSelectedRows([]);
      },
    });
  };

  // 批量导出处理
  const handleBatchExport = (selectedRows: IoTDeviceItem[]) => {
    message.loading('正在生成导出文件...');
    setTimeout(() => {
      message.success(`已成功导出 ${selectedRows.length} 条设备数据 (Excel格式)`);
    }, 1000);
  };

  // 设备状态渲染
  const renderStatus = (status: string) => {
    const statusMap = {
      online: { color: 'success', text: '在线' },
      offline: { color: 'default', text: '离线' },
      error: { color: 'error', text: '异常' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status || '未知' };
    return <Badge status={config.color as any} text={config.text} />;
  };

  // 设备类型渲染
  const renderType = (type: string) => {
    const typeMap = {
      sensor: { color: 'blue', text: '传感器' },
      gateway: { color: 'green', text: '网关' },
      controller: { color: 'orange', text: '控制器' },
      camera: { color: 'purple', text: '摄像头' },
    };
    const config = typeMap[type as keyof typeof typeMap] || { color: 'default', text: type || '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ProColumns<IoTDeviceItem>[] = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      copyable: true,
      fixed: 'left',
      width: 120,
      render: (dom) => <span className="fin-number">{dom}</span>,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: {
        sensor: { text: '传感器', color: 'blue' },
        gateway: { text: '网关', color: 'green' },
        controller: { text: '控制器', color: 'orange' },
        camera: { text: '摄像头', color: 'purple' },
      },
      render: (type) => renderType(type as string),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        online: { text: '在线', status: 'Success' },
        offline: { text: '离线', status: 'Default' },
        error: { text: '异常', status: 'Error' },
      },
      render: (status) => renderStatus(status as string),
    },
    {
      title: '所属塘口',
      dataIndex: 'pondName',
      width: 120,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '电池电量',
      dataIndex: 'batteryLevel',
      width: 120,
      render: (level) => (
        <Space>
          <Progress 
            percent={level || 0} 
            size="small" 
            strokeColor={level && level > 20 ? '#52c41a' : '#ff4d4f'} 
            format={() => `${level}%`}
            style={{ width: 60 }}
          />
        </Space>
      ),
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      width: 120,
      render: (strength) => (
        <Space>
          <WifiOutlined style={{ color: strength && strength > 80 ? '#52c41a' : strength && strength > 60 ? '#faad14' : '#ff4d4f' }} />
          <span>{strength}%</span>
        </Space>
      ),
    },
    {
      title: '固件版本',
      dataIndex: 'firmwareVersion',
      width: 100,
    },
    {
      title: '最后通信',
      dataIndex: 'lastCommunication',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: '数据点数',
      dataIndex: 'dataPoints',
      width: 100,
      render: (count) => <span className="fin-number">{count}</span>,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (_, record) => [
        <Button 
          key="edit" 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => {
            message.info(`编辑设备: ${record.name}`);
          }}
        >
          编辑
        </Button>,
        <Button 
          key="config" 
          type="link" 
          size="small" 
          icon={<SettingOutlined />}
          onClick={() => {
            message.info(`配置设备: ${record.name}`);
          }}
        >
          配置
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
              content: `确定要删除设备 ${record.name} 吗？`,
              onOk: () => {
                message.success('设备删除成功');
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
      <IoTDeviceStats data={mockData} />
      
      <ProTable<IoTDeviceItem>
        headerTitle="IoT 设备列表"
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
                icon={<ReloadOutlined />} 
                onClick={() => message.info('正在批量刷新设备状态...')}
              >
                批量刷新
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            添加设备
          </Button>,
        ]}
        size="small"
        bordered
      />
    </PageContainer>
  );
};

export default IoTDevices;