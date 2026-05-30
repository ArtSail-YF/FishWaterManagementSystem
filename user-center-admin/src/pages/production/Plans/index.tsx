import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic, Typography } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  FileTextOutlined,
  SyncOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
import { PageContainer, ProTable, type ProColumns, type ActionType } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import PlanForm from './components/PlanForm';
import PlanDetail from './components/PlanDetail';
import BatchPlanModal from './components/BatchPlanModal';
import PlanTemplate from './components/PlanTemplate';
import PublishPlanModal from './components/PublishPlanModal';
import {
  searchPlans,
  deletePlan,
  publishPlan,
  batchPublishPlans,
  cancelPlan,
  completePlan,
  getPlanById,
  getPlanStats,
} from '@/services/api/production/plan';
import { getBaseOptions } from '@/services/api/base';
import type { ProductionPlan } from '@/types/model';
import type { PlanStatsDTO } from '@/types/api/plan';

const PLAN_TYPE_MAP: Record<string, string> = {
  feeding: '投喂计划',
  medication: '用药计划',
  harvest: '收获计划',
  maintenance: '维护计划',
  seeding: '放苗计划',
  water_change: '换水/增氧计划',
};

const TARGET_TYPE_MAP: Record<string, string> = {
  pond: '塘口',
  cage: '网箱',
  vsl: '工船',
};

const STATUS_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  draft: { label: '草稿', bgColor: '#EBE5DE', textColor: '#5C4F42' },
  published: { label: '已发布', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  active: { label: '执行中', bgColor: '#F5EDD6', textColor: '#A0843A' },
  completed: { label: '已完成', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  cancelled: { label: '已取消', bgColor: '#EBE5DE', textColor: '#7A6E64' },
};

const Plans: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [batchVisible, setBatchVisible] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
  const [planToPublish, setPlanToPublish] = useState<ProductionPlan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [bases, setBases] = useState<Array<{ label: string; value: number }>>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [stats, setStats] = useState<PlanStatsDTO>({ total: 0, draft: 0, published: 0, active: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    fetchBases();
    fetchStats();
  }, []);

  const fetchBases = async () => {
    try {
      const options = await getBaseOptions();
      setBases(options);
    } catch (error) {
      console.error('获取基地列表失败:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getPlanStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('获取计划统计失败:', error);
    }
  };

  const fetchPlans = async (params: any = {}) => {
    setLoading(true);
    try {
      const apiParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
        ...params,
      };

      const response = await searchPlans(apiParams);
      // 后端已返回 baseName / targetName，无需客户端映射
      const planList = response.data || [];

      setPlans(planList);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
      return { data: planList, total: response.total || 0 };
    } catch (error) {
      message.error('获取计划列表失败');
      console.error('获取计划列表失败:', error);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    actionRef.current?.reload();
    setVisible(false);
    setSelectedPlan(null);
    setIsEdit(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个计划吗？删除后无法恢复',
      okType: 'danger',
      onOk: async () => {
        try {
          await deletePlan(id);
          message.success('计划已删除');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败，请重试');
        }
      },
    });
  };

  const openPublishModal = (plan: ProductionPlan) => {
    setPlanToPublish(plan);
    setPublishModalVisible(true);
  };

  const handlePublishSuccess = (result: { planTitle: string; tasksGenerated: number }) => {
    setPublishModalVisible(false);
    setPlanToPublish(null);
    message.success(`计划「${result.planTitle}」已发布，生成了${result.tasksGenerated}个任务`);
    actionRef.current?.reload();
  };

  const handleBatchPublish = async () => {
    const selectedPlans = plans.filter(p => selectedRowKeys.includes(p.id!));
    const draftPlans = selectedPlans.filter(p => p.status === 'draft');

    if (draftPlans.length === 0) {
      message.warning('选中的计划中没有可发布的草稿计划');
      return;
    }

    Modal.confirm({
      title: '批量发布确认',
      content: `将发布${draftPlans.length}个草稿计划（已选择${selectedPlans.length}个）`,
      okText: '确认批量发布',
      okType: 'primary',
      onOk: async () => {
        try {
          const res = await batchPublishPlans(draftPlans.map(p => p.id!));
          const data = res.data as any;
          if (data.successCount > 0) {
            message.success(
              `成功发布${data.successCount}个计划，生成${data.tasksGenerated}个任务` +
                (data.failCount > 0 ? `，失败${data.failCount}个` : '')
            );
            if (data.errors?.length > 0) {
              Modal.info({
                title: '发布详情',
                content: (
                  <ul style={{ paddingLeft: 20, maxHeight: 200, overflow: 'auto' }}>
                    {data.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                ),
              });
            }
          } else {
            message.error('批量发布失败');
          }
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error?.message || '批量发布失败');
        }
      },
    });
  };

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个计划吗？',
      okType: 'danger',
      onOk: async () => {
        try {
          await cancelPlan(id, { reason: '用户手动取消' });
          message.success('计划已取消');
          actionRef.current?.reload();
        } catch {
          message.error('取消失败');
        }
      },
    });
  };

  const handleComplete = async (id: number) => {
    Modal.confirm({
      title: '确认完成',
      content: '确定要标记这个计划为已完成吗？',
      okType: 'primary',
      onOk: async () => {
        try {
          await completePlan(id);
          message.success('计划已完成');
          actionRef.current?.reload();
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleView = async (plan: ProductionPlan) => {
    try {
      const detail = await getPlanById(plan.id!);
      if (detail.data) {
        setSelectedPlan(detail.data);
        setDetailVisible(true);
      }
    } catch {
      message.error('获取计划详情失败');
    }
  };

  const handleEdit = (plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setIsEdit(true);
    setVisible(true);
  };

  const handleBatchDelete = (selectedRows: ProductionPlan[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的${selectedRows.length}个计划吗？此操作不可撤销`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            if (row.id) await deletePlan(row.id);
          }
          message.success(`已成功删除${selectedRows.length}个计划`);
          actionRef.current?.reload();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ProColumns<ProductionPlan>[] = [
    {
      title: '计划名称',
      dataIndex: 'title',
      width: 200,
      fixed: 'left',
      ellipsis: true,
      render: (_, r) => (
        <a onClick={() => handleView(r)}>
          <FileTextOutlined style={{ marginRight: 6, color: '#1677ff' }} />
          {r.title || '-'}
        </a>
      ),
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      width: 100,
      render: (_, r) => PLAN_TYPE_MAP[r.planType || ''] || r.planType || '-',
    },
    {
      title: '所属基地',
      dataIndex: 'baseName',
      width: 120,
    },
    {
      title: '作业对象',
      dataIndex: 'targetName',
      width: 120,
    },
    {
      title: '执行周期',
      width: 180,
      render: (_, r) => (r.startTime ? `${r.startTime} ~ ${r.endTime || ''}` : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
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
      title: '操作',
      width: 320,
      fixed: 'right',
      render: (_, record) => [
        <Button type="link" size="small" icon={<EyeOutlined />} key="view" onClick={() => handleView(record)}>
          查看
        </Button>,
        record.status === 'draft' && (
          <Button type="link" size="small" icon={<EditOutlined />} key="edit" onClick={() => handleEdit(record)} style={{ color: '#8c8c8c' }}>
            编辑
          </Button>
        ),
        record.status === 'draft' && (
          <Button type="link" size="small" icon={<SendOutlined />} key="publish" onClick={() => openPublishModal(record)} style={{ color: '#8c8c8c' }}>
            发布
          </Button>
        ),
        (record.status === 'published' || record.status === 'active') && (
          <Button type="link" size="small" icon={<CheckCircleOutlined />} key="complete" onClick={() => handleComplete(record.id!)} style={{ color: '#8c8c8c' }}>
            完成
          </Button>
        ),
        (record.status === 'draft' || record.status === 'published') && (
          <Button type="link" size="small" icon={<CloseCircleOutlined />} key="cancel" onClick={() => handleCancel(record.id!)} style={{ color: '#8c8c8c' }}>
            取消
          </Button>
        ),
        record.status === 'draft' && (
          <Button type="link" size="small" icon={<DeleteOutlined />} key="delete" onClick={() => handleDelete(record.id!)} style={{ color: '#8c8c8c' }}>
            删除
          </Button>
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
              title={<Text type="secondary" style={{ fontSize: '12px' }}>计划总数</Text>}
              value={stats.total}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<BarChartOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>草稿</Text>}
              value={stats.draft}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<EditOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已发布</Text>}
              value={stats.published}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SendOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>执行中</Text>}
              value={stats.active}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已完成</Text>}
              value={stats.completed}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CheckCircleOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已取消</Text>}
              value={stats.cancelled}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CloseCircleOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ProductionPlan>
        actionRef={actionRef}
        headerTitle="计划管理"
        columns={columns}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={async (params = {}) => {
          setSearchParams(params);
          setPagination(prev => ({
            ...prev,
            current: params.current || 1,
            pageSize: params.pageSize || 10,
          }));
          const result = await fetchPlans({
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
          onChange: (page, ps) =>
            setPagination({ ...pagination, current: page, pageSize: ps || 10 }),
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: keys => setSelectedRowKeys(keys),
        }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 <a style={{ fontWeight: 600 }}>{keys.length}</a> 项
            </span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => {
          const hasDraft = (selectedRows as ProductionPlan[]).some(r => r.status === 'draft');
          return (
            <Space size={16}>
              {hasDraft && (
                <Button size="small" icon={<SendOutlined />} onClick={handleBatchPublish}>
                  批量发布
                </Button>
              )}
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleBatchDelete(selectedRows as ProductionPlan[])}
                style={{ color: '#8c8c8c' }}
              >
                批量删除
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button key="template" icon={<CopyOutlined />} onClick={() => setTemplateVisible(true)}>
            计划模板
          </Button>,
          <Button key="batch" icon={<FileDoneOutlined />} onClick={() => setBatchVisible(true)}>
            批量计划
          </Button>,
          <Button
            key="calendar"
            icon={<CalendarOutlined />}
            onClick={() => history.push('/dashboard/production-plan')}
          >
            日历视图
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEdit(false);
              setSelectedPlan(null);
              setVisible(true);
            }}
          >
            新建计划
          </Button>,
        ]}
        size="small"
        scroll={{ x: 1500 }}
      />

      <PlanForm
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setSelectedPlan(null);
          setIsEdit(false);
        }}
        onOk={handleCreate}
        initialValues={isEdit ? selectedPlan : undefined}
        isEdit={isEdit}
        bases={bases}
      />

      <PlanDetail visible={detailVisible} onCancel={() => setDetailVisible(false)} plan={selectedPlan} />

      <PublishPlanModal
        visible={publishModalVisible}
        plan={planToPublish}
        onCancel={() => {
          setPublishModalVisible(false);
          setPlanToPublish(null);
        }}
        onSuccess={handlePublishSuccess}
      />

      <BatchPlanModal
        visible={batchVisible}
        onCancel={() => setBatchVisible(false)}
        onOk={async () => {
          try {
            setLoading(true);
            actionRef.current?.reload();
            message.success('批量计划创建成功');
            setBatchVisible(false);
          } catch {
            message.error('创建失败');
          } finally {
            setLoading(false);
          }
        }}
      />

      <PlanTemplate visible={templateVisible} onCancel={() => setTemplateVisible(false)} />
    </PageContainer>
  );
};

export default Plans;
