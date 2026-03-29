import { Badge, Card, Timeline, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

interface PlanDetailTimelineProps {
  pondName: string;
}

const PlanDetailTimeline: React.FC<PlanDetailTimelineProps> = ({ pondName }) => {
  const timelineData = [
    {
      time: '2026-03-01',
      title: '投放鱼苗',
      content: '萧山 1 号塘 投放 3 万尾草鱼苗，平均规格 5cm。',
      status: 'finish',
    },
    {
      time: '2026-03-15',
      title: '苗种期防疫',
      content: '全塘用药防疫，监测水质溶氧及 PH 值。',
      status: 'finish',
    },
    {
      time: '2026-04-01',
      title: '生长期调水',
      content: '进入生长期，增加换水量，维持藻相平衡。',
      status: 'process',
    },
    {
      time: '2026-05-15',
      title: '育肥期强化投喂',
      content: '增加投喂量，配合功能性饲料，促进生长。',
      status: 'wait',
    },
    {
      time: '2026-06-30',
      title: '成品捕捞',
      content: '预计捕捞 2 万斤，规格 2 斤/尾以上。',
      status: 'wait',
    },
  ];

  return (
    <Card
      title={`${pondName} 全周期生产进度追踪`}
      styles={{ body: { padding: '24px' } }}
      style={{ height: '100%', minHeight: '800px' }}
    >
      <Timeline
        mode="alternate"
        items={timelineData.map((item) => ({
          label: <Text type="secondary">{item.time}</Text>,
          children: (
            <div style={{ padding: '0 16px' }}>
              <Title level={5} style={{ margin: '0 0 8px 0' }}>
                {item.title}
                {item.status === 'finish' ? (
                  <Badge status="success" style={{ marginLeft: 8 }} />
                ) : item.status === 'process' ? (
                  <Badge status="processing" style={{ marginLeft: 8 }} />
                ) : (
                  <Badge status="default" style={{ marginLeft: 8 }} />
                )}
              </Title>
              <Text style={{ fontSize: 13, color: '#595959' }}>{item.content}</Text>
            </div>
          ),
          color: item.status === 'finish' ? 'green' : item.status === 'process' ? 'blue' : 'gray',
        }))}
      />
    </Card>
  );
};

export default PlanDetailTimeline;
