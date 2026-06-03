import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, WifiOutlined, ApiOutlined, PoweroffOutlined, ToolOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns, type ActionType } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Card, Row, Col, Statistic, Typography, Descriptions, Select, Dropdown } from 'antd';
const { Text } = Typography;
import { getLatestTsData } from '@/services/api/iot-ts-data';
import { searchIotDevices, deleteIotDevice, setDeviceStatus } from '@/services/api/iot';
import type { IoTDevice } from '@/types/model';
import DeviceConfigModal from './components/DeviceConfigModal';
import DeviceFormModal from './components/DeviceFormModal';
import DeviceControlModal from './components/DeviceControlModal';
import { searchTsData } from '@/services/api/iot-ts-data';

// 判断设备是否真正在线（5分钟内有心跳）
const isTrulyOnline = (device) => {
  if (!device.lastHeartbeat) return false;
  const diff = Date.now() - new Date(device.lastHeartbeat).getTime();
  return diff < 5 * 60 * 1000; // 5分钟内
};

const STATUS_MAP: Record<number, { label: string; bgColor: string; textColor: string }> = {
  1: { label: '在线', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  0: { label: '离线', bgColor: '#EBE5DE', textColor: '#7A6E64' },
  2: { label: '维护中', bgColor: '#F5EDD6', textColor: '#A0843A' },
};

const STATUS_OPTIONS = [
  { label: '在线', value: 1 },
  { label: '离线', value: 0 },
  { label: '维护中', value: 2 },
];

const DEVICE_TYPE_FILTERS = [
  { label: '全部', value: '' },
  { label: '自动投喂机', value: 1 },
  { label: '溶解氧传感器', value: 2 },
  { label: 'pH传感器', value: 3 },
  { label: '温度传感器', value: 4 },
  { label: '增氧机', value: 5 },
  { label: '水泵', value: 6 },
];

const [deviceMetrics, setDeviceMetrics] = useState<Record<number, any[]>>({});
const IoTDevices = () => {
  const actionRef = useRef<ActionType>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, maintenance: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [configDevice, setConfigDevice] = useState<IoTDevice | null>(null);
  const [detailDevice, setDetailDevice] = useState<IoTDevice | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [controlDevice, setControlDevice] = useState<IoTDevice | null>(null);

  const fetchStats = (list: any[]) => {
    const total = list.length;
    const trulyOnline = list.filter(d => isTrulyOnline(d)).length;
    const heartbeatExpired = list.filter(d => d.lastHeartbeat && !isTrulyOnline(d)).length;
    const neverConnected = list.filter(d => !d.lastHeartbeat).length;
    setStats({ total, online: trulyOnline, offline: neverConnected, maintenance: heartbeatExpired });
  };

  const fetchDevices = async (params: any = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...params };
      if (typeFilter) queryParams.typeId = typeFilter;
      const response = await searchIotDevices(queryParams);
      const list = response.data || [];
      setDevices(list);
      fetchStats(list);
      return { data: list, total: response.total || 0 };
    } catch (error) {
      message.error('获取设备列表失败');
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确认要删除该设备？删除后无法恢复',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteIotDevice(id);
          message.success('设备已删除');
          actionRef.current?.reload();
        } catch { message.error('删除失败，请重试'); }
      },
    });
  };

  const handleBatchDelete = (selectedRows: any[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: '确认要删除选中的 ' + selectedRows.length + ' 台设备吗？此操作不可撤销',
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            if (row.id) await deleteIotDevice(row.id);
          }
          message.success('已成功删除 ' + selectedRows.length + ' 台设备');
          actionRef.current?.reload();
        } catch { message.error('删除失败'); }
      },
    });
  };




  const handleCheckConnection = async (device: IoTDevice) => {
    try {
      const res: any = await getLatestTsData({ deviceId: device.id, pageSize: 1 });
      if (res?.data?.records?.length > 0 || res?.data?.length > 0) {
        message.success(`设备 ${device.deviceName} 连接正常`);
      } else if (device.lastHeartbeat) {
        message.info(`设备 ${device.deviceName} 最近心跳: ${device.lastHeartbeat}`);
      } else {
        message.warning(`设备 ${device.deviceName} 无心跳数据，可能未连接`);
      }
    } catch {
      message.error('检测失败，请检查 MQTT 连接');
    }
  };

  const handleStatusChange = async (device: IoTDevice, newStatus: number) => {
    try {
      await setDeviceStatus(device.id!, newStatus);
      message.success('设备状态已切换');
      actionRef.current?.reload();
    } catch { message.error('状态切换失败'); }
  };

  const columns: ProColumns<IoTDevice>[] = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: 180,
      fixed: 'left',
      render: (_, r) => <>{r.deviceName || '-'}</>,
    },
    {
      title: '序列号',
      dataIndex: 'deviceSn',
      width: 130,
      copyable: true,
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      width: 120,
      render: (_, r) => r.typeName ? r.typeName + (r.typeCode ? ' (' + r.typeCode + ')' : '') : '-',
    },
    {
      title: '所在基地',
      dataIndex: 'baseName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '绑定塘口',
      dataIndex: 'pondName',
      width: 110,
      render: (val) => val || '-',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      width: 100,
      render: (_, r) => {
        const trulyOnline = isTrulyOnline(r);
        const statusLabel = STATUS_MAP[r.status ?? -1];
        const label = trulyOnline ? (statusLabel?.label || '-') : (r.lastHeartbeat ? '连接超时' : '未连接');
        const bgColor = trulyOnline ? '#E2EDD8' : r.lastHeartbeat ? '#FFF3CD' : '#EBE5DE';
        const textColor = trulyOnline ? '#5B8C5A' : r.lastHeartbeat ? '#856404' : '#7A6E64';
        return (
          <Dropdown
            menu={{
              items: STATUS_OPTIONS.map(s => ({
                key: String(s.value),
                label: s.label,
              })),
              onClick: ({ key }) => handleStatusChange(r, Number(key)),
            }}
            trigger={['click']}
          >
            <Tag style={{ backgroundColor: bgColor, color: textColor, border: 'none', cursor: 'pointer' }}
              title={'心跳: ' + (r.lastHeartbeat || '无')}>
              {label} ▾
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setDetailDevice(record); setDetailModalVisible(true); }}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingDevice(record); setFormModalVisible(true); }}>编辑</Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => { setConfigDevice(record); setConfigModalVisible(true); }} style={{ color: '#8c8c8c' }}>配置</Button><Button type="link" size="small" icon={<WifiOutlined />} onClick={() => handleCheckConnection(record)} style={{ color: '#1890ff' }}>检测</Button>
          <Button type="link" size="small" icon={<ApiOutlined />} onClick={() => { setControlDevice(record); setControlModalVisible(true); }} style={{ color: '#722ed1' }}>控制</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id!)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={6}><Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic title={<Text type="secondary" style={{ fontSize: '12px' }}>设备总数</Text>} value={stats.total}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }} prefix={<ApiOutlined style={{ color: '#8C8C8C' }} />} />
        </Card></Col>
        <Col span={6}><Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic title={<Text type="secondary" style={{ fontSize: '12px' }}>真在线</Text>} value={stats.online}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }} prefix={<WifiOutlined style={{ color: '#8C8C8C' }} />} />
        </Card></Col>
        <Col span={6}><Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic title={<Text type="secondary" style={{ fontSize: '12px' }}>未连接</Text>} value={stats.offline}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }} prefix={<PoweroffOutlined style={{ color: '#8C8C8C' }} />} />
        </Card></Col>
        <Col span={6}><Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic title={<Text type="secondary" style={{ fontSize: '12px' }}>心跳超时</Text>} value={stats.maintenance}
            valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }} prefix={<ToolOutlined style={{ color: '#8C8C8C' }} />} />
        </Card></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Text strong>设备类型：</Text>
          <Select value={typeFilter} onChange={(val) => { setTypeFilter(val); actionRef.current?.reload(); }}
            style={{ width: 150 }} options={DEVICE_TYPE_FILTERS.map(t => ({ label: t.label, value: t.value }))} />
        </Space>
      </Card>

      <ProTable<IoTDevice>
        actionRef={actionRef}
        headerTitle="IoT 设备列表"
        columns={columns}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: true }}
        request={async (params: any = {}) => {
          const queryParams = { ...params };
          if (typeFilter) queryParams.typeId = typeFilter;
          const result = await fetchDevices(queryParams);
          return { data: result.data, success: true, total: result.total };
        }}
        rowSelection={{ selectedRowKeys, onChange: keys => setSelectedRowKeys(keys) }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => (
          <Space size={24}><span>已选 <a style={{ fontWeight: 600 }}>{keys.length}</a> 项</span><a onClick={onCleanSelected}>取消选择</a></Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
          <Space size={16}>
            <Button size="small" icon={<DeleteOutlined />} onClick={() => handleBatchDelete(selectedRows)} style={{ color: '#8c8c8c' }}>批量删除</Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDevice(null); setFormModalVisible(true); }}>添加设备</Button>,
        ]}
        size="small"
        scroll={{ x: 1500 }}
      />

      <Modal title={null} open={detailModalVisible} onCancel={() => { setDetailModalVisible(false); setDetailDevice(null); }}
        footer={null} closable width={500} destroyOnClose>
        {detailDevice && (() => {
          const d = detailDevice;
          return (
            <div style={{ padding: '4px 0' }}>
              <Descriptions title="设备信息" column={2} size="small" bordered style={{ marginBottom: 20 }}>
                <Descriptions.Item label="所在基地" span={2}>{d.baseName || '-'}</Descriptions.Item>
                <Descriptions.Item label="绑定塘口">{d.pondName || '未绑定'}</Descriptions.Item>
                <Descriptions.Item label="序列号">{d.deviceSn || '-'}</Descriptions.Item>
                <Descriptions.Item label="设备型号">{d.typeName ? d.typeName + (d.typeCode ? ' (' + d.typeCode + ')' : '') : '-'}</Descriptions.Item>
                <Descriptions.Item label="运行状态"><Tag color={d.status === 1 ? 'success' : d.status === 0 ? 'default' : 'warning'}>{d.statusText || '-'}</Tag></Descriptions.Item>
              </Descriptions>
              <Descriptions title="技术信息" column={2} size="small" bordered>
                <Descriptions.Item label="IP 地址">{d.ipAddress || '-'}</Descriptions.Item>
                <Descriptions.Item label="端口号">{d.port != null ? String(d.port) : '-'}</Descriptions.Item>
                <Descriptions.Item label="安装日期">{d.installTime || '-'}</Descriptions.Item>
                <Descriptions.Item label="最近心跳">{d.lastHeartbeat || '-'}</Descriptions.Item>
                <Descriptions.Item label="备注" span={2}>{d.remark || '无'}</Descriptions.Item>
              </Descriptions>
            </div>
          );
        })()}
      </Modal>

      <DeviceConfigModal visible={configModalVisible} deviceId={configDevice?.id || 0}
        deviceName={configDevice?.deviceName || ''}
        onCancel={() => { setConfigModalVisible(false); setConfigDevice(null); }} />

      <DeviceFormModal visible={formModalVisible} editingDevice={editingDevice}
        onCancel={() => { setFormModalVisible(false); setEditingDevice(null); }}
        onSuccess={() => { setFormModalVisible(false); setEditingDevice(null); actionRef.current?.reload(); }} />
    <DeviceControlModal visible={controlModalVisible} device={controlDevice}
        onCancel={() => { setControlModalVisible(false); setControlDevice(null); }} />
    </PageContainer>
  );
};

export default IoTDevices;
