import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, WifiOutlined, ApiOutlined, SettingOutlined, PoweroffOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns, type ActionType } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Card, Row, Col, Statistic, Typography, Descriptions } from 'antd';

const { Text } = Typography;
import {
  searchIotDevices,
  createIotDevice,
  updateIotDevice,
  deleteIotDevice,
  setDeviceStatus,
} from '@/services/api/iot';
import type { IoTDevice } from '@/types/model';
import DeviceConfigModal from './components/DeviceConfigModal';

const STATUS_MAP = {
  1: { label: '在线', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  0: { label: '离线', bgColor: '#EBE5DE', textColor: '#7A6E64' },
  2: { label: '维护中', bgColor: '#F5EDD6', textColor: '#A0843A' },
};

const IoTDevices = () => {
  const actionRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, maintenance: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [configDevice, setConfigDevice] = useState(null);
  const [detailDevice, setDetailDevice] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const fetchStats = async (list) => {
    const total = list.length;
    const online = list.filter(d => d.status === 1).length;
    const offline = list.filter(d => d.status === 0).length;
    const maintenance = list.filter(d => d.status === 2).length;
    setStats({ total, online, offline, maintenance });
  };

  const fetchDevices = async (params = {}) => {
    setLoading(true);
    try {
      const response = await searchIotDevices(params);
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确认要删除该设备？删除后无法恢复',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteIotDevice(id);
          message.success('设备已删除');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败，请重试');
        }
      },
    });
  };

  const handleBatchDelete = (selectedRows) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确认要删除选中的 ${selectedRows.length} 台设备吗？此操作不可撤销`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            if (row.id) await deleteIotDevice(row.id);
          }
          message.success(`已成功删除 ${selectedRows.length} 台设备`);
          actionRef.current?.reload();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const renderStatus = (status) => {
    const c = STATUS_MAP[status ?? -1];
    return c ? (
      <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none' }}>
        {c.label}
      </Tag>
    ) : '-';
  };

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: 180,
      fixed: 'left',
      render: (_, r) => <>{r.deviceName || '-'}</>,
    },
    {
      title: '设备型号',
      dataIndex: 'typeName',
      width: 120,
      render: (_, r) => r.typeName ? `${r.typeName} (${r.typeCode || ''})` : '-',
    },
    {
      title: '绑定塘口',
      dataIndex: 'pondName',
      width: 110,
      render: (val) => val || '-',
    },
    {
      title: '所在基地',
      dataIndex: 'baseName',
      width: 120,
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      width: 80,
      render: (_, r) => renderStatus(r.status),
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      render: (_, record) => [
        <Button type="link" size="small" icon={<EyeOutlined />} key="view" onClick={async () => {
          setDetailDevice(record);
          setDetailModalVisible(true);
        }}>
          查看
        </Button>,
        <Button type="link" size="small" icon={<SettingOutlined />} key="config" onClick={() => {
          setConfigDevice(record);
          setConfigModalVisible(true);
        }} style={{ color: '#8c8c8c' }}>
          配置
        </Button>,
        <Button type="link" size="small" icon={<EditOutlined />} key="edit" onClick={() => {
          message.info('编辑功能待开发');
        }} style={{ color: '#8c8c8c' }}>
          编辑
        </Button>,
        ...(record.status === 0 || record.status === 1 ? [
          <Button type="link" size="small" icon={<PoweroffOutlined />} key="toggle" onClick={async () => {
            const newStatus = record.status === 1 ? 0 : 1;
            try {
              await setDeviceStatus(record.id, newStatus);
              message.success(newStatus === 1 ? '设备已启动' : '设备已关闭');
              actionRef.current?.reload();
            } catch { message.error('操作失败'); }
          }} style={{ color: record.status === 1 ? '#B54E3C' : '#8c8c8c' }}>
            {record.status === 1 ? '关闭' : '启动'}
          </Button>,
        ] : []),
        <Button type="link" size="small" icon={<DeleteOutlined />} key="delete" onClick={() => handleDelete(record.id)} style={{ color: '#8c8c8c' }}>
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>设备总数</Text>}
              value={stats.total}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }}
              prefix={<ApiOutlined style={{ color: '#8C8C8C' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>在线</Text>}
              value={stats.online}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }}
              prefix={<WifiOutlined style={{ color: '#8C8C8C' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>离线</Text>}
              value={stats.offline}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }}
              prefix={<ApiOutlined style={{ color: '#8C8C8C' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>维护中</Text>}
              value={stats.maintenance}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', color: '#2C2416' }}
              prefix={<ApiOutlined style={{ color: '#8C8C8C' }} />}
            />
          </Card>
        </Col>
      </Row>

      <ProTable
        actionRef={actionRef}
        headerTitle="IoT 设备列表"
        columns={columns}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={async (params = {}) => {
          const result = await fetchDevices(params);
          return { data: result.data, success: true, total: result.total };
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: keys => setSelectedRowKeys(keys),
        }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选 <a style={{ fontWeight: 600 }}>{keys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
          <Space size={16}>
            <Button size="small" icon={<DeleteOutlined />} onClick={() => handleBatchDelete(selectedRows)} style={{ color: '#8c8c8c' }}>
              批量删除
            </Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => {
            message.info('添加设备功能待开发');
          }}>
            添加设备
          </Button>,
        ]}
        size="small"
        scroll={{ x: 1400 }}
      />
      <Modal
        title={null}
        open={detailModalVisible}
        onCancel={() => { setDetailModalVisible(false); setDetailDevice(null); }}
        footer={null}
        closable
        width={500}
        destroyOnClose
      >
        {detailDevice && (() => {
          const d = detailDevice;
          const sl = d.status === 1 ? '在线' : d.status === 0 ? '离线' : '维护中';
          return (
            <div style={{ padding: '4px 0' }}>
              <Descriptions title="设备信息" column={2} size="small" bordered style={{ marginBottom: 20 }}>
                <Descriptions.Item label="所在基地" span={2}>{d.baseName || '-'}</Descriptions.Item>
                <Descriptions.Item label="绑定塘口">{d.pondName || '未绑定'}</Descriptions.Item>
                <Descriptions.Item label="序列号">{d.deviceSn || '-'}</Descriptions.Item>
                <Descriptions.Item label="设备型号">{d.typeName ? d.typeName + (d.typeCode ? ' (' + d.typeCode + ')' : '') : '-'}</Descriptions.Item>
                <Descriptions.Item label="运行状态"><Tag color={d.status === 1 ? 'success' : d.status === 0 ? 'default' : 'warning'}>{sl}</Tag></Descriptions.Item>
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

      <DeviceConfigModal
        visible={configModalVisible}
        deviceId={configDevice?.id || 0}
        deviceName={configDevice?.deviceName || ''}
        onCancel={() => {
          setConfigModalVisible(false);
          setConfigDevice(null);
        }}
      />

    </PageContainer>
  );
};

export default IoTDevices;
