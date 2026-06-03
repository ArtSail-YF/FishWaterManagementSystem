import React from 'react';
import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';

const HEATMAP_DATA = {
  x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  y: ['1号塘', '2号塘', '3号塘', '4号塘', '5号塘'],
  data: [
    [0, 0, 2], [0, 1, 5], [0, 2, 1], [0, 3, 3], [0, 4, 0],
    [1, 0, 4], [1, 1, 7], [1, 2, 2], [1, 3, 5], [1, 4, 1],
    [2, 0, 1], [2, 1, 3], [2, 2, 0], [2, 3, 2], [2, 4, 0],
    [3, 0, 3], [3, 1, 6], [3, 2, 1], [3, 3, 4], [3, 4, 0],
    [4, 0, 0], [4, 1, 2], [4, 2, 0], [4, 3, 1], [4, 4, 0],
    [5, 0, 1], [5, 1, 4], [5, 2, 0], [5, 3, 2], [5, 4, 0],
  ]
};

const COMPOSITION_DATA = [
  { name: '溶解氧异常', value: 45, color: '#cf1322' },
  { name: 'pH异常', value: 30, color: '#fa8c16' },
  { name: '温度异常', value: 20, color: '#9ca3af' },
  { name: '设备离线', value: 10, color: '#595959' },
  { name: '其他', value: 5, color: '#d9d9d9' },
];

const heatmapOption = {
  title: {
    text: 'RISK HEATMAP / 风险热力分布',
    left: 'center',
    textStyle: { fontSize: 12, fontWeight: '700', color: '#8c8c8c' },
  },
  tooltip: { position: 'top' },
  grid: { height: '65%', top: '18%', left: '3%', right: '3%', bottom: '8%', containLabel: true },
  xAxis: {
    type: 'category',
    data: HEATMAP_DATA.x,
    splitArea: { show: true },
    axisLabel: { fontSize: 10 },
  },
  yAxis: {
    type: 'category',
    data: HEATMAP_DATA.y,
    splitArea: { show: true },
    axisLabel: { fontSize: 10 },
  },
  visualMap: {
    min: 0, max: 10, calculable: true,
    orient: 'horizontal', left: 'center', bottom: '0%',
    itemWidth: 10, itemHeight: 60,
    inRange: { color: ['#f6ffed', '#9ca3af', '#cf1322'] },
    textStyle: { fontSize: 10 },
  },
  series: [{
    name: '风险指数', type: 'heatmap',
    data: HEATMAP_DATA.data,
    label: { show: false },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
  }],
};

const donutOption = {
  title: {
    text: 'ALERT COMPOSITION / 预警类型占比',
    left: 'center',
    textStyle: { fontSize: 12, fontWeight: '700', color: '#8c8c8c' },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textStyle: { fontSize: 11 },
  },
  legend: {
    orient: 'vertical', right: '5%', top: 'middle',
    itemWidth: 8, itemHeight: 8,
    textStyle: { fontSize: 10, color: '#595959' },
  },
  series: [{
    name: '预警类型', type: 'pie',
    radius: ['45%', '70%'], center: ['35%', '55%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 2, borderColor: '#fff', borderWidth: 1 },
    label: { show: false, position: 'center' },
    emphasis: {
      label: { show: true, fontSize: '11', fontWeight: 'bold', formatter: '{b}\n{d}%' },
    },
    data: COMPOSITION_DATA.map(item => ({
      value: item.value, name: item.name, itemStyle: { color: item.color },
    })),
  }],
};

const RiskCharts: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Card size="small" styles={{ body: { padding: '12px' } }}>
        <ReactECharts option={heatmapOption} style={{ height: 220 }} />
      </Card>
      <Card size="small" styles={{ body: { padding: '12px' } }}>
        <ReactECharts option={donutOption} style={{ height: 220 }} />
      </Card>
    </div>
  );
};

export default RiskCharts;
