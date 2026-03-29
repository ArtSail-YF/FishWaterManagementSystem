import { Table, Tag, Progress } from 'antd';
import React from 'react';

interface BaseRankingProps {
  month: string;
}

const BaseRanking: React.FC<BaseRankingProps> = ({ month }) => {
  const data = [
    { key: '1', base: '萧山基地', yield: 180, profit: 45, roi: 1.25 },
    { key: '2', base: '余杭基地', yield: 220, profit: 55, roi: 1.45 },
    { key: '3', base: '富阳基地', yield: 150, profit: 30, roi: 1.10 },
    { key: '4', base: '桐庐基地', yield: 190, profit: 40, roi: 1.30 },
  ].sort((a, b) => b.profit - a.profit);

  const columns = [
    {
      title: '基地名称',
      dataIndex: 'base',
      key: 'base',
      render: (text: string) => <span style={{ fontWeight: 600, fontSize: '12px' }}>{text}</span>,
    },
    {
      title: '产量(T)',
      dataIndex: 'yield',
      key: 'yield',
      className: 'fin-number',
      align: 'right' as const,
      render: (val: number) => <span style={{ fontSize: '12px' }}>{val}</span>,
    },
    {
      title: '利润(W)',
      dataIndex: 'profit',
      key: 'profit',
      className: 'fin-number',
      align: 'right' as const,
      render: (val: number) => (
        <span className="fin-trend-up" style={{ fontSize: '12px', fontWeight: 600 }}>
          {val}
        </span>
      ),
    },
    {
      title: 'ROI / 效率',
      dataIndex: 'roi',
      key: 'roi',
      width: 120,
      render: (val: number) => {
        const percent = Math.min((val / 2) * 100, 100);
        return (
          <div style={{ width: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: 2 }}>
              <span className="fin-number">{val.toFixed(2)}</span>
            </div>
            <Progress 
              percent={percent} 
              size={[Infinity, 4]} 
              showInfo={false} 
              strokeColor="#722ed1"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ 
        fontSize: '12px', 
        fontWeight: '700', 
        color: '#8c8c8c', 
        textAlign: 'center', 
        marginBottom: 16,
        textTransform: 'uppercase'
      }}>
        Base Performance Leaderboard / 基地效益排行
      </div>
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false} 
        size="small"
        bordered={false}
        className="fin-table"
        rowClassName="fin-table-row"
      />
    </div>
  );
};

export default BaseRanking;

