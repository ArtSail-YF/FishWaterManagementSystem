import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag, Empty, Spin } from 'antd';
import { searchTasks } from '@/services/api/production/task';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待办', color: 'default' },
  assigned: { label: '已指派', color: 'blue' },
  doing: { label: '进行中', color: 'orange' },
  done: { label: '已完成', color: 'green' },
  skipped: { label: '已跳过', color: 'default' },
  expired: { label: '已过期', color: 'red' },
};

interface PlanTaskModalProps {
  visible: boolean;
  onCancel: () => void;
  planId: number;
  planTitle: string;
}

interface TaskItem {
  id: number;
  taskTitle: string;
  actionTime?: string;
  deadlineTime?: string;
  status: string;
  assigneeName?: string;
  priority?: string;
}

const PlanTaskModal: React.FC<PlanTaskModalProps> = ({ visible, onCancel, planId, planTitle }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && planId) {
      fetchTasks();
    }
  }, [visible, planId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await searchTasks({ current: 1, pageSize: 100, planId });
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskTitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: '执行时间',
      dataIndex: 'actionTime',
      width: 160,
      render: (v: string) => v || '-',
    },
    {
      title: '截止时间',
      dataIndex: 'deadlineTime',
      width: 160,
      render: (v: string) => v || '-',
    },
    {
      title: '执行人',
      dataIndex: 'assigneeName',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => {
        const c = STATUS_MAP[v];
        return c ? <Tag color={c.color}>{c.label}</Tag> : v;
      },
    },
  ];

  return (
    <Modal
      title={`关联任务 - ${planTitle}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
      ) : tasks.length === 0 ? (
        <Empty description="暂无关联任务" />
      ) : (
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
        />
      )}
    </Modal>
  );
};

export default PlanTaskModal;
