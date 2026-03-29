import { Card, Segmented, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo, useState } from 'react';
import type { PondStatus } from './PondCardGrid';

const { Title } = Typography;

interface QualityTrendChartProps {
  pond?: PondStatus;
  loading?: boolean;
}

const QualityTrendChart: React.FC<QualityTrendChartProps> = ({ pond, loading }) => {
  const [metric, setMetric] = useState<'oxygen' | 'temp' | 'ph'>('oxygen');

  // 模拟趋势数据
  const chartOptions = useMemo(() => {
    if (!pond) return {};

    const times = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const data = Array.from({ length: 24 }, () => {
      if (metric === 'oxygen') return (Math.random() * 4 + 4).toFixed(2);
      if (metric === 'temp') return (Math.random() * 5 + 22).toFixed(2);
      return (Math.random() * 2 + 7).toFixed(2);
    });

    const metricLabels = {
      oxygen: { name: '溶氧量', unit: 'mg/L', color: '#1890ff', warnLine: 5, errorLine: 4 },
      temp: { name: '水温', unit: '℃', color: '#faad14', warnLine: 28, errorLine: 32 },
      ph: { name: 'PH值', unit: '', color: '#52c41a', warnLine: 8.5, errorLine: 9.0 },
    };

    const currentMetric = metricLabels[metric];

    return {
      title: {
        text: `${pond.name} - ${currentMetric.name}趋势 (24h)`,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>${currentMetric.name}: <b>${p.value} ${currentMetric.unit}</b>`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: 'value',
        name: currentMetric.unit,
        scale: true,
      },
      series: [
        {
          name: currentMetric.name,
          type: 'line',
          smooth: true,
          data: data,
          lineStyle: { color: currentMetric.color, width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: currentMetric.color },
                { offset: 1, color: '#fff' },
              ],
            },
            opacity: 0.1,
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { position: 'end', fontSize: 10 },
            data: [
              {
                yAxis: currentMetric.warnLine,
                name: '预警线',
                lineStyle: { color: '#faad14', type: 'dashed' },
              },
              {
                yAxis: currentMetric.errorLine,
                name: '报警线',
                lineStyle: { color: '#ff4d4f', type: 'dashed' },
              },
            ],
          },
        },
      ],
    };
  }, [pond, metric]);

  return (
    <Card
      styles={{
        body: { padding: '24px' },
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>详细趋势分析</span>
          <Segmented
            options={[
              { label: '溶氧', value: 'oxygen' },
              { label: '水温', value: 'temp' },
              { label: 'PH值', value: 'ph' },
            ]}
            value={metric}
            onChange={(value) => setMetric(value as any)}
            size="small"
          />
        </div>
      }
    >
      {pond ? (
        <ReactECharts option={chartOptions} style={{ height: '300px' }} showLoading={loading} />
      ) : (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          请从上方网格中选择一个塘口查看详细趋势
        </div>
      )}
    </Card>
  );
};

export default QualityTrendChart;
