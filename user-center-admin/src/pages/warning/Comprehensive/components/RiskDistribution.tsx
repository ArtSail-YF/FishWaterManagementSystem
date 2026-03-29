import { Card, Col, Row } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';

const RiskDistribution: React.FC = () => {
  const heatmapOption = useMemo(() => ({
    title: {
      text: 'RISK HEATMAP / 风险热力分布',
      left: 'center',
      textStyle: { fontSize: 12, fontWeight: '700', color: '#8c8c8c' }
    },
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '70%',
      top: '20%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['萧山', '余杭', '富阳', '桐庐', '临安'],
      splitArea: { show: true },
      axisLabel: { fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: ['塘口 A', '塘口 B', '塘口 C', '塘口 D'],
      splitArea: { show: true },
      axisLabel: { fontSize: 10 }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      itemWidth: 10,
      itemHeight: 80,
      inRange: {
        color: ['#f6ffed', '#faad14', '#cf1322']
      },
      textStyle: { fontSize: 10 }
    },
    series: [{
      name: '风险指数',
      type: 'heatmap',
      data: [
        [0, 0, 1], [0, 1, 2], [0, 2, 8], [0, 3, 1],
        [1, 0, 3], [1, 1, 9], [1, 2, 4], [1, 3, 2],
        [2, 0, 1], [2, 1, 2], [2, 2, 3], [2, 3, 5],
        [3, 0, 7], [3, 1, 2], [3, 2, 1], [3, 3, 2],
        [4, 0, 1], [4, 1, 1], [4, 2, 1], [4, 3, 1]
      ],
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      }
    }]
  }), []);

  const donutOption = useMemo(() => ({
    title: {
      text: 'ALERT COMPOSITION / 预警类型占比',
      left: 'center',
      textStyle: { fontSize: 12, fontWeight: '700', color: '#8c8c8c' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textStyle: { fontSize: 11 }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { fontSize: 10, color: '#595959' }
    },
    series: [
      {
        name: '预警类型',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 2, borderColor: '#fff', borderWidth: 1 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: {
            show: true,
            fontSize: '11',
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          }
        },
        data: [
          { value: 45, name: '水质异常', itemStyle: { color: '#cf1322' } },
          { value: 25, name: '设备离线', itemStyle: { color: '#faad14' } },
          { value: 15, name: '环境气象', itemStyle: { color: '#1890ff' } },
          { value: 15, name: '作业超时', itemStyle: { color: '#52c41a' } }
        ]
      }
    ]
  }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Card className="fin-card" styles={{ body: { padding: '12px' } }}>
        <ReactECharts option={heatmapOption} style={{ height: '240px' }} />
      </Card>
      <Card className="fin-card" styles={{ body: { padding: '12px' } }}>
        <ReactECharts option={donutOption} style={{ height: '240px' }} />
      </Card>
    </div>
  );
};

export default RiskDistribution;
