import { Card, Row, Col, Select, DatePicker } from 'antd';
import { Line, Area, Column } from '@antv/g2plot';
import React, { useEffect, useRef, useState } from 'react';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialTrendAnalysis: React.FC = () => {
  const revenueTrendRef = useRef<HTMLDivElement>(null);
  const profitMarginRef = useRef<HTMLDivElement>(null);
  const costAnalysisRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('year');

  // 模拟财务趋势数据
  const trendData = {
    // 月度趋势数据
    monthly: [
      { period: '1月', revenue: 1200, cost: 800, profit: 400, profitMargin: 33.3, type: '收入' },
      { period: '2月', revenue: 1320, cost: 900, profit: 420, profitMargin: 31.8, type: '收入' },
      { period: '3月', revenue: 1010, cost: 700, profit: 310, profitMargin: 30.7, type: '收入' },
      { period: '4月', revenue: 1340, cost: 850, profit: 490, profitMargin: 36.6, type: '收入' },
      { period: '5月', revenue: 900, cost: 600, profit: 300, profitMargin: 33.3, type: '收入' },
      { period: '6月', revenue: 2300, cost: 1500, profit: 800, profitMargin: 34.8, type: '收入' },
      { period: '7月', revenue: 2100, cost: 1400, profit: 700, profitMargin: 33.3, type: '收入' },
      { period: '8月', revenue: 1820, cost: 1200, profit: 620, profitMargin: 34.1, type: '收入' },
      { period: '9月', revenue: 1910, cost: 1300, profit: 610, profitMargin: 31.9, type: '收入' },
      { period: '10月', revenue: 2340, cost: 1500, profit: 840, profitMargin: 35.9, type: '收入' },
      { period: '11月', revenue: 2900, cost: 1800, profit: 1100, profitMargin: 37.9, type: '收入' },
      { period: '12月', revenue: 3300, cost: 2000, profit: 1300, profitMargin: 39.4, type: '收入' },
    ],
    // 季度数据
    quarterly: [
      { period: 'Q1', revenue: 3530, cost: 2400, profit: 1130, profitMargin: 32.0, type: '收入' },
      { period: 'Q2', revenue: 4540, cost: 2950, profit: 1590, profitMargin: 35.0, type: '收入' },
      { period: 'Q3', revenue: 5830, cost: 3900, profit: 1930, profitMargin: 33.1, type: '收入' },
      { period: 'Q4', revenue: 8540, cost: 5300, profit: 3240, profitMargin: 37.9, type: '收入' },
    ],
  };

  const getCurrentData = () => {
    const baseData = timeRange === 'quarter' ? trendData.quarterly : trendData.monthly;
    
    // 转换为适合图表显示的多系列数据格式
    const revenueData = baseData.map(item => ({
      period: item.period,
      value: item.revenue,
      type: '收入'
    }));
    
    const costData = baseData.map(item => ({
      period: item.period,
      value: item.cost,
      type: '成本'
    }));
    
    const profitData = baseData.map(item => ({
      period: item.period,
      value: item.profit,
      type: '利润'
    }));
    
    return [...revenueData, ...costData, ...profitData];
  };

  useEffect(() => {
    if (revenueTrendRef.current) {
      const data = getCurrentData();
      const config = {
        data,
        xField: 'period',
        yField: 'value',
        seriesField: 'type',
        yAxis: {
          label: {
            formatter: (v) => `${v}万`,
          },
        },
        meta: {
          value: { alias: '金额(万)' },
        },
        smooth: true,
        animation: {
          appear: {
            animation: 'path-in',
            duration: 1000,
          },
        },
        point: {
          size: 4,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#1f2937',
            lineWidth: 2,
          },
        },
        interactions: [{ type: 'marker-active' }],
      };

      let plot;
      if (chartType === 'line') {
        plot = new Line(revenueTrendRef.current, config);
      } else if (chartType === 'area') {
        plot = new Area(revenueTrendRef.current, {
          ...config,
          line: {
            style: {
              lineWidth: 2,
            },
          },
          areaStyle: {
            fill: 'l(270) 0:#ffffff 0.5:#1f2937 1:#1f2937',
          },
        });
      }

      if (plot) {
        plot.render();
        return () => {
          plot.destroy();
        };
      }
    }
  }, [chartType, timeRange]);

  useEffect(() => {
    if (profitMarginRef.current) {
      const baseData = timeRange === 'quarter' ? trendData.quarterly : trendData.monthly;
      const profitMarginData = baseData.map(item => ({
        period: item.period,
        value: item.profitMargin,
        type: '利润率'
      }));
      
      const plot = new Line(profitMarginRef.current, {
        data: profitMarginData,
        xField: 'period',
        yField: 'value',
        yAxis: {
          label: {
            formatter: (v) => `${v}%`,
          },
        },
        meta: {
          value: { alias: '利润率(%)' },
        },
        smooth: true,
        color: '#6b7280',
        lineStyle: {
          lineWidth: 3,
        },
        point: {
          size: 4,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#6b7280',
            lineWidth: 2,
          },
        },
        annotations: [
          {
            type: 'regionFilter',
            start: ['min', 'min'],
            end: ['max', 'max'],
            color: '#f6ffed',
          },
        ],
      });
      plot.render();

      return () => {
        plot.destroy();
      };
    }
  }, [timeRange]);

  useEffect(() => {
    if (costAnalysisRef.current) {
      const baseData = timeRange === 'quarter' ? trendData.quarterly : trendData.monthly;
      const costAnalysisData = [
        ...baseData.map(item => ({
          period: item.period,
          value: item.revenue,
          type: '收入'
        })),
        ...baseData.map(item => ({
          period: item.period,
          value: item.cost,
          type: '成本'
        }))
      ];
      
      const plot = new Column(costAnalysisRef.current, {
        data: costAnalysisData,
        xField: 'period',
        yField: 'value',
        isGroup: true,
        seriesField: 'type',
        yAxis: {
          label: {
            formatter: (v) => `${v}万`,
          },
        },
        legend: {
          position: 'top',
        },
        color: ['#1f2937', '#ef4444'],
        label: {
          position: 'middle',
          style: {
            fill: '#fff',
          },
        },
      });
      plot.render();

      return () => {
        plot.destroy();
      };
    }
  }, [timeRange]);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
          <Option value="month">月度</Option>
          <Option value="quarter">季度</Option>
          <Option value="year">年度</Option>
        </Select>
        
        <Select value={chartType} onChange={setChartType} style={{ width: 120 }}>
          <Option value="line">折线图</Option>
          <Option value="area">面积图</Option>
        </Select>

        <RangePicker picker={timeRange === 'quarter' ? 'quarter' : 'month'} />
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="收入趋势分析" size="small">
            <div ref={revenueTrendRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="利润率变化" size="small">
            <div ref={profitMarginRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="收入成本对比分析" size="small">
            <div ref={costAnalysisRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialTrendAnalysis;