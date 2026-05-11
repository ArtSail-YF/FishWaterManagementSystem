import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic, Badge } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import {
  searchTasks,
  deleteTask,
  completeTask,
  skipTask,
  getTaskById,
} from '@/services/api/production/task';
import { getBaseOptions } from '@/services/api/base';
import { getPondOptions } from '@/services/api/pond';
import { getUserOptions } from '@/services/api/user';

const STATUS_MAP: Record<string, { label: string; color: string; status: 'success' | 'processing' | 'default' | 'error' | 'warning' }> = {
  pending: { label: '待办', color: 'blue', status: 'default' },
  assigned: { label: '已派发', color: 'cyan', status: 'processing' },
  doing: { label: '进行中', color: 'orange', status: 'processing' },
  done: { label: '已完成', color: 'green', status: 'success' },
  skipped: { label: '已跳过', color: 'gray', status: 'default' },
  expired: { label: '已过期', color: 'red', status: 'error' },
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

      const taskList = (response.data || []).map((item: any) => ({
        ...item,
        baseName: bases.find(b => b.value === item.baseId)?.label || item.baseId,
        targetName: item.targetId,
        assigneeName: users.find(u => u.value === item.assigneeId)?.label || item.assigneeId,
      }));

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

  const handleCreate = async () => {
    try {
      fetchTasks();
      setVisible(false);
      setSelectedTask(null);
      setIsEdit(false);
      message.success('任务创建成功');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定要删除这个任务吗？删除后无法恢复。',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTask(id);
          message.success('任务删除成功');
          fetchTasks();
        } catch (error) {
          message.error('删除失败，请重试');
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
      content: '请输入跳过原因（选填）',
      okType: 'default',
      onOk: async () => {
        try {
          await skipTask(id, { reason: '' });
          message.success('任务已跳过');
          fetchTasks();
        } catch (error) {
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const handleView = async (task: Task) => {
    try {
      const detail = await getTaskById(task.id);
      if (detail.data) {
        setSelectedTask(detail.data);
        setDetailVisible(true);
      }
    } catch (error) {
      message.error('获取任务详情失败');
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEdit(true);
    setVisible(true);
  };

  const handleBatchDelete = (selectedRows: Task[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条任务吗？此操作不可撤销。`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            await deleteTask(row.id);
          }
          message.success(`已成功删除 ${selectedRows.length} 条任务`);
          fetchTasks();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter(t => t.status === 'pending').length;
    const assigned = data.filter(t => t.status === 'assigned').length;
    const doing = data.filter(t => t.status === 'doing').length;
    const done = data.filter(t => t.status === 'done').length;
    const expired = data.filter(t => t.status === 'expired').length;
    return { total, pending, assigned, doing, done, expired };
  }, [data]);

  const columns: ProColumns<Task>[] = [
    {
      title: '任务标题',
      dataIndex: 'taskTitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: '所属基地',
      dataIndex: 'baseId',
      width: 150,
      ellipsis: true,
      valueType: 'select',
      valueEnum: useMemo(() => {
        const enumMap: any = {};
        bases.forEach(base => {
          enumMap[base.value] = { text: base.label };
        });
        return enumMap;
      }, [bases]),
      render: (baseId: number) => {
        const base = bases.find(b => b.value === baseId);
        return base ? base.label : '-';
      },
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      width: 100,
      valueType: 'select',
      valueEnum: useMemo(() => {
        const enumMap: any = {};
        Object.entries(TARGET_TYPE_MAP).forEach(([value, label]) => {
          enumMap[value] = { text: label };
        });
        return enumMap;
      }, []),
      render: (type: string) => TARGET_TYPE_MAP[type] || type,
    },
    {
      title: '目标',
      dataIndex: 'targetId',
      width: 100,
      render: (targetId: number, record: Task) => {
        const pond = ponds.find(p => p.value === targetId);
        return pond ? pond.label : record.targetName || '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: useMemo(() => {
        const enumMap: any = {};
        Object.entries(STATUS_MAP).forEach(([value, { label }]) => {
          enumMap[value] = { text: label };
        });
        return enumMap;
      }, []),
      render: (status: string) => {
        const config = STATUS_MAP[status] || { label: status, color: 'default', status: 'default' };
        return (
          <Badge status={config.status} text={
            <Tag color={config.color} style={{ borderRadius: '2px' }}>{config.label}</Tag>
          } />
        );
      },
    },
    {
      title: '执行人',
      dataIndex: 'assigneeId',
      width: 100,
      render: (assigneeId: number) => {
        const user = users.find(u => u.value === assigneeId);
        return user ? (
          <span><UserOutlined style={{ marginRight: 4 }} />{user.label}</span>
        ) : '-';
      },
    },
    {
      title: '要求执行时间',
      dataIndex: 'actionTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '最晚完成时间',
      dataIndex: 'deadlineTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 260,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          key="view"
          onClick={() => handleView(record)}
        >
          查看
        </Button>,
        record.status === 'pending' && (
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            key="edit"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        ),
        (record.status === 'pending' || record.status === 'assigned' || record.status === 'doing') && (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            key="complete"
            onClick={() => handleComplete(record.id)}
          >
            完成
          </Button>
        ),
        (record.status === 'pending' || record.status === 'assigned') && (
          <Button
            type="link"
            size="small"
            icon={<CloseCircleOutlined />}
            key="skip"
            onClick={() => handleSkip(record.id)}
          >
            跳过
          </Button>
        ),
        record.status === 'pending' && (
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            key="delete"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        ),
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="总任务"
              value={stats.total}
              valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="待办"
              value={stats.pending}
              valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              占比 <span className="fin-number">{data.length ? Math.round(stats.pending / data.length * 100) : 0}%</span>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已派发"
              value={stats.assigned}
              valueStyle={{ color: '#13c2c2', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="进行中"
              value={stats.doing}
              valueStyle={{ color: '#fa8c16', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已完成"
              value={stats.done}
              valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              完成率 <span className="fin-number">{data.length ? Math.round(stats.done / data.length * 100) : 0}%</span>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已过期"
              value={stats.expired}
              valueStyle={{ color: '#ff4d4f', fontFamily: 'AlibabaSans' }}
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
        request={async (params = {}, sort, filter) => {
          setSearchParams(params);
          setPagination(prev => ({
            ...prev,
            current: params.current || 1,
            pageSize: params.pageSize || 10,
          }));
          const result = await fetchTasks({
            ...params,
            current: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          return { data: result.data, success: true, total: result.total };
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
          },
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {},
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
          <Space size={16}>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleBatchDelete(selectedRows)}
            >
              批量删除
            </Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEdit(false);
              setSelectedTask(null);
              setVisible(true);
            }}
          >
            新建任务
          </Button>,
        ]}
        size="small"
        bordered
        scroll={{ x: 1500 }}
      />

      <TaskForm
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setSelectedTask(null);
          setIsEdit(false);
        }}
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
