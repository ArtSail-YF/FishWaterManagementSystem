import { Modal, Form, Input, Select, InputNumber, DatePicker, Row, Col, message } from 'antd';
import React, { useEffect, useState } from 'react';
import type { StkUsageDTO } from '@/services/api/production/usage';
import { createUsageRecord, updateUsageRecord } from '@/services/api/production/usage';

const { Option } = Select;

interface UsageFormProps {
  visible: boolean;
  onClose: () => void;
  initialValues: StkUsageDTO | null;
}

const UsageForm: React.FC<UsageFormProps> = ({ visible, onClose, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (initialValues) {
        await updateUsageRecord(initialValues.id, values);
        message.success('更新成功');
      } else {
        await createUsageRecord(values);
        message.success('新增成功');
      }

      onClose();
    } catch (error) {
      console.error('操作失败:', error);
      message.error(initialValues ? '更新失败' : '新增失败');
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.useQty !== undefined || changedValues.unitPrice !== undefined) {
      const qty = allValues.useQty || 0;
      const price = allValues.unitPrice || 0;
      form.setFieldsValue({ totalPrice: qty * price });
    }
  };

  return (
    <Modal
      title={initialValues ? '编辑记录' : '新增物资使用记录'}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      width={650}
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="usageNo"
              label="使用单号"
              rules={[{ required: true, message: '请输入使用单号' }]}
            >
              <Input placeholder="如: USAGE-20260511-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="baseId"
              label="基地ID"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="pondId"
              label="塘口ID"
              rules={[{ required: true, message: '请选择塘口' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taskId"
              label="关联任务ID"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="matId"
              label="物资ID"
              rules={[{ required: true, message: '请选择物资' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="useTime"
              label="使用时间"
              rules={[{ required: true, message: '请选择使用时间' }]}
            >
              <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="useQty"
              label="使用数量"
              rules={[{ required: true, message: '请输入使用数量' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="unitPrice"
              label="单价"
              rules={[{ required: true, message: '请输入单价' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="totalPrice"
              label="总价"
            >
              <InputNumber style={{ width: '100%' }} readOnly precision={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="operatorId"
              label="操作人ID"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsageForm;
