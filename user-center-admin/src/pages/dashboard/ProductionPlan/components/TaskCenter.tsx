import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Empty, List, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import React from 'react';

const { Text } = Typography;

export interface TaskItem {
  id: string;
  time: string;
  type: 'feed' | 'medicine' | 'water' | 'harvest';
  content: string;
  status: 'pending' | 'completed' | 'overdue';
  executor: string;
}

interface TaskCenterProps {
  selectedDate: Dayjs;
  tasks: TaskItem[];
  onExecute: (id: string) => void;
}

const TaskCenter: React.FC<TaskCenterProps> = ({ selectedDate, tasks, onExecute }) => {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="default">待执行</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>;
      case 'overdue':
        return <Tag color="error">已逾期</Tag>;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feed': return 'blue';
      case 'medicine': return 'volcano';
      case 'water': return 'orange';
      case 'harvest': return 'green';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'feed': return '投喂';
      case 'medicine': return '用药';
      case 'water': return '换水';
      case 'harvest': return '捕捞';
      default: return '其他';
    }
  };

  return (
    <Card
      title={`${selectedDate.format('YYYY-MM-DD')} 任务列表`}
      styles={{ body: { padding: '16px' } }}
      style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}
    >
      <List
        dataSource={tasks}
        locale={{ emptyText: <Empty description="该日暂无生产任务" /> }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              item.status === 'pending' && (
                <Button type="primary" size="small" onClick={() => onExecute(item.id)}>
                  确认执行
                </Button>
              ),
            ].filter(Boolean)}
            style={{
              padding: '16px 8px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: item.status === 'completed' ? '#f6ffed' : 'transparent',
              transition: 'all 0.3s',
            }}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{item.content}</Text>
                  {getStatusTag(item.status)}
                </div>
              }
              description={
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 4 }}>
                    <Tag color={getTypeColor(item.type)}>{getTypeText(item.type)}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {item.time}
                    </Text>
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    执行人: {item.executor}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TaskCenter;
