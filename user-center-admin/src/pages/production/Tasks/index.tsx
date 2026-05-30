import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined, FileTextOutlined, ClockCircleOutlined, SendOutlined, SyncOutlined, AlertOutlined, CloudOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic, Badge, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';

const { Text } = Typography;
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import {
  searchTasks,
  deleteTask,
  createTask,
  updateTask,
  completeTask,
  skipTask,
  getTaskById,
} from '@/services/api/production/task';
import { getBaseOptions } from '@/services/api/base';
import { getPondOptions } from '@/services/api/pond';
import { getUserOptions } from '@/services/api/user';

const STATUS_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: '待办', bgColor: '#EBE5DE', textColor: '#5C4F42' },
  assigned: { label: '已派发', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  doing: { label: '进行中', bgColor: '#F5EDD6', textColor: '#A0843A' },
  done: { label: '已完成', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  skipped: { label: '已跳过', bgColor: '#EBE5DE', textColor: '#7A6E64' },
  expired: { label: '已过期', bgColor: '#F5E0DC', textColor: '#B54E3C' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low: { label: '低', color: '#8c8c8c' },
  medium: { label: '中', color: '#A0843A' },
  high: { label: '高', color: '#B54E3C' },
  urgent: { label: '紧急', color: '#cf1322' },
};

const TARGET_TYPE_MAP: Record<string, string> = {
  pond: '塘口',
  cage: '网箱',
  vsl: '工船',
};

interface Task {
  id: number;
  planId?: number;
  baseId: number;
  taskTitle: string;
  targetType: string;
  targetId?: number;
  actionTime?: string;
  deadlineTime?: string;
  status: string;
  assigneeId?: number;
  cancelReason?: string;
  createdAt: string;
  baseName?: string;
  targetName?: string;
  assigneeName?: string;
}

const Tasks: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Task[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [bases, setBases] = useState<Array<{ label: string; value: number }>>([]);
  const [ponds, setPonds] = useState<Array<{ label: string; value: number }>>([]);
  const [users, setUsers] = useState<Array<{ label: string; value: number }>>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchBases();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchBases = async () => {
    try {
      const options = await getBaseOptions();
      setBases(options);
    } catch (error) {
      console.error('获取基地列表失败:', error);
    }
  };

  const fetchPonds = async (baseId: number) => {
    try {
      const options = await getPondOptions(baseId);
      setPonds(options);
    } catch (error) {
      console.error('获取塘口列表失败:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const options = await getUserOptions();
      setUsers(options);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  const fetchTasks = async (params: any = {}) => {
    setLoading(true);
    try {
      const apiParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
        ...params,
      };
      const response = await searchTasks(apiParams);
      const taskList = response.data || [];
      setData(taskList);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
      return { data: taskList, total: response.total || 0 };
    } catch (error) {
      message.error('获取任务列表失败');
      console.error('获取任务列表失败:', error);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (formValues?: any) => {
    try {
      if (formValues) {
        if (isEdit && selectedTask?.id) {
          await updateTask(selectedTask.id, formValues);
        } else {
          await createTask(formValues);
        }
      }
      await fetchTasks();
      setVisible(false);
      setSelectedTask(null);
      setIsEdit(false);
      message.success(isEdit ? '任务更新成功' : '任务创建成功');
    } catch (error: any) {
      message.error(error.message || '操作失败，请重试');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定要删除这个任务吗？',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTask(id);
          message.success('任务已删除');
          fetchTasks();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleComplete = async (id: number) => {
    Modal.confirm({
      title: '完成确认',
      content: '确定要标记这个任务为已完成吗？',
      okType: 'primary',
      onOk: async () => {
        try {
          await completeTask(id);
          message.success('任务已完成');
          fetchTasks();
        } catch (error) {
          message.error('操作失败，请重试');
        }
      },
    });
  };
  const handleSkip = (id: number) => {
    Modal.confirm({
      title: '跳过确认',
      content: '请输入跳过原因（可选）',
      okText: '确认跳过',
      onOk: async () => {
        try {
          await skipTask(id, { reason: '手动跳过' });
          message.success('任务已跳过');
          fetchTasks();
        } catch (error) {
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setDetailVisible(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEdit(true);
    setVisible(true);
  };

  const handleBatchDelete = (selectedRows: Task[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条任务吗？`,
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            if (row.id) await deleteTask(row.id);
          }
          message.success(`已删除 ${selectedRows.length} 条任务`);
          fetchTasks();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  const stats = useMemo(() => {
    const s: Record<string, number> = { pending: 0, assigned: 0, doing: 0, done: 0, skipped: 0, expired: 0 };
    data.forEach(t => {
      const status = t.status || 'pending';
      if (s[status] !== undefined) s[status]++;
    });
    return s;
  }, [data]);
  const columns: ProColumns<Task>[] = [
    { title: '任务名称', dataIndex: 'taskTitle', width: 200, ellipsis: true },
    { title: '所属基地', dataIndex: 'baseName', width: 120, hideInTable: true, hideInSearch: false },
    { title: '作业对象', dataIndex: 'targetName', width: 120 },
    {
      title: '执行时间', dataIndex: 'actionTime', width: 160,
      render: (_, r) => r.actionTime ? dayjs(r.actionTime).format('MM-DD HH:mm') : '-',
    },
    {
      title: '截止时间', dataIndex: 'deadlineTime', width: 160,
      render: (_, r) => r.deadlineTime ? dayjs(r.deadlineTime).format('MM-DD HH:mm') : '-',
    },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (_, r) => {
        const c = STATUS_MAP[r.status || ''];
        return c ? (
          <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none' }}>
            {c.label}
          </Tag>
        ) : r.status;
      },
    },
    {
      title: '执行人', dataIndex: 'assigneeName', width: 100,
      render: (_, r) => r.assigneeName || <Tag icon={<UserOutlined />}>未分配</Tag>,
    },
    {
      title: '优先级', dataIndex: 'priority', width: 70,
      render: (val: string) => {
        const p = PRIORITY_MAP[val];
        return p ? <Tag style={{ backgroundColor: p.color + '20', color: p.color, border: 'none' }}>{p.label}</Tag> : '-';
      },
    },
    // IoT 设备（预留）
    {
      title: 'IoT 设备', dataIndex: 'deviceId', width: 90,
      render: (val: any) =>
        val ? <Tag icon={<CloudOutlined />} color="#2B6B8A">设备 #{val}</Tag> : '-',
    },
    {
      title: '操作', width: 300, fixed: 'right',
      render: (_, record) => [
        <Button type="link" size="small" icon={<EyeOutlined />} key="view" onClick={() => handleView(record)}>查看</Button>,
        record.status === 'pending' && (
          <Button type="link" size="small" icon={<EditOutlined />} key="edit" onClick={() => handleEdit(record)} style={{ color: '#8c8c8c' }}>编辑</Button>
        ),
        (record.status === 'assigned' || record.status === 'doing') && (
          <Button type="link" size="small" icon={<CheckCircleOutlined />} key="complete" onClick={() => handleComplete(record.id)} style={{ color: '#8c8c8c' }}>完成</Button>
        ),
        (record.status === 'pending' || record.status === 'assigned') && (
          <Button type="link" size="small" icon={<CloseCircleOutlined />} key="skip" onClick={() => handleSkip(record.id)} style={{ color: '#8c8c8c' }}>跳过</Button>
        ),
        record.status === 'pending' && (
          <Button type="link" size="small" icon={<DeleteOutlined />} key="delete" onClick={() => handleDelete(record.id)} style={{ color: '#8c8c8c' }}>删除</Button>
        ),
      ],
    },
  ];
  return (
    <PageContainer>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>任务总数</Text>}
              value={data.length}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>待办</Text>}
              value={stats.pending}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已派发</Text>}
              value={stats.assigned}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>进行中</Text>}
              value={stats.doing}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已完成</Text>}
              value={stats.done}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已过期</Text>}
              value={stats.expired}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <ProTable<Task>
        headerTitle="任务管理"
        columns={columns}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={async (params = {}) => {
          setSearchParams(params);
          setPagination(prev => ({ ...prev, current: params.current || 1, pageSize: params.pageSize || 10 }));
          const result = await fetchTasks({ ...params, current: params.current || 1, pageSize: params.pageSize || 10 });
          return { data: result.data, success: true, total: result.total };
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, ps) => setPagination({ ...pagination, current: page, pageSize: ps || 10 }),
        }}
        rowSelection={{}}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
          <Space size={16}>
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleBatchDelete(selectedRows)}>批量删除</Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setIsEdit(false); setSelectedTask(null); setVisible(true); }}>
            新建任务
          </Button>,
        ]}
        size="small"
        scroll={{ x: 1500 }}
      />
      <TaskForm
        visible={visible}
        onCancel={() => { setVisible(false); setSelectedTask(null); setIsEdit(false); }}
        onOk={handleCreate}
        initialValues={isEdit ? selectedTask : undefined}
        isEdit={isEdit}
        bases={bases}
        ponds={ponds}
        users={users}
      />
      <TaskDetail
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        task={selectedTask}
      />
    </PageContainer>
  );
};

export default Tasks;
