import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Modal, message, Table, Typography, Input, Select, InputNumber, Switch, Form } from 'antd';
import {
  getCommandList,
  createCommand,
  updateCommand,
  deleteCommand,
  type IoTDeviceTypeCommand,
} from '@/services/api/iot-device-type-command';

const { Text } = Typography;

interface Props {
  deviceTypeId: number;
}

const CommandTab: React.FC<Props> = ({ deviceTypeId }) => {
  const [commands, setCommands] = useState<IoTDeviceTypeCommand[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCommands();
  }, [deviceTypeId]);

  const loadCommands = async () => {
    setLoading(true);
    try {
      const res = await getCommandList(deviceTypeId);
      if (res.code === 200) setCommands(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后设备控制弹窗中将不再显示该指令',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCommand(id);
          message.success('已删除');
          loadCommands();
        } catch { message.error('删除失败'); }
      },
    });
  };

  const startAdd = () => {
    form.resetFields();
    form.setFieldsValue({ deviceTypeId, isStop: 0, sortOrder: 1, isActive: 1 });
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (record: IoTDeviceTypeCommand) => {
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
        await updateCommand(editingId, values);
        message.success('指令已更新');
      } else {
        await createCommand(values);
        message.success('指令已创建');
      }
      cancelEdit();
      loadCommands();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('操作失败');
    }
  };

  const isEditingRow = (record: IoTDeviceTypeCommand) => editingId === record.id;

  const columns = [
    {
      title: '指令键',
      dataIndex: 'commandKey',
      width: 140,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="commandKey" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Input size="small" placeholder="例如：feed_once" />
          </Form.Item>
        ) : (
          <code style={{ background: '#f5f5f5', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>{record.commandKey}</code>
        );
      },
    },
    {
      title: '指令名称',
      dataIndex: 'commandName',
      width: 130,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="commandName" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Input size="small" placeholder="例如：一次性投喂" />
          </Form.Item>
        ) : (
          record.commandName
        );
      },
    },
    {
      title: '确认文案',
      dataIndex: 'confirmText',
      width: 160,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="confirmText" style={{ margin: 0 }}>
            <Input size="small" placeholder="可选" />
          </Form.Item>
        ) : (
          record.confirmText || <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: '停止指令',
      dataIndex: 'isStop',
      width: 90,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="isStop" style={{ margin: 0 }}>
            <Select size="small" style={{ width: 70 }} options={[{ label: '否', value: 0 }, { label: '是', value: 1 }]} />
          </Form.Item>
        ) : (
          record.isStop === 1 ? <Text type="danger">是</Text> : <Text>否</Text>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 70,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="sortOrder" style={{ margin: 0 }}>
            <InputNumber size="small" min={0} style={{ width: 60 }} />
          </Form.Item>
        ) : (
          record.sortOrder ?? '-'
        );
      },
    },
    {
      title: '启用',
      dataIndex: 'isActive',
      width: 60,
      render: (_: any, record: IoTDeviceTypeCommand) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="isActive" style={{ margin: 0 }} valuePropName="checked">
            <Switch checkedValue={1} unCheckedValue={0} size="small" />
          </Form.Item>
        ) : (
          record.isActive === 1 ? <Text>启用</Text> : <Text type="secondary">停用</Text>
        );
      },
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: IoTDeviceTypeCommand) => {
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
    ? [{ id: -1, deviceTypeId, commandKey: '', commandName: '' } as IoTDeviceTypeCommand, ...commands]
    : commands;

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary">该品种设备支持的控制指令，在设备控制弹窗中展示</Text>
        {!isAdding && editingId === null && (
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={startAdd}>
            新增指令
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
        locale={{ emptyText: isAdding ? '' : '暂无指令配置，点击上方"新增指令"添加' }}
      />
    </Form>
  );
};

export default CommandTab;
