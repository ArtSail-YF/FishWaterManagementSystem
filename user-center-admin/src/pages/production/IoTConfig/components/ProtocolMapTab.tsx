import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Modal, message, Table, Typography, Input, AutoComplete, Form } from 'antd';
import {
  getProtocolMapList,
  createProtocolMap,
  updateProtocolMap,
  deleteProtocolMap,
  type IoTProtocolMap,
} from '@/services/api/iot-protocol-map';
import { getMetricDefList, type MetricDef } from '@/services/api/iot-metric-def';
import { getDeviceTypeList, type IoTDeviceType } from '@/services/api/iot-device-type';

const { Text } = Typography;

interface Props {
  deviceTypeId: number;
}

const ProtocolMapTab: React.FC<Props> = ({ deviceTypeId }) => {
  const [maps, setMaps] = useState<IoTProtocolMap[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [metricDefs, setMetricDefs] = useState<MetricDef[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<IoTDeviceType[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMaps();
    loadOptions();
  }, [deviceTypeId]);

  const loadMaps = async () => {
    setLoading(true);
    try {
      const res = await getProtocolMapList(deviceTypeId);
      if (res.code === 200) setMaps(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const loadOptions = async () => {
    try {
      const [metricRes, dtRes] = await Promise.all([
        getMetricDefList(deviceTypeId),
        getDeviceTypeList(),
      ]);
      if (metricRes.code === 200) setMetricDefs(metricRes.data || []);
      if (dtRes.code === 200) setDeviceTypes(dtRes.data || []);
    } catch { /* ignore */ }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后设备将无法自动解析该字段',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteProtocolMap(id);
          message.success('已删除');
          loadMaps();
        } catch { message.error('删除失败'); }
      },
    });
  };

  const startAdd = () => {
    form.resetFields();
    form.setFieldsValue({ deviceTypeId });
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (record: IoTProtocolMap) => {
    form.setFieldsValue(record);
    setEditingId(record.id!);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updateProtocolMap(editingId, values);
        message.success('映射已更新');
      } else {
        await createProtocolMap(values);
        message.success('映射已创建');
      }
      cancelEdit();
      loadMaps();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('操作失败');
    }
  };

  const isEditingRow = (record: IoTProtocolMap) => editingId === record.id;

  const metricKeyOptions = metricDefs.map(m => ({
    label: `${m.displayName} (${m.metricKey})`,
    value: m.metricKey,
  }));

  const columns = [
    {
      title: '上报字段名',
      dataIndex: 'sourceField',
      width: 140,
      render: (_: any, record: IoTProtocolMap) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="sourceField" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Input size="small" placeholder="例如：DO" />
          </Form.Item>
        ) : (
          <code style={{ fontSize: 12, background: '#f5f5f5', padding: '1px 6px', borderRadius: 4 }}>{record.sourceField}</code>
        );
      },
    },
    {
      title: '映射指标键',
      dataIndex: 'metricKey',
      width: 220,
      render: (_: any, record: IoTProtocolMap) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="metricKey" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <AutoComplete
              size="small"
              style={{ width: 200 }}
              placeholder="输入或选择指标键"
              options={metricKeyOptions}
              filterOption={(inputValue, option) =>
                (option?.label as string)?.toLowerCase().includes(inputValue.toLowerCase()) ?? false
              }
            />
          </Form.Item>
        ) : (
          <code style={{ fontSize: 12, background: '#f5f5f5', padding: '1px 6px', borderRadius: 4 }}>{record.metricKey}</code>
        );
      },
    },
    {
      title: '设备SN',
      dataIndex: 'deviceSn',
      width: 130,
      render: (_: any, record: IoTProtocolMap) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="deviceSn" style={{ margin: 0 }}>
            <Input size="small" placeholder="留空表示全部" />
          </Form.Item>
        ) : (
          record.deviceSn || <Text type="secondary">全部</Text>
        );
      },
    },
    {
      title: '操作',
      width: 140,
      render: (_: any, record: IoTProtocolMap) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        if (editing) {
          return (
            <Space size={4}>
              <Button type="link" size="small" onClick={handleSave}>保存</Button>
              <Button type="link" size="small" onClick={cancelEdit}>取消</Button>
            </Space>
          );
        }
        return (
          <Space size={0}>
            <Button type="link" size="small" onClick={() => startEdit(record)}>编辑</Button>
            <Button type="link" size="small" danger onClick={() => handleDelete(record.id!)}>删除</Button>
          </Space>
        );
      },
    },
  ];

  const dataSource = isAdding
    ? [{ id: -1, deviceTypeId, sourceField: '', metricKey: '', deviceSn: '' } as IoTProtocolMap, ...maps]
    : maps;

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary">设备上报JSON中的字段名 → 系统指标键 映射关系</Text>
        {!isAdding && editingId === null && (
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={startAdd}>
            新增映射
          </Button>
        )}
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={r => (r.id ?? -1).toString()}
        loading={loading}
        size="small"
        pagination={false}
        locale={{ emptyText: isAdding ? '' : '暂无协议映射，点击上方"新增映射"添加' }}
      />
    </Form>
  );
};

export default ProtocolMapTab;
