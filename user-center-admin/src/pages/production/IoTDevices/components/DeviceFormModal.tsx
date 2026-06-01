import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message, InputNumber } from 'antd';
import { createIotDevice, updateIotDevice } from '@/services/api/iot';
import { getBaseOptions } from '@/services/api/base';
import { getPondOptions } from '@/services/api/pond';
import type { IoTDevice } from '@/types/model';
import dayjs from 'dayjs';

const { TextArea } = Input;

const DEVICE_TYPES = [
  { id: 1, typeName: '自动投喂机', typeCode: 'FEEDER' },
  { id: 2, typeName: '溶解氧传感器', typeCode: 'DO_METER' },
  { id: 3, typeName: 'pH传感器', typeCode: 'PH_METER' },
  { id: 4, typeName: '温度传感器', typeCode: 'TEMP_METER' },
  { id: 5, typeName: '增氧机', typeCode: 'AERATOR' },
  { id: 6, typeName: '水泵', typeCode: 'PUMP' },
];

interface DeviceFormModalProps {
  visible: boolean;
  editingDevice: IoTDevice | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({
  visible, editingDevice, onCancel, onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [baseOptions, setBaseOptions] = useState<{ label: string; value: number }[]>([]);
  const [pondOptions, setPondOptions] = useState<{ label: string; value: number }[]>([]);
  const isEdit = !!editingDevice;

  useEffect(() => {
    if (visible) {
      getBaseOptions().then(setBaseOptions);
      if (editingDevice?.baseId) {
        getPondOptions(editingDevice.baseId).then(setPondOptions);
      }
      if (editingDevice) {
        form.setFieldsValue({
          ...editingDevice,
          installTime: editingDevice.installTime ? dayjs(editingDevice.installTime) : undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1, port: 1883 });
      }
    }
  }, [visible, editingDevice]);

  const handleBaseChange = async (baseId: number) => {
    form.setFieldsValue({ pondId: undefined });
    const ponds = await getPondOptions(baseId);
    setPondOptions(ponds);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const body = {
        ...values,
        installTime: values.installTime ? values.installTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      if (isEdit && editingDevice?.id) {
        await updateIotDevice(editingDevice.id, body);
        message.success('设备已更新');
      } else {
        await createIotDevice(body);
        message.success('设备已添加');
      }
      onSuccess();
    } catch (err: any) {
      if (err?.message) message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑设备' : '添加设备'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText={isEdit ? '保存' : '添加'}
      cancelText="取消"
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="deviceName" label="设备名称" rules={[{ required: true, message: '请输入设备名称' }]}>
          <Input placeholder="如: 1号溶解氧传感器" />
        </Form.Item>
        <Form.Item name="deviceSn" label="设备序列号" rules={[{ required: true, message: '请输入设备序列号' }]}>
          <Input placeholder="如: DO-XM-001" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="typeId" label="设备类型" rules={[{ required: true, message: '请选择设备类型' }]}>
          <Select placeholder="选择设备类型" options={DEVICE_TYPES.map(t => ({ label: t.typeName + ' (' + t.typeCode + ')', value: t.id }))} />
        </Form.Item>
        <Form.Item name="baseId" label="所属基地" rules={[{ required: true, message: '请选择基地' }]}>
          <Select placeholder="选择基地" options={baseOptions} onChange={handleBaseChange} />
        </Form.Item>
        <Form.Item name="pondId" label="绑定塘口">
          <Select placeholder="选择塘口（可选）" options={pondOptions} allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select options={[
            { label: '在线', value: 1 },
            { label: '离线', value: 0 },
            { label: '维护中', value: 2 },
          ]} />
        </Form.Item>
                <Form.Item name="port" label="端口">
          <InputNumber style={{ width: '100%' }} placeholder="如: 1883" />
        </Form.Item>
        <Form.Item name="installTime" label="安装日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea rows={2} placeholder="设备备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceFormModal;
