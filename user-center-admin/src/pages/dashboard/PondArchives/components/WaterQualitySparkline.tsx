import ReactECharts from 'echarts-for-react';
import React from 'react';

interface WaterQualitySparklineProps {
  data: number[];
  color?: string;
  height?: string;
}

const WaterQualitySparkline: React.FC<WaterQualitySparklineProps> = ({ data, color = '#1f2937', height = '40px' }) => {
  const option = {
    grid: { left: 0, right: 0, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false, min: Math.min(...data) - 0.5 },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1.5, color: color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${color}33` },
              { offset: 1, color: `${color}05` }
            ]
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: height, width: '100%' }} />;
};

export default WaterQualitySparkline;
