import { Card, Segmented, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo, useState } from 'react';
import {type PondWaterLog}from '@/services/api/water';
import { getPondDetailTrend } from '@/services/api/water';
import { useEffect } from 'react';
import type { PondStatusItem } from '@/models/pond';


const { Title } = Typography;

interface QualityTrendChartProps {
  pond?: PondStatusItem;
  loading?: boolean;
}

const QualityTrendChart: React.FC<QualityTrendChartProps> = ({ pond }) => {
  const [metric, setMetric] = useState<'oxygen' | 'temp' | 'ph'>('oxygen');
  const [loading, setLoading] = useState(false);

  const [trendData, setTrendData] = useState<PondWaterLog[]>([]);
  useEffect(() => {
    if (!pond?.id) {
      setTrendData([]);
      return;
    }

    const fetchTrend = async () => {
      setLoading(true);
      try {
        const response = await getPondDetailTrend(pond.id); // 拦截器已返回 data 数组
        setTrendData(response.data || []);
      } catch (error) {
        console.error('获取趋势数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [pond?.id]);




  // 趋势数据
  const chartOptions = useMemo(() => {
    if (!pond) return {};
    if (trendData.length === 0) return {};




    //获取数据
    const times = trendData.map(item =>
      new Date(item.timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );

    const data = trendData.map(item => {
      if (metric === 'oxygen') return item.dissolvedOxygen;
      if (metric === 'temp') return item.waterTemperature;
      return item.pH;
    }).map(val => (val != null ? Number(val.toFixed(2)) : null));

    
    //配置指标
    const metricLabels = {
      oxygen: { name: '溶氧量', unit: 'mg/L', color: '#1f2937', warnLine: 5, errorLine: 4 },
      temp: { name: '水温', unit: '℃', color: '#9ca3af', warnLine: 28, errorLine: 32 },
      ph: { name: 'PH值', unit: '', color: '#6b7280', warnLine: 8.5, errorLine: 9.0 },
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
      grid: {left: '3%', right: '4%',bottom: '3%', containLabel: true,
      },
      xAxis: {type: 'category',boundaryGap: false,data: times,
      },
      yAxis: {type: 'value',name: currentMetric.unit,scale: true,
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
                lineStyle: { color: '#9ca3af', type: 'dashed' },
              },
              {
                yAxis: currentMetric.errorLine,
                name: '报警线',
                lineStyle: { color: '#ef4444', type: 'dashed' },
              },
            ],
          },
        },
      ],
    };
  }, [pond, metric,trendData]);





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
