import { Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Divider, message, Radio } from 'antd';
import { ShoppingCartOutlined, ExportOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import type { InputRecordItem } from '../index';
import dayjs from 'dayjs';

interface InputFormProps {
  visible: boolean;
  onClose: () => void;
  initialValues: InputRecordItem | null;
}

const InputForm: React.FC<InputFormProps> = ({ visible, onClose, initialValues }) => {
  const [form] = Form.useForm();
  const [recordType, setRecordType] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        setRecordType(initialValues.type);
        form.setFieldsValue({
          ...initialValues,
          date: dayjs(initialValues.date),
        });
      } else {
        form.resetFields();
        setRecordType('in');
        form.setFieldsValue({
          date: dayjs(),
          type: 'in',
          operator: '张三', // 默认当前用户
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('提交投入记录:', values);
      message.success(initialValues ? '更新成功' : '新增成功');
      onClose();
    } catch (error) {
      console.error('表单校验失败:', error);
    }
  };

  // 自动计算总价
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.quantity !== undefined || changedValues.price !== undefined) {
      const quantity = allValues.quantity || 0;
      const price = allValues.price || 0;
      form.setFieldsValue({ totalPrice: quantity * price });
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
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues, allValues) => {
          handleValuesChange(changedValues, allValues);
          if (changedValues.type) {
            setRecordType(changedValues.type);
          }
        }}
        initialValues={{ status: 'pending', type: 'in' }}
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
            <Form.Item name="date" label="操作日期" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="category" label="物资分类" rules={[{ required: true }]}>
              <Select options={[
                { label: '饲料', value: 'feed' },
                { label: '药品', value: 'medicine' },
                { label: '苗种', value: 'seed' },
                { label: '设备 (增氧机等)', value: 'equipment' },
                { label: '其他', value: 'other' },
              ]} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="物资名称" rules={[{ required: true }]}>
              <Input placeholder="如: 1.5KW叶轮增氧机 / 虾料2号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="specification" label="规格型号">
              <Input placeholder="如: 20kg/袋, 台, 500ml/瓶" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="quantity" label={recordType === 'in' ? '入库数量' : '出库数量'} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
              <Select options={[
                { label: '袋', value: '袋' },
                { label: '瓶', value: '瓶' },
                { label: '吨', value: '吨' },
                { label: '台', value: '台' },
                { label: '万尾', value: '万尾' },
              ]} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="price" label="单价 (元)" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="totalPrice" label="总金额 (元)">
              <InputNumber
                style={{ width: '100%', backgroundColor: '#f5f5f5' }}
                disabled
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="pondName" 
              label="关联塘口" 
              rules={[{ required: recordType === 'out', message: '领用出库必须关联塘口' }]}
            >
              <Select 
                allowClear 
                placeholder={recordType === 'in' ? '可选' : '请选择塘口'}
                options={[
                  { label: '1号精养塘', value: '1号精养塘' },
                  { label: '2号育苗塘', value: '2号育苗塘' },
                  { label: '3号暂养池', value: '3号暂养池' },
                ]} 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="operator" label="经办人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="supplier" 
              label="供应商"
              rules={[{ required: recordType === 'in', message: '入库记录需填写供应商' }]}
            >
              <Input placeholder={recordType === 'out' ? '可选' : '请输入供应商名称'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default InputForm;
