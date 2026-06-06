import React, { useEffect, useState } from 'react';
import { Tabs, Descriptions, Button, Tag, Space, Form, Input, Select, message, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateDeviceType, type IoTDeviceType } from '@/services/api/iot-device-type';
import ProtocolMapTab from './ProtocolMapTab';
import CommandTab from './CommandTab';
import AlertRuleTab from './AlertRuleTab';

const PROTOCOL_OPTIONS = [
  { label: 'MQTT', value: 'MQTT' },
  { label: 'Modbus', value: 'Modbus' },
  { label: 'HTTP', value: 'HTTP' },
  { label: 'CoAP', value: 'CoAP' },
];

interface Props {
  deviceType: IoTDeviceType;
  onUpdated: () => void;
}

const DeviceTypeInfo: React.FC<Props> = ({ deviceType, onUpdated }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [deviceType]);

  const handleEdit = () => {
    form.setFieldsValue(deviceType);
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateDeviceType(deviceType.id!, values);
      message.success('基本信息已更新');
      setEditModalVisible(false);
      onUpdated();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('保存失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space size={12}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{deviceType.typeName}</span>
          {deviceType.typeCode && <Tag>{deviceType.typeCode}</Tag>}
          <Tag>{deviceType.status === 1 ? '启用' : '停用'}</Tag>
        </Space>
        <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>编辑基本信息</Button>
      </div>

      <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
        <Descriptions.Item label="类型编码">{deviceType.typeCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="通信协议">
          {deviceType.protocolType ? <Tag>{deviceType.protocolType}</Tag> : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="厂商">{deviceType.manufacturer || '-'}</Descriptions.Item>
        <Descriptions.Item label="状态">{deviceType.status === 1 ? '启用' : '停用'}</Descriptions.Item>
        <Descriptions.Item label="说明" span={2}>{deviceType.description || '-'}</Descriptions.Item>
      </Descriptions>

      <Tabs
        defaultActiveKey="protocol"
        items={[
          { key: 'protocol', label: '协议映射', children: <ProtocolMapTab deviceTypeId={deviceType.id!} /> },
          { key: 'command', label: '指令配置', children: <CommandTab deviceTypeId={deviceType.id!} /> },
          { key: 'alert', label: '预警规则', children: <AlertRuleTab deviceTypeId={deviceType.id!} /> },
        ]}
      />

      <Modal
        title="编辑品种信息"
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
        width={500}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="typeCode" label="类型编码">
            <Input placeholder="例如：FEEDER, DO_METER" />
          </Form.Item>
          <Form.Item name="typeName" label="类型名称" rules={[{ required: true, message: '请输入类型名称' }]}>
            <Input placeholder="例如：自动投喂机、溶解氧传感器" />
          </Form.Item>
          <Form.Item name="manufacturer" label="厂商">
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item name="protocolType" label="通信协议">
            <Select options={PROTOCOL_OPTIONS} placeholder="请选择" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{ label: '启用', value: 1 }, { label: '停用', value: 0 }]} />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea rows={3} placeholder="设备类型描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceTypeInfo;
