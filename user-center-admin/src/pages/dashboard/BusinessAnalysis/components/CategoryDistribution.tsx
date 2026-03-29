import { Card, Col, Row } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';

interface CategoryDistributionProps {
  month: string;
  type: 'cost' | 'income';
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ month, type }) => {
  const option = useMemo(() => {
    const isCost = type === 'cost';
    const data = isCost ? [
      { value: 45, name: '饲料费用' },
      { value: 20, name: '苗种采购' },
      { value: 15, name: '人工成本' },
      { value: 10, name: '防疫/药品' },
      { value: 10, name: '水电/能耗' }
    ] : [
      { value: 60, name: '草鱼销售' },
      { value: 25, name: '鲈鱼销售' },
      { value: 15, name: '其它水产' },
      { value: 10, name: '龙虾销售' },
      { value: 8, name: '甲鱼销售' }
    ];

    const sortedData = data.sort((a, b) => b.value - a.value).slice(0, 5);
    const total = sortedData.reduce((sum, item) => sum + item.value, 0);

    return {
      title: {
        text: isCost ? 'ASSET ALLOCATION / 成本配置' : 'REVENUE MIX / 收入构成',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 12, fontWeight: '700', color: '#8c8c8c' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}万 ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { fontSize: 11 }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'middle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 10, color: '#595959' },
        formatter: (name: string) => {
          const item = sortedData.find(d => d.name === name);
          return `${name.padEnd(6, ' ')} | ${item?.value}W`;
        }
      },
      series: [
        {
          name: isCost ? '成本构成' : '收入构成',
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['35%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 2, borderColor: '#fff', borderWidth: 1 },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '12',
              fontWeight: 'bold',
              formatter: '{b}\n{d}%'
            }
          },
          data: sortedData
        }
      ],
      graphic: {
        type: 'text',
        left: '30%',
        top: '52%',
        style: {
          text: `TOTAL\n${total}W`,
          textAlign: 'center',
          fill: '#bfbfbf',
          fontSize: 10,
          fontWeight: '600'
        }
      }
    };
  }, [month, type]);

  return (
    <Card className="fin-card" styles={{ body: { padding: '16px' } }}>
      <ReactECharts option={option} style={{ height: '240px' }} />
    </Card>
  );
};

export default CategoryDistribution;
