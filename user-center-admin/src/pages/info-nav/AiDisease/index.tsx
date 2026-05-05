import {
  Alert,
  Button,
  Col,
  Empty,
  Image,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd';
import {
  CameraOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import React, { useMemo, useState } from 'react';
import { detectDisease, type DiseaseDetectResult } from '@/services/api/ai';

const { Dragger } = Upload;
const { Text, Title, Paragraph } = Typography;

const backendOrigin = 'http://localhost:8080';

const riskColorMap: Record<string, string> = {
  高: 'red',
  中: 'orange',
  低: 'green',
};

const resolveImageUrl = (url?: string) => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${backendOrigin}${url}`;
};

const unwrapResult = (response: any): DiseaseDetectResult => {
  if (response?.data?.data) return response.data.data;
  if (response?.data) return response.data;
  return response;
};

const AiDisease: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<DiseaseDetectResult | null>(null);
  const [loading, setLoading] = useState(false);

  const topPercent = useMemo(() => {
    if (!result?.confidence) return 0;
    return Math.round(Number(result.confidence) * 100);
  }, [result]);

  const handleDetect = async () => {
    if (!selectedFile) {
      message.warning('请先上传一张病害照片');
      return;
    }

    setLoading(true);
    try {
      const response = await detectDisease(selectedFile);
      setResult(unwrapResult(response));
      message.success('识别完成');
    } catch (error) {
      console.error(error);
      message.error('识别失败，请确认后端和检测服务已启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title={false}>
      <div style={{ marginBottom: 20 }}>
        <Space size={12} align="center">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#e6f4ff',
              color: '#1677ff',
              fontSize: 20,
            }}
          >
            <CameraOutlined />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: 22 }}>
              AI 拍照识病
            </Title>
            <Text type="secondary">
              上传水产病害照片，自动返回中文病害名称、疾病概率、检测框和处置建议。
            </Text>
          </div>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={9}>
          <div className="fin-card" style={{ background: '#fff', borderRadius: 4, padding: 16 }}>
            <Dragger
              accept="image/*"
              maxCount={1}
              fileList={fileList}
              beforeUpload={(file) => {
                setSelectedFile(file);
                setFileList([file]);
                setResult(null);
                setPreviewUrl(URL.createObjectURL(file));
                return false;
              }}
              onRemove={() => {
                setSelectedFile(null);
                setFileList([]);
                setResult(null);
                setPreviewUrl('');
              }}
              style={{ background: '#fafafa' }}
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽图片到此处</p>
              <p className="ant-upload-hint">支持 jpg、png、webp，建议上传清晰近景照片。</p>
            </Dragger>

            <Button
              type="primary"
              block
              size="large"
              icon={<ExperimentOutlined />}
              loading={loading}
              onClick={handleDetect}
              style={{ marginTop: 16, borderRadius: 4 }}
            >
              开始识别
            </Button>

            <Alert
              style={{ marginTop: 16 }}
              type="info"
              showIcon
              message="识别规则"
              description="模型输出中的无效类别会被过滤，前端只展示中文病害名称和疾病概率。"
            />
          </div>

          <div className="fin-card" style={{ marginTop: 16, background: '#fff', borderRadius: 4, padding: 16 }}>
            <Title level={5} style={{ marginTop: 0 }}>
              当前照片
            </Title>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="待检测图片"
                style={{ width: '100%', maxHeight: 260, objectFit: 'contain', background: '#f5f5f5' }}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未上传图片" />
            )}
          </div>
        </Col>

        <Col xs={24} lg={15}>
          <div className="fin-card" style={{ background: '#fff', borderRadius: 4, padding: 16, minHeight: 452 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Statistic
                  title="最高疑似病害"
                  value={result?.topDisease || '等待识别'}
                  prefix={<SafetyCertificateOutlined />}
                  valueStyle={{ fontSize: 22, color: result ? '#1677ff' : '#999' }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="疾病概率"
                  value={result?.confidencePercent || '0.0%'}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ fontSize: 22 }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic title="风险等级" value={result?.riskLevel || '-'} valueStyle={{ fontSize: 22 }} />
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Progress
                percent={topPercent}
                status={result?.riskLevel === '高' ? 'exception' : 'active'}
                strokeColor={result?.riskLevel === '高' ? '#ff4d4f' : '#1677ff'}
              />
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} xl={14}>
                {result?.annotatedImageUrl ? (
                  <Image
                    src={resolveImageUrl(result.annotatedImageUrl)}
                    alt="识别结果图"
                    style={{ width: '100%', maxHeight: 420, objectFit: 'contain', background: '#f5f5f5' }}
                  />
                ) : (
                  <div
                    style={{
                      height: 360,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fafafa',
                      border: '1px dashed #d9d9d9',
                    }}
                  >
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="检测后显示带框结果图" />
                  </div>
                )}
              </Col>

              <Col xs={24} xl={10}>
                <Title level={5} style={{ marginTop: 0 }}>
                  处置建议
                </Title>
                <Paragraph style={{ minHeight: 64 }}>
                  {result?.suggestion || '上传照片并完成识别后，这里会显示针对最高疑似病害的处置建议。'}
                </Paragraph>

                <Title level={5}>检测明细</Title>
                {result?.detections?.length ? (
                  <List
                    size="small"
                    dataSource={result.detections}
                    renderItem={(item) => (
                      <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space>
                              <FileImageOutlined />
                              <Text strong>{item.label}</Text>
                              <Tag color={riskColorMap[item.riskLevel] || 'blue'}>{item.riskLevel}</Tag>
                            </Space>
                            <Text className="fin-number">{item.confidencePercent}</Text>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            检测框：{item.bbox.map((value) => Number(value).toFixed(0)).join('，')}
                          </Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无检测目标" />
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AiDisease;
