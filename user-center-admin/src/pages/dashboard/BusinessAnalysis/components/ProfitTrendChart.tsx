import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';

interface ProfitTrendChartProps {
  onMonthClick: (month: string) => void;
}

const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ onMonthClick }) => {
  const option = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const revenueData = [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330];
    const costData = [80, 90, 70, 85, 60, 150, 140, 120, 130, 150, 180, 200];
    const profitData = revenueData.map((rev, idx) => rev - costData[idx]);

    return {
      title: {
        text: 'PRO-LEVEL 盈利与收支趋势分析',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: '700', color: '#595959' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { 
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
            fontSize: 11
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        textStyle: { color: '#595959', fontSize: 12 },
        formatter: (params: any) => {
          let res = `<div style="font-weight: 600; margin-bottom: 4px; border-bottom: 1px solid #f0f0f0; padding-bottom: 2px;">${params[0].name}</div>`;
          params.forEach((item: any) => {
            const color = item.color;
            res += `<div style="display: flex; justify-content: space-between; align-items: center; min-width: 120px; margin: 2px 0;">
              <span><span style="display:inline-block;margin-right:4px;border-radius:10px;width:8px;height:8px;background-color:${color};"></span>${item.seriesName}</span>
              <span class="fin-number" style="font-weight:600;">${item.value}万</span>
            </div>`;
          });
          return res;
        }
      },
      legend: {
        data: ['收入', '成本', '利润'],
        top: 30,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 11, color: '#8c8c8c' }
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '3%',
        top: '18%',
        containLabel: true,
        borderColor: '#f0f0f0',
        show: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: '#d9d9d9' } },
        axisLabel: { color: '#8c8c8c', fontSize: 10 },
        splitLine: { show: true, lineStyle: { color: '#f5f5f5', type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        name: 'AMT (W)',
        nameTextStyle: { color: '#bfbfbf', fontSize: 10, align: 'right' },
        axisLabel: { color: '#8c8c8c', fontSize: 10, className: 'fin-number' },
        splitLine: { show: true, lineStyle: { color: '#f0f0f0' } }
      },
      series: [
        {
          name: '利润',
          type: 'bar',
          data: profitData,
          barWidth: '35%',
          itemStyle: {
            color: '#3f8600',
            opacity: 0.6,
            borderRadius: [2, 2, 0, 0]
          }
        },
        {
          name: '收入',
          type: 'line',
          smooth: true,
          data: revenueData,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#cf1322', width: 2 },
          itemStyle: { color: '#cf1322', borderWidth: 2, borderColor: '#fff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(207, 19, 34, 0.1)' }, { offset: 1, color: 'rgba(207, 19, 34, 0)' }]
            }
          }
        },
        {
          name: '成本',
          type: 'line',
          smooth: true,
          data: costData,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#1f2937', width: 2 },
          itemStyle: { color: '#1f2937', borderWidth: 2, borderColor: '#fff' }
        }
      ]
    };
  }, []);

  const onChartClick = (params: any) => {
    if (params.componentType === 'series') {
      onMonthClick(params.name);
    }
  };

  return (
    <Card styles={{ body: { padding: '24px' } }} style={{ marginBottom: 16 }}>
      <ReactECharts 
        option={option} 
        style={{ height: '400px' }} 
        onEvents={{ click: onChartClick }}
      />
    </Card>
  );
};

export default ProfitTrendChart;
