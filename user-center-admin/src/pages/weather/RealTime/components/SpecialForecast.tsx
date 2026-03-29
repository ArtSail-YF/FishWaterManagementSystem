import { Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const SpecialForecast: React.FC = () => {
  const waterTempOption = {
    grid: { left: '3%', right: '3%', bottom: '5%', top: '20%', containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    xAxis: {
      type: 'category',
      data: ['03-27', '03-28', '03-29', '03-30'],
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: {
      type: 'value',
      min: 22,
      max: 28,
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number', formatter: '{value}°C' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '表层水温预测',
        type: 'line',
        smooth: true,
        data: [24.5, 26.2, 25.8, 24.1],
        itemStyle: { color: '#1890ff' },
        lineStyle: { width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.1)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.01)' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          fontFamily: 'fin-number',
          formatter: '{c}°C'
        }
      }
    ]
  };

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>景观与水温预测 / SPECIAL FORECAST</span>}
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
    >
      <Row gutter={24}>
        <Col span={8} style={{ borderRight: '1px solid #f0f0f0' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>早晚巡塘建议时间</div>
              <Row gutter={12}>
                <Col span={12}>
                  <div style={{ backgroundColor: '#fff7e6', padding: '10px 4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#fa8c16' }}>🌅 日出</div>
                    <div className="fin-number" style={{ fontSize: '18px', fontWeight: 'bold' }}>06:05</div>
                    <Tag color="orange" style={{ margin: 0, fontSize: '10px', scale: '0.85' }}>建议巡塘</Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: '#e6f7ff', padding: '10px 4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#1890ff' }}>🌇 日落</div>
                    <div className="fin-number" style={{ fontSize: '18px', fontWeight: 'bold' }}>18:14</div>
                    <Tag color="blue" style={{ margin: 0, fontSize: '10px', scale: '0.85' }}>建议巡塘</Tag>
                  </div>
                </Col>
              </Row>
            </div>
            
            <Divider style={{ margin: '8px 0' }} />
            
            <div style={{ fontSize: '11px', color: '#8c8c8c', lineHeight: '1.5' }}>
              ⚠️ <Text strong style={{ fontSize: '11px' }}>风险告知：</Text>
              预测水温仅供参考。实际池塘水温受深度、遮阴、投喂频率等实地环境影响显著，请结合实测数据操作。
            </div>
          </Space>
        </Col>

        <Col span={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '13px' }}>表层水温预测趋势图 (3天)</Text>
            <Tag color="blue">模型预测值</Tag>
          </div>
          <ReactECharts option={waterTempOption} style={{ height: '160px' }} />
        </Col>
      </Row>
    </Card>
  );
};

export default SpecialForecast;
