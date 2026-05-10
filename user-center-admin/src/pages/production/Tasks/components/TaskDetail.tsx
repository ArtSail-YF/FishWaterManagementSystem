import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Divider,
  Card,
} from 'antd';
import { ClockCircleOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待办', color: 'blue' },
  assigned: { label: '已派发', color: 'cyan' },
  doing: { label: '进行中', color: 'orange' },
  done: { label: '已完成', color: 'green' },
  skipped: { label: '已跳过', color: 'gray' },
  expired: { label: '已过期', color: 'red' },
};

const TARGET_TYPE_MAP: Record<string, string> = {
  pond: '塘口',
  cage: '网箱',
  vsl: '工船',
};

interface TaskDetailProps {
  visible: boolean;
  onCancel: () => void;
  task: any;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ visible, onCancel, task }) => {
  if (!task) return null;

  const statusConfig = STATUS_MAP[task.status] || { label: task.status, color: 'default' };

  return (
    <Modal
      title="任务详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="任务标题">
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>{task.taskTitle}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="任务ID">
          {task.id}
        </Descriptions.Item>
        <Descriptions.Item label="来源计划ID">
          {task.planId || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="所属基地">
          {task.baseName || task.baseId || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="目标类型">
          {TARGET_TYPE_MAP[task.targetType] || task.targetType || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="目标ID">
          {task.targetName || task.targetId || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="任务状态">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="执行人">
          <UserOutlined style={{ marginRight: 4 }} />
          {task.assigneeName || task.assigneeId || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="要求执行时间">
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {task.actionTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="最晚完成时间" span={2}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {task.deadlineTime || '-'}
        </Descriptions.Item>
        {task.cancelReason && (
          <Descriptions.Item label="取消/跳过原因" span={2}>
            {task.cancelReason}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '16px 0' }} />
      <Descriptions column={2} size="small">
        <Descriptions.Item label="创建时间">
          <DatabaseOutlined style={{ marginRight: 4 }} />
          {task.createdAt || '-'}
        </Descriptions.Item>
        {task.updatedAt && (
          <Descriptions.Item label="更新时间">
            {task.updatedAt}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default TaskDetail;
