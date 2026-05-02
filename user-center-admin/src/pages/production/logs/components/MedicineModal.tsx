import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message } from 'antd';
import type { FormInstance } from 'antd';
import MedicineForm from './MedicineForm';
import dayjs from 'dayjs';

interface MedicineModalProps {
  visible: boolean;
  type: 'pond' | 'cage' | 'workboat';
  initialValues?: any;
  onCancel: () => void;
  onSuccess: (values: any) => void;
  title?: string;
}

const MedicineModal: React.FC<MedicineModalProps> = ({
  visible,
  type,
  initialValues,
  onCancel,
  onSuccess,
  title
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          time: initialValues.time ? dayjs(initialValues.time) : dayjs(),
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const submitData = {
        ...values,
        time: values.time.format('YYYY-MM-DD HH:mm:ss'),
        category: type,
        categoryName: values.categoryId,
        // 根据类型设置特定字段
        ...(type === 'pond' && { area: values.area }),
        ...(type === 'cage' && { cageNumber: values.cageNumber }),
        ...(type === 'workboat' && { 
          compartment: values.compartment,
          tonnage: values.tonnage 
        }),
      };
      
      onSuccess(submitData);
      message.success(initialValues ? '更新成功' : '添加成功');
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
      console.error('表单验证失败:', error);
    }
  };

  const getCategoryName = () => {
    const categoryMap = {
      pond: '塘口',
      cage: '网箱', 
      workboat: '工船'
    };
    return categoryMap[type] || '塘口';
  };

  return (
    <Modal
      title={title || `${initialValues ? '编辑' : '新增'}${getCategoryName()}用药记录`}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          {initialValues ? '更新' : '创建'}
        </Button>,
      ]}
    >
      <MedicineForm
        form={form}
        type={type}
        initialValues={initialValues}
      />
    </Modal>
  );
};

export default MedicineModal;