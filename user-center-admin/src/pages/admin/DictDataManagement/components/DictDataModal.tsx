import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import type { SysDictData } from '@/types';
import { createSysDictData, updateSysDictData } from '@/services/api/dict';

const { Option } = Select;

interface DictDataModalProps {
  visible: boolean;
  actionType: 'create' | 'edit';
  record?: SysDictData;
  dictTypes: { dictType: string; dictName: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

const DictDataModal: React.FC<DictDataModalProps> = ({
  visible,
  actionType,
  record,
  dictTypes,
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
        await createSysDictData(values);
        message.success('创建成功');
      } else {
        await updateSysDictData({
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
      title={actionType === 'create' ? '新建字典数据' : '编辑字典数据'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="dictDataForm"
      >
        <Form.Item
          name="dictType"
          label="字典类型"
          rules={[{ required: true, message: '请选择字典类型' }]}
        >
          <Select placeholder="请选择字典类型">
            {dictTypes.map(item => (
              <Option key={item.dictType} value={item.dictType}>
                {item.dictName} ({item.dictType})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dictLabel"
          label="字典标签"
          rules={[{ required: true, message: '请输入字典标签' }]}
        >
          <Input placeholder="请输入字典标签" />
        </Form.Item>

        <Form.Item
          name="dictValue"
          label="字典值"
          rules={[{ required: true, message: '请输入字典值' }]}
        >
          <Input placeholder="请输入字典值" />
        </Form.Item>

        <Form.Item
          name="sortOrder"
          label="排序"
          rules={[{ required: true, message: '请输入排序值' }]}
          initialValue={0}
        >
          <InputNumber
            min={0}
            max={999}
            placeholder="请输入排序值"
            style={{ width: '100%' }}
          />
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
      </Form>
    </Modal>
  );
};

export default DictDataModal;