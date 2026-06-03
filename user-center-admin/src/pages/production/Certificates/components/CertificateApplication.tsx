import { Card, Space, Button, Form, Select, message, Modal, Typography, Divider, Badge, Upload, Tag } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { getPondOptions } from '@/services/api/pond';
import { getStrategyList, applyCertificate, getWithdrawalStatus } from '@/services/api/certificate';
import type { CertificateStrategy, CertificateVO, WithdrawalStatus } from '@/types/api/certificate';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const CertificateApplication: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateVO | null>(null);
  const [pondOptions, setPondOptions] = useState<{ label: string; value: number }[]>([]);
  const [strategies, setStrategies] = useState<CertificateStrategy[]>([]);
  const [pondStatus, setPondStatus] = useState<WithdrawalStatus | null>(null);
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null);
  const [testReportUrl, setTestReportUrl] = useState<string>('');

  const loadPonds = useCallback(async () => {
    const options = await getPondOptions(1);
    setPondOptions(options);
  }, []);

  const loadStrategies = useCallback(async () => {
    try {
      const res = await getStrategyList();
      if (res?.code === 200 && res?.data) {
        setStrategies(res.data);
      }
    } catch (e) {
      console.error('获取策略列表失败', e);
    }
  }, []);

  useEffect(() => {
    loadPonds();
    loadStrategies();
  }, [loadPonds, loadStrategies]);

  const handlePondChange = async (pondId: number) => {
    setSelectedPondId(pondId);
    setPondStatus(null);
    if (!pondId) return;
    setChecking(true);
    try {
      const res = await getWithdrawalStatus(pondId);
      if (res?.code === 200 && res?.data) {
        setPondStatus(res.data);
      }
    } catch (e) {
      console.error('查询休药期状态失败', e);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const body = {
        pondId: values.pondId,
        strategyId: values.strategyId,
        quantity: values.quantity || 0,
        testReportUrl: testReportUrl || undefined,
      };
      const res = await applyCertificate(body);
      if (res?.code === 200 && res?.data) {
        setCertificateData(res.data);
        setPreviewVisible(true);
        message.success(res.message || '合格证生成成功');
      } else {
        message.error(res?.message || '合格证生成失败');
      }
    } catch (e: any) {
      const errMsg = e?.response?.data?.message || e?.message || '请求失败';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
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
            <Select
              placeholder="请选择塘口"
              onChange={handlePondChange}
              loading={checking}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {pondOptions.map(pond => (
                <Option key={pond.value} value={pond.value}>
                  {pond.label}
                  {pondStatus?.pondId === pond.value && pondStatus?.locked && (
                    <Badge status="error" text="休药期风险" style={{ marginLeft: 8 }} />
                  )}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {pondStatus?.locked && (
            <div style={{ padding: '8px 12px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 6 }}>
              <Tag color="red">休药期警告</Tag>
              <Text type="danger">
                该塘口当前处于休药期锁定状态（剩余 {pondStatus.remainingDays} 天），
                涉及药品：{pondStatus.relatedDrugs?.map(d => d.drugName).join('、')}。
                申请合格证将被拦截。
              </Text>
            </div>
          )}

          <Form.Item
            name="strategyId"
            label="合格证类型"
            rules={[{ required: true, message: '请选择合格证类型' }]}
          >
            <Select placeholder="请选择合格证类型">
              {strategies.map(s => (
                <Option key={s.id} value={s.id}>{s.strategyName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="数量（斤）"
            rules={[{ required: false }]}
          >
            <Select placeholder="请选择或输入数量" mode="tags" maxCount={1}
              onChange={(val: string[]) => form.setFieldsValue({ quantity: val[0] })}
            />
          </Form.Item>

          <Form.Item label="检测报告（B类必传）">
            <Upload
              accept=".pdf,.jpg,.png"
              maxCount={1}
              beforeUpload={(file) => {
                // 模拟上传，实际应该调用文件上传API
                const url = '/upload/test-report/' + file.name;
                setTestReportUrl(url);
                message.success('文件已选择: ' + file.name);
                return false;
              }}
              onRemove={() => setTestReportUrl('')}
            >
              <Button icon={<UploadOutlined />}>选择检测报告</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={pondStatus?.locked}
              style={{ marginRight: 8 }}
            >
              {pondStatus?.locked ? '塘口休药期锁定，无法生成' : '生成合格证'}
            </Button>
          </Form.Item>
        </Space>
      </Form>

      {/* 合格证预览模态框 */}
      <Modal
        title="合格证预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="print" type="primary" onClick={() => window.print()}>
            打印
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
              <Paragraph>
                <Text strong>合格证编号：</Text>{certificateData.certNo}
              </Paragraph>
              <Paragraph>
                <Text strong>合格证类型：</Text>{certificateData.strategyName}
              </Paragraph>
              <Paragraph>
                <Text strong>开具日期：</Text>{certificateData.issueDate}
              </Paragraph>
              <Paragraph>
                <Text strong>状态：</Text>
                <Tag color={certificateData.status === 'valid' ? 'green' : 'red'}>
                  {certificateData.status === 'valid' ? '有效' : certificateData.status}
                </Tag>
              </Paragraph>
              {certificateData.details?.map((detail, idx) => (
                <div key={idx}>
                  <Divider style={{ fontSize: '12px', color: '#999' }}>明细 {idx + 1}</Divider>
                  <Paragraph><Text strong>数量：</Text>{detail.quantity} 斤</Paragraph>
                  <Paragraph>
                    <Text strong>休药期：</Text>
                    <Tag color={detail.withdrawalPassed ? 'green' : 'red'}>
                      {detail.withdrawalPassed ? '已通过' : '未通过'}
                    </Tag>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>药残检测：</Text>
                    <Tag color={detail.testPassed ? 'green' : 'orange'}>
                      {detail.testPassed ? '合格' : '未检测'}
                    </Tag>
                  </Paragraph>
                </div>
              ))}
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
