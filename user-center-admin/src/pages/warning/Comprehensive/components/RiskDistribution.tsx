import { Card, Col, Row, Spin, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo, useState, useEffect } from 'react';
import { getRiskDistribution, type RiskDistributionData } from '@/services/ant-design-pro/warning';
import { MOCK_RISK_DISTRIBUTION } from '@/services/ant-design-pro/mock';

const RiskDistribution: React.FC = () => {
  const [data, setData] = useState<RiskDistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiskDistribution()
      .then(res => {
        setData(res.data || null);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取风险分布数据失败，使用降级数据:', error);
        setData(MOCK_RISK_DISTRIBUTION as RiskDistributionData);
        setLoading(false);
      });
  }, []);

  const heatmapOption = useMemo(() => {
    if (!data) return {};
    return {
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
        data: data.heatmap.x,
        splitArea: { show: true },
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'category',
        data: data.heatmap.y,
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
        data: data.heatmap.data,
        label: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }]
    };
  }, [data]);

  const donutOption = useMemo(() => {
    if (!data) return {};
    return {
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
          data: data.composition.map(item => ({
            value: item.value,
            name: item.name,
            itemStyle: { color: item.color }
          }))
        }
      ]
    };
  }, [data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Card className="fin-card" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin />
        </Card>
        <Card className="fin-card" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin />
        </Card>
      </div>
    );
  }

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
