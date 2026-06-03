import { Badge, Card, Col, List, Rate, Row, Space, Tag, Typography, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { getAquacultureAdvice, type AquacultureAdviceItem } from '@/services/api/weather';
import { MOCK_AQUACULTURE_ADVICE } from '@/services/api/mock';

const { Text, Title } = Typography;

const AquacultureAdvice: React.FC = () => {
  const [data, setData] = useState<AquacultureAdviceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getAquacultureAdvice()
        .then(res => {
          setData(res.data || null);
        })
        .catch(() => {
          console.error('获取养殖建议失败，使用降级数据');
          setData(MOCK_AQUACULTURE_ADVICE);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchData();
    const timer = setInterval(fetchData, 180000);
    return () => clearInterval(timer);
  }, []);

  if (loading || !data) {
    return (
      <Card className="fin-card" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin tip="分析专家建议..." />
      </Card>
    );
  }

  const { indices, forecast } = data;

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>未来 3 天养殖作业指数与建议 / ADVICE</span>}
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
    >
      <Row gutter={24}>
        <Col span={10} style={{ borderRight: '1px solid #f0f0f0' }}>
          <List
            dataSource={indices}
            renderItem={(item) => (
              <List.Item style={{ padding: '8px 0', border: 'none' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Text strong style={{ fontSize: '13px' }}>{item.label}</Text>
                    <Rate disabled defaultValue={item.value} style={{ fontSize: '12px' }} />
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{item.desc}</Text>
                </div>
              </List.Item>
            )}
          />
        </Col>

        <Col span={14}>
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            {forecast.map((item, index) => (
              <div key={index} style={{ 
                padding: '10px 12px', 
                backgroundColor: item.isWarning ? '#fff1f0' : '#f9f9f9',
                borderLeft: `4px solid ${item.color}`,
                borderRadius: '2px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text strong style={{ fontSize: '13px' }}>{item.day} · {item.weather}</Text>
                  {item.isWarning && <Tag color="error">高风险</Tag>}
                </div>
                <div style={{ fontSize: '12px', color: item.isWarning ? '#cf1322' : '#595959', lineHeight: '1.6' }}>
                  {item.advice}
                </div>
              </div>
            ))}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default AquacultureAdvice;
