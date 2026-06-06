import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic, Typography, Tabs, Form, Input, Select } from 'antd';
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
  CheckOutlined,
  StopOutlined,
  UnorderedListOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
import { PageContainer, ProTable, type ProColumns, type ActionType } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import PlanForm from './components/PlanForm';
import PlanDetail from './components/PlanDetail';
import BatchPlanModal from './components/BatchPlanModal';
import PlanTemplate from './components/PlanTemplate';
import PublishPlanModal from './components/PublishPlanModal';
import PlanTaskModal from './components/PlanTaskModal';
import {
  searchPlans,
  deletePlan,
  publishPlan,
  batchPublishPlans,
  cancelPlan,
  completePlan,
  getPlanById,
  getPlanStats,
  submitForApproval,
  approvePlan,
  rejectPlan,
  getApprovalRecords,
} from '@/services/api/production/plan';
import { getBaseOptions } from '@/services/api/base';
import { getUserOptions } from '@/services/api/user';
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
  pending_approval: { label: '待审批', bgColor: '#FFF3CD', textColor: '#856404' },
  approved: { label: '已审批', bgColor: '#D1ECF1', textColor: '#0C5460' },
  rejected: { label: '已驳回', bgColor: '#F5D0D0', textColor: '#B54E3C' },
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
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskModalPlanId, setTaskModalPlanId] = useState(0);
  const [taskModalPlanTitle, setTaskModalPlanTitle] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
  const [planToPublish, setPlanToPublish] = useState<ProductionPlan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [bases, setBases] = useState<Array<{ label: string; value: number }>>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [stats, setStats] = useState<PlanStatsDTO>({ total: 0, draft: 0, published: 0, active: 0, completed: 0, cancelled: 0 });
  // ====== 审批弹窗状态 ======
  const [activeTab, setActiveTab] = useState<string>('all');
  const [approvalModal, setApprovalModal] = useState<{
    type: 'submit' | 'approve' | 'reject';
    plan: ProductionPlan | null;
  }>({ type: 'submit', plan: null });
  const [approverOptions, setApproverOptions] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    fetchBases();
    fetchStats();
  }, []);

  // 加载审批人选项（管理员角色）
  useEffect(() => {
    if (approvalModal.type === 'submit' && approvalModal.plan) {
      getUserOptions({ userRole: 1 }).then(setApproverOptions);
    }
  }, [approvalModal]);

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
    fetchStats();  };

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
          fetchStats();
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

  // ====== 审批操作 ======

  const handleSubmitApprovalClick = (plan: ProductionPlan) => {
    setApprovalModal({ type: 'submit', plan });
  };

  const handleApproveClick = (plan: ProductionPlan) => {
    setApprovalModal({ type: 'approve', plan });
  };

  const handleRejectClick = (plan: ProductionPlan) => {
    setApprovalModal({ type: 'reject', plan });
  };

  const handleApprovalModalCancel = () => {
    setApprovalModal({ type: 'submit', plan: null });
  };

  const handleApprovalModalOk = async (values: { approverId?: number; comment?: string }) => {
    const { plan, type } = approvalModal;
    if (!plan?.id) return;

    try {
      switch (type) {
        case 'submit':
          await submitForApproval(plan.id, {
            approverId: values.approverId!,
            comment: values.comment,
          });
          message.success('计划已提交审批');
          break;
        case 'approve':
          await approvePlan(plan.id, { comment: values.comment });
          message.success('计划已审批通过，任务已自动生成');
          break;
        case 'reject':
          await rejectPlan(plan.id, { comment: values.comment! });
          message.success('计划已驳回');
          break;
      }
      setApprovalModal({ type: 'submit', plan: null });
      actionRef.current?.reload();
      fetchStats();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const handleViewTasks = (plan: ProductionPlan) => {
    setTaskModalPlanId(plan.id!);
    setTaskModalPlanTitle(plan.title || '');
    setTaskModalVisible(true);
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
      width: 420,
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
          <Button type="link" size="small" icon={<SolutionOutlined />} key="submit-approval" onClick={() => handleSubmitApprovalClick(record)} style={{ color: '#A0843A' }}>
            提交审批
          </Button>
        ),
        record.status === 'pending_approval' && (
          <Button type="link" size="small" icon={<CheckOutlined />} key="approve" onClick={() => handleApproveClick(record)} style={{ color: '#5B8C5A' }}>
            通过
          </Button>
        ),
        record.status === 'pending_approval' && (
          <Button type="link" size="small" icon={<StopOutlined />} key="reject" onClick={() => handleRejectClick(record)} style={{ color: '#B54E3C' }}>
            驳回
          </Button>
        ),
        record.status === 'approved' && (
          <Button type="link" size="small" icon={<SendOutlined />} key="publish" onClick={() => openPublishModal(record)} style={{ color: '#2B6B8A' }}>
            发布
          </Button>
        ),
        (record.status === 'published' || record.status === 'active') && (
          <Button type="link" size="small" icon={<CheckCircleOutlined />} key="complete" onClick={() => handleComplete(record.id!)} style={{ color: '#8c8c8c' }}>
            完成
          </Button>
        ),
        (record.status === 'published' || record.status === 'active') && (
          <Button type="link" size="small" icon={<UnorderedListOutlined />} key="tasks" onClick={() => handleViewTasks(record)} style={{ color: '#8c8c8c' }}>
            任务
          </Button>
        ),
        (record.status === 'draft' || record.status === 'published' || record.status === 'rejected') && (
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
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>计划总数</Text>}
              value={stats.total}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<BarChartOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>草稿</Text>}
              value={stats.draft}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<EditOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>待审批</Text>}
              value={stats.pending_approval || 0}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#856404' }}
              prefix={<SolutionOutlined style={{ color: '#856404' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已发布</Text>}
              value={stats.published}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SendOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>执行中</Text>}
              value={stats.active}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>已完成</Text>}
              value={stats.completed}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CheckCircleOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
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

      {/* 审批状态 Tab 筛选 */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          // 切换 tab 后重新加载列表
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        items={[
          { key: 'all', label: `全部计划 (${stats.total})` },
          { key: 'pending', label: `待我审批 (${stats.pending_approval || 0})` },
          { key: 'my', label: '我提交的' },
        ]}
        style={{ marginBottom: 16 }}
      />

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
          // 根据 activeTab 添加额外筛选条件
          const filterParams: Record<string, any> = {};
          if (activeTab === 'pending') {
            filterParams.status = 'pending_approval';
          } else if (activeTab === 'my') {
            filterParams.ownerOnly = true;
          }
          const result = await fetchPlans({
            ...params,
            ...filterParams,
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
        scroll={{ x: 1600 }}
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

      <PlanTaskModal
        visible={taskModalVisible}
        planId={taskModalPlanId}
        planTitle={taskModalPlanTitle}
        onCancel={() => setTaskModalVisible(false)}
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

      {/* 审批弹窗 */}
      <Modal
        title={
          approvalModal.type === 'submit' ? '提交审批' :
          approvalModal.type === 'approve' ? '审批通过' : '驳回计划'
        }
        open={approvalModal.plan !== null}
        onCancel={handleApprovalModalCancel}
        onOk={() => {
          const form = document.querySelector('#approval-form') as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        okText={
          approvalModal.type === 'submit' ? '提交审批' :
          approvalModal.type === 'approve' ? '审批通过' : '确认驳回'
        }
        okType={approvalModal.type === 'reject' ? 'danger' : 'primary'}
        destroyOnClose
      >
        <Form
          id="approval-form"
          layout="vertical"
          onFinish={handleApprovalModalOk}
          initialValues={{ comment: '' }}
        >
          {approvalModal.type === 'submit' && (
            <Form.Item name="approverId" label="审批人" rules={[{ required: true, message: '请选择审批人' }]}>
              <Select placeholder="请选择审批人">
                {approverOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="comment"
            label={approvalModal.type === 'reject' ? '驳回原因' : '审批意见'}
            rules={approvalModal.type === 'reject' ? [{ required: true, message: '请填写驳回原因' }] : []}
          >
            <Input.TextArea
              rows={3}
              placeholder={
                approvalModal.type === 'submit' ? '备注信息（可选）' :
                approvalModal.type === 'approve' ? '审批意见（可选）' : '请填写驳回原因'
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Plans;
