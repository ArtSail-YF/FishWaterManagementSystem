import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Typography, Tag, List, Input, Space, Badge, Divider, Button } from 'antd';
import { BookOutlined, EyeOutlined, LikeOutlined, SearchOutlined, ReadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Text, Title, Paragraph } = Typography;

interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  category: 'disease' | 'water' | 'feed' | 'policy';
  tags: string[];
  views: number;
  likes: number;
  updateTime: string;
}

const KnowledgeBase: React.FC = () => {
  const [category, setCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: '全部知识', icon: <BookOutlined /> },
    { key: 'disease', label: '病害防治', icon: <Badge status="error" text="" />, color: 'red' },
    { key: 'water', label: '水质调控', icon: <Badge status="processing" text="" />, color: 'blue' },
    { key: 'feed', label: '营养饲料', icon: <Badge status="warning" text="" />, color: 'orange' },
    { key: 'policy', label: '政策法规', icon: <Badge status="success" text="" />, color: 'green' },
  ];

  const mockKnowledge: KnowledgeItem[] = [
    {
      id: 'K001',
      title: '南美白对虾“EMS”早期死亡综合症的综合防治方案',
      summary: '针对EMS高发期，通过水质监控、种苗筛选及生物安全防控等多维度建立预警机制...',
      category: 'disease',
      tags: ['对虾', 'EMS', '生物防控'],
      views: 1250,
      likes: 85,
      updateTime: '2026-03-25',
    },
    {
      id: 'K002',
      title: '智能增氧机在精养模式下的溶氧优化策略',
      summary: '探讨如何通过在线溶氧传感器与变频增氧机的联动，在保证鱼类生长的同时降低20%能耗...',
      category: 'water',
      tags: ['自动化', '溶氧', '节能'],
      views: 890,
      likes: 42,
      updateTime: '2026-03-20',
    },
    {
      id: 'K003',
      title: '2026年现代农业渔业基础设施建设补贴政策解读',
      summary: '解读农业农村部关于数字化渔场、智慧水产养殖设备的最新补贴标准与申请流程...',
      category: 'policy',
      tags: ['政策', '补贴', '数字化'],
      views: 2100,
      likes: 156,
      updateTime: '2026-03-15',
    },
    {
      id: 'K004',
      title: '大黄鱼越冬期功能性饲料的配比与投喂技巧',
      summary: '通过添加免疫增强剂和高能脂肪酸，提高大黄鱼在低温环境下的抗应激能力...',
      category: 'feed',
      tags: ['大黄鱼', '功能饲料', '抗应激'],
      views: 670,
      likes: 31,
      updateTime: '2026-03-10',
    },
  ];

  const filteredData = category === 'all' 
    ? mockKnowledge 
    : mockKnowledge.filter(item => item.category === category);

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        {/* 左侧分类导航 */}
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '12px' } }}>
            <div style={{ padding: '8px 12px', fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
              知识分类 / CATEGORIES
            </div>
            <List
              dataSource={categories}
              renderItem={(item) => (
                <div
                  onClick={() => setCategory(item.key)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: category === item.key ? '#e6f7ff' : 'transparent',
                    color: category === item.key ? '#1f2937' : 'inherit',
                    transition: 'all 0.3s',
                    marginBottom: '4px',
                  }}
                >
                  <Space>
                    {item.icon}
                    <span>{item.label}</span>
                  </Space>
                </div>
              )}
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ padding: '8px 12px' }}>
              <Title level={5} style={{ fontSize: '12px', color: '#999' }}>热门搜索</Title>
              <Space wrap size={[0, 8]}>
                <Tag style={{ cursor: 'pointer' }}>水霉病</Tag>
                <Tag style={{ cursor: 'pointer' }}>氨氮超标</Tag>
                <Tag style={{ cursor: 'pointer' }}>数字化补贴</Tag>
                <Tag style={{ cursor: 'pointer' }}>光合细菌</Tag>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 右侧知识列表 */}
        <Col span={18}>
          <div style={{ marginBottom: '16px' }}>
            <Input 
              placeholder="搜索技术文章、病害库或政策文件..." 
              size="large"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '2px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            />
          </div>

          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={filteredData}
            renderItem={(item) => (
              <List.Item>
                <Card 
                  hoverable 
                  variant="borderless" 
                  className="fin-card"
                  styles={{ body: { padding: '20px' } }}
                >
                  <Row gutter={24}>
                    <Col span={20}>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Tag color={
                            item.category === 'disease' ? 'red' : 
                            item.category === 'water' ? 'blue' : 
                            item.category === 'feed' ? 'orange' : 'green'
                          } style={{ borderRadius: '2px', fontSize: '10px' }}>
                            {categories.find(c => c.key === item.category)?.label}
                          </Tag>
                          <Title level={4} style={{ margin: 0, fontSize: '18px' }}>{item.title}</Title>
                        </div>
                        <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: '14px' }}>
                          {item.summary}
                        </Paragraph>
                        <Space size={16} style={{ marginTop: '8px' }}>
                          <Space size={4} style={{ color: '#999', fontSize: '12px' }}>
                            <EyeOutlined /> <span className="fin-number">{item.views}</span>
                          </Space>
                          <Space size={4} style={{ color: '#999', fontSize: '12px' }}>
                            <LikeOutlined /> <span className="fin-number">{item.likes}</span>
                          </Space>
                          <Text type="secondary" className="fin-number" style={{ fontSize: '12px' }}>
                            更新于 {item.updateTime}
                          </Text>
                        </Space>
                      </Space>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Button type="primary" ghost icon={<ReadOutlined />}>阅读详情</Button>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default KnowledgeBase;
