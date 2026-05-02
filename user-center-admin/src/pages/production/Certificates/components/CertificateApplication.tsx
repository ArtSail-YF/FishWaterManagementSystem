import { Card, Space, Button, Form, Select, message, Modal, Typography, Divider, Badge } from 'antd';
import React, { useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Pond {
  value: string;
  label: string;
}

const CertificateApplication: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);

  const ponds: Pond[] = [
    { value: 'P001', label: '1号池塘 - 南美白对虾' },
    { value: 'P002', label: '2号池塘 - 大黄鱼' },
    { value: 'P003', label: '3号池塘 - 南美白对虾' },
    { value: 'P004', label: '4号池塘 - 大黄鱼' },
    { value: 'P005', label: '5号池塘 - 南美白对虾' },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    // 模拟系统校验
    setTimeout(() => {
      // 模拟校验结果
      const isPass = values.pondId !== 'P005'; // 5号池塘有风险
      
      if (!isPass) {
        message.error('该塘口存在未过休药期的用药记录，无法生成合格证');
        setLoading(false);
        return;
      }

      // 生成合格证
      const certData = {
        id: 'C' + Date.now(),
        pondId: values.pondId,
        pondName: ponds.find(p => p.value === values.pondId)?.label || '',
        type: values.type,
        productName: values.pondId.includes('P001') || values.pondId.includes('P003') || values.pondId.includes('P005') ? '南美白对虾' : '大黄鱼',
        batchNumber: '2026' + Math.floor(Math.random() * 10000),
        issueDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        issuer: '系统自动生成',
      };

      setCertificateData(certData);
      setPreviewVisible(true);
      setLoading(false);
      message.success('合格证生成成功');
    }, 1500);
  };

  return (
    <Card 
      className="fin-card" 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>合格证申请管理 / CERTIFICATE APPLICATION</span>}
      variant="borderless"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Form.Item
            name="pondId"
            label="选择塘口"
            rules={[{ required: true, message: '请选择塘口' }]}
          >
            <Select placeholder="请选择塘口">
              {ponds.map(pond => (
                <Option key={pond.value} value={pond.value}>
                  {pond.label}
                  {pond.value === 'P005' && <Badge status="error" text="休药期风险" style={{ marginLeft: 8 }} />}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="合格证类型"
            rules={[{ required: true, message: '请选择合格证类型' }]}
          >
            <Select placeholder="请选择合格证类型">
              <Option value="A">A类合格证（质量控制）</Option>
              <Option value="B">B类合格证（检测合格）</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              生成合格证
            </Button>
            <Button>预览模板</Button>
          </Form.Item>
        </Space>
      </Form>

      {/* 合格证预览模态框 */}
      <Modal
        title="合格证预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="print" type="primary">
            打印
          </Button>,
          <Button key="download">
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {certificateData && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Title level={4}>水产品质量安全承诺达标合格证</Title>
            <Divider />
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Paragraph><Text strong>产品名称：</Text>{certificateData.productName}</Paragraph>
              <Paragraph><Text strong>批次编号：</Text>{certificateData.batchNumber}</Paragraph>
              <Paragraph><Text strong>塘口信息：</Text>{certificateData.pondName}</Paragraph>
              <Paragraph><Text strong>开具类型：</Text>{certificateData.type === 'A' ? 'A类（质量控制）' : 'B类（检测合格）'}</Paragraph>
              <Paragraph><Text strong>开具日期：</Text>{certificateData.issueDate}</Paragraph>
              <Paragraph><Text strong>有效期至：</Text>{certificateData.expirationDate}</Paragraph>
              <Paragraph><Text strong>开具人：</Text>{certificateData.issuer}</Paragraph>
            </Space>
            <Divider />
            <Paragraph style={{ fontSize: '12px', color: '#666' }}>
              本合格证根据《农产品质量安全承诺达标合格证管理办法》开具
            </Paragraph>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default CertificateApplication;