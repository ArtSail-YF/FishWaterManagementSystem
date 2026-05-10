import { Modal, Form, Input, Select, InputNumber, Row, Col, message, Radio } from 'antd';
import { ShoppingCartOutlined, ExportOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import type { StkRecordDTO } from '@/services/api/production/stock';
import { createStockRecord, updateStockRecord } from '@/services/api/production/stock';

const { Option } = Select;

interface InputFormProps {
  visible: boolean;
  onClose: () => void;
  initialValues: StkRecordDTO | null;
}

const InputForm: React.FC<InputFormProps> = ({ visible, onClose, initialValues }) => {
  const [form] = Form.useForm();
  const [recordType, setRecordType] = useState<'in' | 'out'>('in');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        setRecordType(initialValues.type as 'in' | 'out');
        form.setFieldsValue({
          ...initialValues,
        });
      } else {
        form.resetFields();
        setRecordType('in');
        form.setFieldsValue({
          type: 'in',
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (initialValues) {
        await updateStockRecord(initialValues.id, values);
        message.success('更新成功');
      } else {
        await createStockRecord(values);
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
    if (changedValues.type) {
      setRecordType(changedValues.type);
    }
  };

  return (
    <Modal
      title={initialValues ? '编辑记录' : '新增投入记录'}
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
        initialValues={{ type: 'in' }}
      >
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Form.Item name="type" noStyle>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="in"><ShoppingCartOutlined /> 采购入库</Radio.Button>
              <Radio.Button value="out"><ExportOutlined /> 领用出库</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="recordNo" label="记录编号" rules={[{ required: true }]}>
              <Input placeholder="如: STK-20260511-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="batchNo" label="批次号">
              <Input placeholder="如: BATCH-202605-01" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="baseId" label="基地ID">
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="matId" label="物资ID" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="changeQty" label={recordType === 'in' ? '入库数量' : '出库数量'} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="operatorId" label="经办人ID">
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InputForm;
