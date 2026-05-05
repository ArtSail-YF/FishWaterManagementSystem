import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect } from 'react';
import type { SysDictType } from '@/types';
import { createSysDictType, updateSysDictType } from '@/services/api/dict';

const { Option } = Select;

interface DictTypeModalProps {
  visible: boolean;
  actionType: 'create' | 'edit';
  record?: SysDictType;
  onClose: () => void;
  onSuccess: () => void;
}

const DictTypeModal: React.FC<DictTypeModalProps> = ({
  visible,
  actionType,
  record,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
    }
  }, [visible, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (actionType === 'create') {
        await createSysDictType(values);
        message.success('创建成功');
      } else {
        await updateSysDictType({
          ...values,
          id: record!.id!,
        });
        message.success('更新成功');
      }
      
      onSuccess();
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={actionType === 'create' ? '新建字典类型' : '编辑字典类型'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="dictTypeForm"
      >
        <Form.Item
          name="dictType"
          label="字典类型"
          rules={[
            { required: true, message: '请输入字典类型' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: '字典类型只能包含字母、数字、下划线和连字符' }
          ]}
        >
          <Input placeholder="请输入字典类型，如：pond_type" />
        </Form.Item>

        <Form.Item
          name="dictName"
          label="字典名称"
          rules={[{ required: true, message: '请输入字典名称' }]}
        >
          <Input placeholder="请输入字典名称，如：塘口类型" />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
          initialValue="active"
        >
          <Select placeholder="请选择状态">
            <Option value="active">启用</Option>
            <Option value="inactive">停用</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入字典类型描述"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DictTypeModal;