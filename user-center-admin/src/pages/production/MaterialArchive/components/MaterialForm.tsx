import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import type { MatCategory } from '@/services/api/material/category';

interface MaterialInfo {
  id: number;
  matCode: string;
  matName: string;
  catId: number;
  spec: string;
  unit: string;
  supplierId: number;
  minStock: number;
  maxStock: number;
  status: number;
  withdrawalDays: number;
  unitPrice: number;
  approvalCode: string;
  manufacturer: string;
}

interface MaterialFormProps {
  visible: boolean;
  editingMaterial: MaterialInfo | null;
  categories: MatCategory[];
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  visible,
  editingMaterial,
  categories,
  loading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  console.log('MaterialForm 收到的分类数据:', categories);

  useEffect(() => {
    if (visible) {
      if (editingMaterial) {
        form.setFieldsValue(editingMaterial);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1 });
      }
    }
  }, [visible, editingMaterial, form, categories]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  return (
    <Modal
      title={editingMaterial ? '编辑物资' : '新建物资'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
        <Form.Item
          name="matCode"
          label="物资编码"
          rules={[{ required: true, message: '请输入物资编码' }]}
        >
          <Input placeholder="请输入物资编码" />
        </Form.Item>

        <Form.Item
          name="matName"
          label="物资名称"
          rules={[{ required: true, message: '请输入物资名称' }]}
        >
          <Input placeholder="请输入物资名称" />
        </Form.Item>

        <Form.Item
          name="catId"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类" loading={categories.length === 0}>
            {categories.length > 0 && categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.catName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="spec" label="规格">
          <Input placeholder="请输入规格" />
        </Form.Item>

        <Form.Item name="unit" label="单位">
          <Input placeholder="请输入单位" />
        </Form.Item>

        <Form.Item name="unitPrice" label="参考单价">
          <InputNumber style={{ width: '100%' }} placeholder="请输入参考单价" min={0} />
        </Form.Item>

        <Form.Item name="manufacturer" label="生产厂家">
          <Input placeholder="请输入生产厂家" />
        </Form.Item>

        <Form.Item name="approvalCode" label="批准文号">
          <Input placeholder="请输入批准文号" />
        </Form.Item>

        <Form.Item name="withdrawalDays" label="休药期(天)">
          <InputNumber style={{ width: '100%' }} placeholder="请输入休药期" min={0} />
        </Form.Item>

        <Form.Item name="minStock" label="最低库存">
          <InputNumber style={{ width: '100%' }} placeholder="请输入最低库存" min={0} />
        </Form.Item>

        <Form.Item name="maxStock" label="最高库存">
          <InputNumber style={{ width: '100%' }} placeholder="请输入最高库存" min={0} />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>停用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaterialForm;
