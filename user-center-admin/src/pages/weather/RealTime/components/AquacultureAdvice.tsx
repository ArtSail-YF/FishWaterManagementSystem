import { Badge, Card, Col, List, Rate, Row, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

const AquacultureAdvice: React.FC = () => {
  const indices = [
    { label: '出海指数', value: 4, desc: '风浪适宜，适合出海。' },
    { label: '换水指数', value: 2, desc: '降雨概率大，温差大，不宜换水。' },
    { label: '投喂指数', value: 3, desc: '水温波动中等，正常投喂。' },
  ];

  const forecast = [
    { 
      day: '明天', 
      weather: '8级大风', 
      isWarning: true, 
      advice: '⚠️ 明天 8 级大风，不适合出海/换水，建议加固渔排。',
      color: '#cf1322'
    },
    { 
      day: '后天', 
      weather: '阵雨', 
      isWarning: false, 
      advice: '🌧️ 局部阵雨，注意池塘盐度波动，适量加氧。',
      color: '#1890ff'
    },
    { 
      day: '2026-03-30', 
      weather: '晴转多云', 
      isWarning: false, 
      advice: '☀️ 天气转晴，日照增强，注意藻类过度生长。',
      color: '#52c41a'
    }
  ];

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
