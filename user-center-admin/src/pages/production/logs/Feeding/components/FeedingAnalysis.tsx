import { Card, Col, Row, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const FeedingAnalysis: React.FC = () => {
  const trendOption = {
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['0.5mm 饲料', '1.0mm 饲料', '1.5mm 饲料'], top: '0', right: '0' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27'],
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number', formatter: '{value}kg' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '0.5mm 饲料',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '1.0mm 饲料',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '1.5mm 饲料',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: [150, 232, 201, 154, 190, 330, 410],
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  const timeOption = {
    radar: {
      indicator: [
        { name: '早晨 (06:00-09:00)', max: 500 },
        { name: '中午 (11:00-14:00)', max: 500 },
        { name: '傍晚 (17:00-20:00)', max: 500 },
        { name: '深夜 (22:00-01:00)', max: 500 }
      ],
      shape: 'circle',
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      splitArea: { areaStyle: { color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.1)'] } },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '投喂时间分布',
        type: 'radar',
        data: [{ value: [420, 300, 450, 120], name: '当前周期' }],
        itemStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24, 144, 255, 0.2)' }
      }
    ]
  };

  return (
    <Row gutter={12}>
      <Col span={16}>
        <Card 
          title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>投喂量趋势分析 / FEEDING TREND</span>}
          variant="borderless" 
          className="fin-card"
          styles={{ body: { padding: '16px 24px' } }}
        >
          <ReactECharts option={trendOption} style={{ height: '300px' }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card 
          title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>投喂时段偏好 / TIME DIST.</span>}
          variant="borderless" 
          className="fin-card"
          styles={{ body: { padding: '16px 24px' } }}
        >
          <ReactECharts option={timeOption} style={{ height: '300px' }} />
        </Card>
      </Col>
    </Row>
  );
};

export default FeedingAnalysis;
