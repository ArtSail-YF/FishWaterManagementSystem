import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import type { MatCategory } from '@/services/api/material/category';

interface CategoryFormProps {
  visible: boolean;
  editingCategory: MatCategory | null;
  categories: MatCategory[];
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  editingCategory,
  categories,
  loading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingCategory) {
        form.setFieldsValue(editingCategory);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1, sortOrder: 0 });
      }
    }
  }, [visible, editingCategory, form]);

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
      title={editingCategory ? '编辑分类' : '新建分类'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1, sortOrder: 0 }}>
        <Form.Item
          name="catCode"
          label="分类编码"
          rules={[{ required: true, message: '请输入分类编码' }]}
        >
          <Input placeholder="请输入分类编码" />
        </Form.Item>

        <Form.Item
          name="catName"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>

        <Form.Item name="parentId" label="父级分类">
          <Select placeholder="请选择父级分类（可选）" allowClear>
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.catName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="sortOrder" label="排序">
          <InputNumber style={{ width: '100%' }} placeholder="数值越小越靠前" min={0} />
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

export default CategoryForm;
