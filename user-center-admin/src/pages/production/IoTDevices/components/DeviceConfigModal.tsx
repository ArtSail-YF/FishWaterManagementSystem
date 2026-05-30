import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDeviceConfigs, saveDeviceConfigs, type DeviceConfigItem } from '@/services/api/deviceConfig';

interface DeviceConfigModalProps {
  visible: boolean;
  deviceId: number;
  deviceName: string;
  onCancel: () => void;
}

const DeviceConfigModal: React.FC<DeviceConfigModalProps> = ({ visible, deviceId, deviceName, onCancel }) => {
  const [configs, setConfigs] = useState<DeviceConfigItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const res = await getDeviceConfigs(deviceId);
      setConfigs(res.data || []);
    } catch {
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && deviceId) {
      loadConfigs();
    }
  }, [visible, deviceId]);

  const addRow = () => {
    setConfigs(prev => [...prev, { paramKey: '', paramValue: '' }]);
  };

  const removeRow = (index: number) => {
    setConfigs(prev => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof DeviceConfigItem, value: string) => {
    setConfigs(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    // 校验
    for (const item of configs) {
      if (!item.paramKey.trim()) {
        message.warning('参数键不能为空');
        return;
      }
      if (!item.paramValue.trim()) {
        message.warning('参数值不能为空');
        return;
      }
    }

    setSaving(true);
    try {
      await saveDeviceConfigs(deviceId, configs);
      message.success('配置已保存');
      onCancel();
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: '参数键',
      dataIndex: 'paramKey',
      width: 220,
      render: (val: string, _: any, index: number) => (
        <Input
          size="small"
          value={val}
          placeholder="如: REPORT_INTERVAL"
          onChange={e => updateRow(index, 'paramKey', e.target.value)}
          style={{ width: 200 }}
        />
      ),
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      width: 220,
      render: (val: string, _: any, index: number) => (
        <Input
          size="small"
          value={val}
          placeholder="如: 300"
          onChange={e => updateRow(index, 'paramValue', e.target.value)}
          style={{ width: 200 }}
        />
      ),
    },
    {
      title: '操作',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Popconfirm title="确定删除这条配置吗？" onConfirm={() => removeRow(index)}>
          <DeleteOutlined style={{ color: '#999', cursor: 'pointer' }} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={`设备配置 - ${deviceName}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={saving}
      okText="保存配置"
      cancelText="取消"
      width={560}
      destroyOnClose
    >
      <Table
        dataSource={configs}
        columns={columns}
        rowKey={(_, index) => String(index)}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        style={{ marginBottom: 8 }}
      />
      <Button type="dashed" icon={<PlusOutlined />} onClick={addRow} block>
        添加参数
      </Button>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        常见参数键：REPORT_INTERVAL（上报间隔秒数）、ALARM_THRESHOLD_HIGH（高值告警）、ALARM_THRESHOLD_LOW（低值告警）
      </div>
    </Modal>
  );
};

export default DeviceConfigModal;
