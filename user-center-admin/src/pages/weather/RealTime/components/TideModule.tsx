import { Card, Space, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const TideModule: React.FC = () => {
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        const val = params[0].value;
        const time = params[0].name;
        let action = '';
        if (val > 1.5) action = '<br/><span style="color:#6b7280">● 适宜纳水</span>';
        if (val < 0.5) action = '<br/><span style="color:#f5222d">● 适宜排污</span>';
        return `${time}<br/>潮位: <span style="font-family:fin-number">${val}m</span>${action}`;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '23:59'],
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number', formatter: '{value}m' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '潮位',
        type: 'line',
        smooth: true,
        data: [1.2, 1.8, 2.2, 1.9, 1.3, 0.8, 0.4, 0.6, 1.2, 1.7, 2.1, 1.8, 1.4],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.2)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.02)' }
            ]
          }
        },
        itemStyle: { color: '#1f2937' },
        lineStyle: { width: 2 },
        markPoint: {
          data: [
            { type: 'max', name: '满潮', symbolSize: 40, itemStyle: { color: '#1f2937' } },
            { type: 'min', name: '干潮', symbolSize: 40, itemStyle: { color: '#595959' } }
          ],
          label: { fontSize: 10, offset: [0, 0] }
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#6b7280', type: 'dashed', opacity: 0.5 },
          data: [
            { yAxis: 1.5, label: { formatter: '纳水阈值', position: 'end', fontSize: 10 } },
            { yAxis: 0.5, label: { formatter: '排污阈值', position: 'end', fontSize: 10 } }
          ]
        }
      }
    ]
  };

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>🌊 潮汐曲线 (厦门港 - 大潮汛) / TIDE CURVE</span>}
      className="fin-card"
      variant="borderless"
      extra={<Tag color="processing">初一十五流</Tag>}
      styles={{ body: { padding: '12px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
        <Space direction="vertical" align="center" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>最高潮位</Text>
          <Text strong className="fin-number" style={{ fontSize: '18px' }}>2.45m</Text>
          <Text type="secondary" style={{ fontSize: '10px' }}>04:12</Text>
        </Space>
        <Space direction="vertical" align="center" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>最低潮位</Text>
          <Text strong className="fin-number" style={{ fontSize: '18px' }}>0.32m</Text>
          <Text type="secondary" style={{ fontSize: '10px' }}>12:45</Text>
        </Space>
        <Space direction="vertical" align="center" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>当前阶段</Text>
          <Tag color="cyan" style={{ margin: 0, borderRadius: '2px' }}>涨潮中</Tag>
          <Text type="secondary" style={{ fontSize: '10px' }}>距满潮 1h 24m</Text>
        </Space>
      </div>
      <ReactECharts option={option} style={{ height: '220px' }} />
    </Card>
  );
};

export default TideModule;
