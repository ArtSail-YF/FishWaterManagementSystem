import { Badge, Card, Drawer, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { WarningHistoryRecord } from '@/services/ant-design-pro/warning';

const { Text } = Typography;

interface HistoryTableProps {
  data: WarningHistoryRecord[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<WarningHistoryRecord | null>(null);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'resolved': return <Tag color="success" style={{ borderRadius: 2, fontSize: 10 }}>已解决</Tag>;
      case 'ignored': return <Tag color="default" style={{ borderRadius: 2, fontSize: 10 }}>误报/忽略</Tag>;
      case 'pending': return <Tag color="error" style={{ borderRadius: 2, fontSize: 10 }}>未处理</Tag>;
      default: return null;
    }
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'P0': return { color: '#cf1322', fontWeight: 'bold' };
      case 'P1': return { color: '#faad14', fontWeight: 'bold' };
      case 'P2': return { color: '#1890ff', fontWeight: 'bold' };
      default: return {};
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      className: 'fin-number',
      render: (text: string) => <span style={{ fontSize: 11, color: '#8c8c8c' }}>{text}</span>,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 60,
      align: 'center' as const,
      render: (level: string) => <span style={{ fontSize: 12, ...getLevelStyle(level) }}>{level}</span>,
    },
    {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      className: 'fin-number',
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (text: string) => <span style={{ fontWeight: 600, fontSize: 12 }}>{text}</span>,
    },
    {
      title: '预警内容',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
      render: (text: string) => <span style={{ fontSize: 12 }}>{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
  ];

  const chartOption = {
    title: { text: '预警时刻时序分析 (前後 1H)', left: 'center', textStyle: { fontSize: 12, color: '#8c8c8c' } },
    grid: { top: 40, bottom: 30, left: 40, right: 20 },
    xAxis: { type: 'category', data: ['-60m', '-45m', '-30m', '-15m', '触发', '+15m', '+30m', '+45m', '+60m'], axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', scale: true, axisLabel: { fontSize: 10 } },
    series: [{
      data: [5.5, 5.4, 5.2, 4.8, 2.1, 3.5, 4.5, 5.1, 5.3],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#cf1322' },
      areaStyle: { opacity: 0.1 },
      markPoint: { data: [{ type: 'min', name: '触发点', itemStyle: { color: '#cf1322' } }] }
    }]
  };

  return (
    <Card className="fin-card" styles={{ body: { padding: 0 } }}>
      <Table 
        dataSource={data} 
        columns={columns} 
        size="small"
        pagination={{ size: 'small', showSizeChanger: true }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRecord(record);
            setDrawerVisible(true);
          },
          style: { cursor: 'pointer' }
        })}
      />
      
      <Drawer
        title={<div style={{ fontSize: 14 }}>预警深度复盘 / ALERT DEEP-DIVE - {selectedRecord?.id}</div>}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: { padding: '16px' } }}
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><Text type="secondary" style={{ fontSize: 12 }}>来源 SOURCE</Text><div style={{ fontWeight: 600 }}>{selectedRecord.source}</div></div>
              <div><Text type="secondary" style={{ fontSize: 12 }}>级别 LEVEL</Text><div style={{ ...getLevelStyle(selectedRecord.level) }}>{selectedRecord.level}</div></div>
              <div><Text type="secondary" style={{ fontSize: 12 }}>发生时间 START</Text><div className="fin-number">{selectedRecord.startTime}</div></div>
              <div><Text type="secondary" style={{ fontSize: 12 }}>恢复时间 END</Text><div className="fin-number">{selectedRecord.endTime}</div></div>
            </div>
            
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>异常描述 DESCRIPTION</Text>
              <div style={{ padding: '8px', backgroundColor: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, marginTop: 4 }}>
                {selectedRecord.description}
              </div>
            </div>

            <Card className="fin-card" styles={{ body: { padding: '12px' } }}>
              <ReactECharts option={chartOption} style={{ height: '200px' }} />
            </Card>

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>处置方案 & 备注 COMMENT</Text>
              <div style={{ marginTop: 8, paddingLeft: 8, borderLeft: '2px solid #d9d9d9' }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{selectedRecord.handler} (系统管理员)</div>
                <div style={{ color: '#595959', fontSize: 12, marginTop: 4 }}>{selectedRecord.comment}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </Card>
  );
};

export default HistoryTable;
