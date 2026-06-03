import { Badge, Card, Timeline, Typography } from 'antd';
import React, { useEffect }  from 'react';
import{ getPondTimeline } from '@/services/api/production/task';

const { Text, Title } = Typography;

type TimelineStatus = 'finish' | 'process' | 'wait';

interface TimelineItem {
  time: string;
  title: string;
  content: string;
  status: TimelineStatus;
}

interface PlanDetailTimelineProps {
  pond: {
    Name: string;
    Id: string;
  };
}

/** 后端状态 → 时间线状态 */
function mapTimelineStatus(status: string): TimelineStatus {
  if (status === 'done') return 'finish';
  if (status === 'doing') return 'process';
  return 'wait';
}

/** 后端 ProdTask → TimelineItem */
function toTimelineItem(task: any): TimelineItem {
  const timeStr = task.actionTime || '';
  const time = timeStr.length >= 10 ? timeStr.substring(0, 10) : timeStr;
  // 构建更丰富的内容描述
  const parts: string[] = [];
  if (task.feedAmount) parts.push(`投喂量 ${task.feedAmount}kg`);
  if (task.drugName) parts.push(`药品 ${task.drugName} ${task.dosage || ''}`);
  if (task.feedVariety) parts.push(`饲料 ${task.feedVariety}`);
  const content = parts.length > 0 ? parts.join('，') : (task.taskTitle || '');
  return {
    time,
    title: task.taskTitle || '',
    content,
    status: mapTimelineStatus(task.status),
  };
}

const PlanDetailTimeline: React.FC<PlanDetailTimelineProps> = ({ pond }) => {
  const [timelineData, setTimelineData] = React.useState<TimelineItem[]>([]);

  const fetchTimeline = async () => {
    if (!pond.Id) return;
    try {
      const response = await getPondTimeline(pond.Id);
      const data = response.data;
      if (Array.isArray(data)) {
        setTimelineData(data.map(toTimelineItem));
      }
    } catch (error) {
      console.error('获取时间线失败:', error);
      setTimelineData([]);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [pond.Id]);

  if (timelineData.length === 0) {
    return (
      <Card
        title={`${pond.Name || '未选择塘口'} 全周期生产进度追踪`}
        styles={{ body: { padding: '24px' } }}
        style={{ height: '100%', minHeight: '500px' }}
      >
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          暂无生产进度数据
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`${pond.Name} 全周期生产进度追踪`}
      styles={{ body: { padding: '24px' } }}
      style={{ height: '100%', minHeight: '500px' }}
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
