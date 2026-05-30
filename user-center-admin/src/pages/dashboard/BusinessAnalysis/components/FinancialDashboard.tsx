import { Card, Row, Col, Statistic, Select } from 'antd';
import { Line, Column, Pie, DualAxes, Liquid } from '@antv/g2plot';
import React, { useEffect, useRef, useState } from 'react';

const { Option } = Select;

const FinancialDashboard: React.FC = () => {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const columnChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const dualAxesChartRef = useRef<HTMLDivElement>(null);
  const liquidChartRef = useRef<HTMLDivElement>(null);
  
  const [timeRange, setTimeRange] = useState('year');

  // 模拟财务数据
  const financialData = {
    // 月度收入成本数据
    monthly: [
      { month: '1月', revenue: 1200, cost: 800, profit: 400 },
      { month: '2月', revenue: 1320, cost: 900, profit: 420 },
      { month: '3月', revenue: 1010, cost: 700, profit: 310 },
      { month: '4月', revenue: 1340, cost: 850, profit: 490 },
      { month: '5月', revenue: 900, cost: 600, profit: 300 },
      { month: '6月', revenue: 2300, cost: 1500, profit: 800 },
      { month: '7月', revenue: 2100, cost: 1400, profit: 700 },
      { month: '8月', revenue: 1820, cost: 1200, profit: 620 },
      { month: '9月', revenue: 1910, cost: 1300, profit: 610 },
      { month: '10月', revenue: 2340, cost: 1500, profit: 840 },
      { month: '11月', revenue: 2900, cost: 1800, profit: 1100 },
      { month: '12月', revenue: 3300, cost: 2000, profit: 1300 },
    ],
    // 成本构成数据
    costDistribution: [
      { type: '饲料成本', value: 35 },
      { type: '人工成本', value: 25 },
      { type: '设备维护', value: 15 },
      { type: '水电费用', value: 10 },
      { type: '其他成本', value: 15 },
    ],
    // 收入构成数据
    revenueDistribution: [
      { type: '对虾销售', value: 45 },
      { type: '鱼类销售', value: 30 },
      { type: '贝类销售', value: 15 },
      { type: '其他收入', value: 10 },
    ],
  };

  useEffect(() => {
    if (lineChartRef.current) {
      const linePlot = new Line(lineChartRef.current, {
        data: financialData.monthly,
        xField: 'month',
        yField: 'revenue',
        seriesField: 'type',
        yAxis: {
          label: {
            formatter: (v) => `${v}万`,
          },
        },
        meta: {
          revenue: { alias: '收入(万)' },
          cost: { alias: '成本(万)' },
          profit: { alias: '利润(万)' },
        },
        legend: {
          position: 'top',
        },
        smooth: true,
        animation: {
          appear: {
            animation: 'path-in',
            duration: 1000,
          },
        },
      });
      linePlot.render();

      return () => {
        linePlot.destroy();
      };
    }
  }, [timeRange]);

  useEffect(() => {
    if (columnChartRef.current) {
      const columnPlot = new Column(columnChartRef.current, {
        data: financialData.monthly,
        xField: 'month',
        yField: 'profit',
        colorField: 'profit',
        color: ({ profit }) => {
          if (profit > 800) return '#6b7280';
          if (profit > 500) return '#9ca3af';
          return '#ef4444';
        },
        yAxis: {
          label: {
            formatter: (v) => `${v}万`,
          },
        },
        meta: {
          profit: { alias: '利润(万)' },
        },
        label: {
          position: 'middle',
          style: {
            fill: '#fff',
          },
        },
      });
      columnPlot.render();

      return () => {
        columnPlot.destroy();
      };
    }
  }, [timeRange]);

  useEffect(() => {
    if (pieChartRef.current) {
      const piePlot = new Pie(pieChartRef.current, {
        data: financialData.costDistribution,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
          type: 'outer',
          content: '{name} {percentage}',
        },
        interactions: [{ type: 'element-active' }],
      });
      piePlot.render();

      return () => {
        piePlot.destroy();
      };
    }
  }, [timeRange]);

  useEffect(() => {
    if (dualAxesChartRef.current) {
      const dualAxesPlot = new DualAxes(dualAxesChartRef.current, {
        data: [financialData.monthly, financialData.monthly],
        xField: 'month',
        yField: ['revenue', 'cost'],
        geometryOptions: [
          {
            geometry: 'line',
            color: '#1f2937',
            smooth: true,
          },
          {
            geometry: 'line',
            color: '#ef4444',
            smooth: true,
          },
        ],
        yAxis: {
          revenue: {
            label: {
              formatter: (v) => `${v}万`,
            },
          },
          cost: {
            label: {
              formatter: (v) => `${v}万`,
            },
          },
        },
      });
      dualAxesPlot.render();

      return () => {
        dualAxesPlot.destroy();
      };
    }
  }, [timeRange]);

  useEffect(() => {
    if (liquidChartRef.current) {
      const liquidPlot = new Liquid(liquidChartRef.current, {
        percent: 0.65,
        radius: 0.8,
        outline: {
          border: 2,
          distance: 4,
        },
        wave: {
          length: 128,
        },
        statistic: {
          title: {
            formatter: () => '利润率',
            style: {
              color: '#1f2937',
              fontSize: 16,
            },
          },
          content: {
            style: {
              fontSize: 24,
              fontWeight: 'bold',
            },
          },
        },
      });
      liquidPlot.render();

      return () => {
        liquidPlot.destroy();
      };
    }
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
          <Option value="month">月度</Option>
          <Option value="quarter">季度</Option>
          <Option value="year">年度</Option>
        </Select>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={12500}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="万"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成本"
              value={8500}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="万"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="净利润"
              value={4000}
              precision={2}
              valueStyle={{ color: '#1f2937' }}
              suffix="万"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="利润率"
              value={32}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="收入成本趋势分析" size="small">
            <div ref={lineChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="月度利润分析" size="small">
            <div ref={columnChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="成本构成分析" size="small">
            <div ref={pieChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="收入成本对比" size="small">
            <div ref={dualAxesChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="利润率指标" size="small">
            <div ref={liquidChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialDashboard;