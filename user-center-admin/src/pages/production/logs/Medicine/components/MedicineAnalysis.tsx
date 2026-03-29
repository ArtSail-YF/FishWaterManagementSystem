import { Card, Col, Row, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const MedicineAnalysis: React.FC = () => {
  const trendOption = {
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['抗生素', '消毒剂', '营养/中草药'], top: '0', right: '0' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27'],
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8c8c8c', fontSize: 10, fontFamily: 'fin-number', formatter: '{value}g' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '抗生素',
        type: 'line',
        stack: 'Total',
        areaStyle: { opacity: 0.1 },
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#f5222d' }
      },
      {
        name: '消毒剂',
        type: 'line',
        stack: 'Total',
        areaStyle: { opacity: 0.1 },
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '营养/中草药',
        type: 'line',
        stack: 'Total',
        areaStyle: { opacity: 0.1 },
        data: [150, 232, 201, 154, 190, 330, 410],
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  const reasonOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
    series: [
      {
        name: '用药原因',
        type: 'pie',
        radius: [20, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: { borderRadius: 4 },
        data: [
          { value: 40, name: '预防性消毒', itemStyle: { color: '#52c41a' } },
          { value: 25, name: '肠炎治疗', itemStyle: { color: '#f5222d' } },
          { value: 15, name: '烂鳃病治疗', itemStyle: { color: '#fa8c16' } },
          { value: 12, name: '寄生虫治理', itemStyle: { color: '#1890ff' } },
          { value: 8, name: '应激缓解', itemStyle: { color: '#722ed1' } },
        ],
        label: { fontSize: 10, color: '#595959' }
      }
    ]
  };

  return (
    <Row gutter={12}>
      <Col span={14}>
        <Card 
          title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>药品消耗趋势分析 / CONSUMPTION</span>}
          variant="borderless" 
          className="fin-card"
          styles={{ body: { padding: '16px 24px' } }}
        >
          <ReactECharts option={trendOption} style={{ height: '280px' }} />
        </Card>
      </Col>
      <Col span={10}>
        <Card 
          title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>病害原因分布 / REASON DIST.</span>}
          variant="borderless" 
          className="fin-card"
          styles={{ body: { padding: '16px 24px' } }}
        >
          <ReactECharts option={reasonOption} style={{ height: '280px' }} />
        </Card>
      </Col>
    </Row>
  );
};

export default MedicineAnalysis;
