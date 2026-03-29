import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Row, Select, Space, Tag, Typography, message } from 'antd';
import React, { useState } from 'react';

const { Text, Paragraph } = Typography;

interface BatchFeedingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BatchFeedingModal: React.FC<BatchFeedingModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const pondOptions = Array.from({ length: 20 }, (_, i) => ({
    label: `${i + 1}号池塘`,
    value: `P${(i + 1).toString().padStart(3, '0')}`,
  }));

  const handleFinish = async (values: any) => {
    setSubmitting(true);
    // 模拟 API 调用
    setTimeout(() => {
      console.log('批量录入数据:', values);
      message.success(`成功为 ${values.ponds.length} 个池塘录入投喂记录`);
      setSubmitting(false);
      onSuccess();
      form.resetFields();
    }, 800);
  };

  return (
    <Modal
      title={
        <Space>
          <span>代填模式：批量录入投喂记录 / PROXY BATCH ENTRY</span>
          <Tag color="blue" bordered={false}>文员/技术员专用</Tag>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText="一键保存记录"
      cancelText="取消"
      destroyOnClose
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f0f5ff', borderLeft: '4px solid #1890ff', borderRadius: '2px' }}>
        <Paragraph style={{ marginBottom: '4px', fontSize: '13px' }}>
          <Text strong>专家建议：</Text>针对现场工人填报意愿低的现状，采用“文员代填模式”。
        </Paragraph>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          文员可通过对讲机/微信询问现场情况，在此统一勾选多个池塘并一键录入相同投喂量，效率比手机填报提升 10 倍。
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          method: 'auto',
          amount: 50,
          feedType: '1.5mm 高蛋白',
          operator: '代录文员-张晓明'
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="ponds"
              label={<Text strong>选择投喂池塘 (可多选)</Text>}
              rules={[{ required: true, message: '请至少选择一个池塘' }]}
            >
              <Select
                mode="multiple"
                placeholder="点击选择或输入搜索池塘，如：1号池塘"
                style={{ width: '100%' }}
                options={pondOptions}
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>
            <div style={{ marginBottom: '16px', marginTop: '-12px' }}>
              <Space size={8}>
                <Button size="small" type="dashed" onClick={() => form.setFieldsValue({ ponds: pondOptions.slice(0, 10).map(o => o.value) })}>
                  勾选 1-10 号
                </Button>
                <Button size="small" type="dashed" onClick={() => form.setFieldsValue({ ponds: pondOptions.slice(10, 20).map(o => o.value) })}>
                  勾选 11-20 号
                </Button>
              </Space>
            </div>
          </Col>

          <Col span={12}>
            <Form.Item
              name="feedType"
              label="饲料品种"
              rules={[{ required: true }]}
            >
              <Select options={[
                { label: '0.5mm 幼鱼料', value: '0.5mm 幼鱼料' },
                { label: '1.0mm 育成料', value: '1.0mm 育成料' },
                { label: '1.5mm 高蛋白', value: '1.5mm 高蛋白' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="amount"
              label="统一投喂量 (kg)"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="kg" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="method"
              label="投喂方式"
              rules={[{ required: true }]}
            >
              <Select options={[
                { label: '智能自动', value: 'auto' },
                { label: '人工投喂', value: 'manual' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="operator"
              label="记录人 (文员/技术员)"
              rules={[{ required: true }]}
            >
              <Select 
                showSearch
                suffixIcon={<UserOutlined />}
                options={[
                  { label: '代录文员-张晓明', value: '代录文员-张晓明' },
                  { label: '技术员-李工', value: '技术员-李工' },
                  { label: '场长-王总', value: '场长-王总' },
                ]} 
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="remarks" label="异常情况/备注">
              <Select
                mode="tags"
                placeholder="输入或选择预设备注"
                options={[
                  { label: '摄食欲望旺盛', value: '摄食欲望旺盛' },
                  { label: '水温适宜', value: '水温适宜' },
                  { label: '发现少量浮头', value: '发现少量浮头' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BatchFeedingModal;
