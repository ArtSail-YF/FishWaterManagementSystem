import { MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row, Select, Space, Tag, Typography, message } from 'antd';
import React, { useState } from 'react';

const { Text, Paragraph } = Typography;

interface BatchMedicineModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BatchMedicineModal: React.FC<BatchMedicineModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const pondOptions = Array.from({ length: 20 }, (_, i) => ({
    label: `${i + 1}号池塘`,
    value: `P${(i + 1).toString().padStart(3, '0')}`,
  }));

  const handleFinish = async (values: any) => {
    setSubmitting(true);
    setTimeout(() => {
      console.log('批量用药数据:', values);
      message.success(`成功为 ${values.ponds.length} 个池塘录入用药记录`);
      setSubmitting(false);
      onSuccess();
      form.resetFields();
    }, 800);
  };

  return (
    <Modal
      title={
        <Space>
          <span>代填模式：批量录入用药记录 / PROXY MEDICINE ENTRY</span>
          <Tag color="volcano" bordered={false}>文员/技术员专用</Tag>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={750}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText="一键保存记录"
      cancelText="取消"
      destroyOnClose
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff7e6', borderLeft: '4px solid #9ca3af', borderRadius: '2px' }}>
        <Paragraph style={{ marginBottom: '4px', fontSize: '13px' }}>
          <Text strong>专家建议：</Text>用药记录合规性要求高，建议由技术员根据现场诊断统一录入。
        </Paragraph>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          勾选多个发病池塘，统一设置药物品种、剂量和休药期，系统将自动关联每个池塘。
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          operator: '技术员-李工',
          reason: '预防',
          dose: 50
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="ponds"
              label={<Text strong>选择用药池塘 (可多选)</Text>}
              rules={[{ required: true, message: '请至少选择一个池塘' }]}
            >
              <Select
                mode="multiple"
                placeholder="点击选择池塘，如：5-15号"
                style={{ width: '100%' }}
                options={pondOptions}
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>
            <div style={{ marginBottom: '16px', marginTop: '-12px' }}>
              <Space size={8}>
                <Button size="small" type="dashed" onClick={() => form.setFieldsValue({ ponds: pondOptions.slice(4, 15).map(o => o.value) })}>
                  快速勾选 5-15 号
                </Button>
              </Space>
            </div>
          </Col>

          <Col span={12}>
            <Form.Item
              name="medicineName"
              label="药物品种 (含休药期)"
              rules={[{ required: true }]}
            >
              <Select options={[
                { label: '聚维酮碘 (休药期 7天)', value: '聚维酮碘' },
                { label: '恩诺沙星 (休药期 15天)', value: '恩诺沙星' },
                { label: '三黄散 (休药期 3天)', value: '三黄散' },
                { label: '二氧化氯 (无休药期)', value: '二氧化氯' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="dose"
              label="单池剂量 (g/ml)"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="g/ml" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="reason"
              label="用药原因"
              rules={[{ required: true }]}
            >
              <Select options={[
                { label: '预防性消毒', value: '预防' },
                { label: '烂鳃病治疗', value: '烂鳃病' },
                { label: '肠炎治疗', value: '肠炎' },
                { label: '寄生虫治理', value: '寄生虫' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="operator"
              label="操作/记录人"
              rules={[{ required: true }]}
            >
              <Select 
                showSearch
                suffixIcon={<UserOutlined />}
                options={[
                  { label: '技术员-李工', value: '技术员-李工' },
                  { label: '代录文员-张晓明', value: '代录文员-张晓明' },
                  { label: '场长-王总', value: '场长-王总' },
                ]} 
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="remarks" label="病情描述及备注">
              <Select
                mode="tags"
                placeholder="输入或选择病情详情"
                options={[
                  { label: '镜检发现指环虫', value: '镜检发现指环虫' },
                  { label: '摄食量下降 30%', value: '摄食量下降 30%' },
                  { label: '体色暗淡，活动缓慢', value: '体色暗淡，活动缓慢' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BatchMedicineModal;
