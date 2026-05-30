import { Card, Space, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const WeatherTrendAnalysis: React.FC = () => {
  const option = {
    backgroundColor: 'transparent',
    grid: { left: '3%', right: '3%', bottom: '15%', top: '20%', containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    legend: {
      data: ['杭州基地气温', '舟山基地气温', '气压走势'],
      top: '0',
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#595959', fontSize: 11 }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-20', '03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27'],
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: [
      {
        type: 'value',
        name: '气温 (°C)',
        nameTextStyle: { color: '#8c8c8c', fontSize: 10 },
        axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
        splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
      },
      {
        type: 'value',
        name: '气压 (hPa)',
        nameTextStyle: { color: '#8c8c8c', fontSize: 10 },
        axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '杭州基地气温',
        type: 'line',
        smooth: true,
        data: [18, 22, 28, 32, 26, 20, 15, 12],
        itemStyle: { color: '#cf1322' },
        lineStyle: { width: 2 },
        markPoint: {
          data: [{ type: 'max', name: '最高', itemStyle: { color: '#cf1322' } }],
          label: { fontSize: 10 }
        }
      },
      {
        name: '舟山基地气温',
        type: 'line',
        smooth: true,
        data: [16, 19, 25, 29, 24, 18, 14, 11],
        itemStyle: { color: '#1f2937' },
        lineStyle: { width: 2 }
      },
      {
        name: '气压走势',
        type: 'line',
        yAxisIndex: 1,
        data: [1015, 1012, 1008, 995, 1005, 1010, 1014, 1016],
        itemStyle: { color: '#6b7280' },
        lineStyle: { width: 1.5, type: 'dashed' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(82, 196, 26, 0.1)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.01)' }
            ]
          }
        }
      }
    ],
    dataZoom: [
      { type: 'slider', height: 20, bottom: 10, borderColor: 'transparent', backgroundColor: '#f0f0f0', fillerColor: 'rgba(24, 144, 255, 0.1)', handleSize: '0' }
    ]
  };

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>历史趋势深度对比分析 / TREND ANALYSIS</span>}
      className="fin-card"
      variant="borderless"
      extra={<Space><Tag color="error">极值标注</Tag><Tag color="processing">多轴对比</Tag></Space>}
      styles={{ body: { padding: '16px 24px' } }}
    >
      <div style={{ marginBottom: '16px', display: 'flex', gap: '24px' }}>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>查询范围内最高温</Text>
          <Text strong className="fin-number" style={{ fontSize: '18px', color: '#cf1322' }}>32.4°C</Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>查询范围内最低温</Text>
          <Text strong className="fin-number" style={{ fontSize: '18px', color: '#3f8600' }}>11.2°C</Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: '11px' }}>最大气压差</Text>
          <Text strong className="fin-number" style={{ fontSize: '18px' }}>21hPa</Text>
        </Space>
      </div>
      <ReactECharts option={option} style={{ height: '320px' }} />
    </Card>
  );
};

export default WeatherTrendAnalysis;
