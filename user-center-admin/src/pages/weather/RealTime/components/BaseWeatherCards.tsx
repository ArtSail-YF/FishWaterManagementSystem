import { Card, Col, Row, Spin, Typography, Tag, Space } from 'antd';
import { CloudOutlined, TemperatureOutlined, WindPowerOutlined, DropboxOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getBasesWeather } from '@/services/api/weather';

const { Text } = Typography;

const weatherIcons: Record<string, string> = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '雷陣雨': '⛈️',
};

const BaseWeatherCards: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getBasesWeather().then((res: any) => {
        setData(res?.data || []);
        setLoading(false);
      });
    };
    fetchData();
    const timer = setInterval(fetchData, 120000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <Row gutter={[12, 12]}>
      {data.map((base: any) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={base.baseId}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              backgroundColor: '#fff',
            }}
            styles={{ body: { padding: '14px 16px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text strong style={{ fontSize: 13 }}>{base.baseName}</Text>
              <Tag style={{ fontSize: 11, borderRadius: 4 }}>{base.weather || '--'}</Tag>
            </div>

            <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 10 }}>
              {weatherIcons[base.weather] || '☁️'}
              <span style={{ marginLeft: 6 }}>
                {base.temperature != null ? base.temperature + '°C' : '--'}
              </span>
            </div>

            <Row gutter={8}>
              <Col span={8} style={{ textAlign: 'center' }}>
                <DropboxOutlined style={{ color: '#1890ff', fontSize: 14 }} />
                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>湿度</div>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{base.humidity != null ? base.humidity + '%' : '--'}</Text>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <WindPowerOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>风速</div>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{base.windSpeed != null ? base.windSpeed + 'm/s' : '--'}</Text>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <CloudOutlined style={{ color: '#722ed1', fontSize: 14 }} />
                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>风向</div>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{base.windDirection || '--'}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BaseWeatherCards;
