import React, { useState, useEffect, useMemo } from 'react';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic, Badge } from 'antd';
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
} from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import PlanForm from './components/PlanForm';
import PlanDetail from './components/PlanDetail';
import BatchPlanModal from './components/BatchPlanModal';
import PlanTemplate from './components/PlanTemplate';
import {
  searchPlans,
  deletePlan,
  publishPlan,
  cancelPlan,
  completePlan,
  getPlanById,
} from '@/services/api/production/plan';
import { getBaseOptions } from '@/services/api/base';
import { getPondOptions } from '@/services/api/pond';
import type { ProductionPlan } from '@/types/model';

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

const STATUS_MAP: Record<string, { label: string; color: string; status: 'success' | 'processing' | 'default' | 'error' | 'warning' }> = {
  draft: { label: '草稿', color: 'blue', status: 'default' },
  published: { label: '已发布', color: 'cyan', status: 'processing' },
  active: { label: '执行中', color: 'orange', status: 'processing' },
  completed: { label: '已完成', color: 'green', status: 'success' },
  cancelled: { label: '已取消', color: 'gray', status: 'default' },
};

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [batchVisible, setBatchVisible] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [bases, setBases] = useState<Array<{ label: string; value: number }>>([]);
  const [ponds, setPonds] = useState<Array<{ label: string; value: number }>>([]);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchBases();
  }, []);

  useEffect(() => {
    fetchPlans();
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

      const planList = (response.data || []).map((item: ProductionPlan) => ({
        ...item,
        baseName: bases.find(b => b.value === item.baseId)?.label || item.baseId,
        targetName: ponds.find(p => p.value === item.targetId)?.label || item.targetId,
      }));

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
    try {
      fetchPlans();
      setVisible(false);
      setSelectedPlan(null);
      setIsEdit(false);
      message.success('计划创建成功');
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个计划吗？删除后无法恢复。',
      okType: 'danger',
      onOk: async () => {
        try {
          await deletePlan(id);
          message.success('计划删除成功');
          fetchPlans();
        } catch (error) {
          message.error('删除失败，请重试');
        }
      },
    });
  };

  const handlePublish = async (id: number) => {
    Modal.confirm({
      title: '确认发布',
      content: '确定要发布这个计划吗？发布后将生成对应的执行任务。',
      okType: 'primary',
      onOk: async () => {
        try {
          await publishPlan(id);
          message.success('计划已发布');
          fetchPlans();
        } catch (error) {
          message.error('发布失败，请重试');
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
          fetchPlans();
        } catch (error) {
          message.error('取消失败，请重试');
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
          fetchPlans();
        } catch (error) {
          message.error('操作失败，请重试');
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
    } catch (error) {
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
      content: `确定要删除选中的 ${selectedRows.length} 条计划吗？此操作不可撤销。`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            if (row.id) await deletePlan(row.id);
          }
          message.success(`已成功删除 ${selectedRows.length} 条计划`);
          fetchPlans();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  const stats = useMemo(() => {
    const total = plans.length;
    const draft = plans.filter(p => p.status === 'draft').length;
    const published = plans.filter(p => p.status === 'published').length;
    const active = plans.filter(p => p.status === 'active').length;
    const completed = plans.filter(p => p.status === 'completed').length;
    const cancelled = plans.filter(p => p.status === 'cancelled').length;
    return { total, draft, published, active, completed, cancelled };
  }, [plans]);

  const columns: ProColumns<ProductionPlan>[] = [
    {
      title: '计划标题',
      dataIndex: 'title',
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
      title: '计划类型',
      dataIndex: 'planType',
      width: 120,
      valueType: 'select',
      valueEnum: useMemo(() => {
        const enumMap: any = {};
        Object.entries(PLAN_TYPE_MAP).forEach(([value, label]) => {
          enumMap[value] = { text: label };
        });
        return enumMap;
      }, []),
      render: (type: string) => PLAN_TYPE_MAP[type] || type,
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
      render: (targetId: number, record: ProductionPlan) => {
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
      title: '计划时间',
      key: 'time',
      width: 220,
      render: (_, record) => (
        <span>{`${record.startTime || '-'} ~ ${record.endTime || '-'}`}</span>
      ),
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
      width: 280,
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
        record.status === 'draft' && (
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
        record.status === 'draft' && (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            key="publish"
            onClick={() => handlePublish(record.id!)}
          >
            发布
          </Button>
        ),
        (record.status === 'published' || record.status === 'active') && (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            key="complete"
            onClick={() => handleComplete(record.id!)}
          >
            完成
          </Button>
        ),
        (record.status === 'draft' || record.status === 'published') && (
          <Button
            type="link"
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            key="cancel"
            onClick={() => handleCancel(record.id!)}
          >
            取消
          </Button>
        ),
        record.status === 'draft' && (
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            key="delete"
            onClick={() => handleDelete(record.id!)}
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
              title="总计划"
              value={stats.total}
              valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="草稿"
              value={stats.draft}
              valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已发布"
              value={stats.published}
              valueStyle={{ color: '#13c2c2', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="执行中"
              value={stats.active}
              valueStyle={{ color: '#fa8c16', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已完成"
              value={stats.completed}
              valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="已取消"
              value={stats.cancelled}
              valueStyle={{ color: '#8c8c8c', fontFamily: 'AlibabaSans' }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ProductionPlan>
        headerTitle="计划管理"
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
            key="template"
            icon={<CopyOutlined />}
            onClick={() => setTemplateVisible(true)}
          >
            计划模板
          </Button>,
          <Button
            key="batch"
            icon={<FileDoneOutlined />}
            onClick={() => setBatchVisible(true)}
          >
            批量计划
          </Button>,
          <Button
            key="calendar"
            icon={<CalendarOutlined />}
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
        bordered
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
        ponds={ponds}
      />

      <PlanDetail
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        plan={selectedPlan}
      />

      <BatchPlanModal
        visible={batchVisible}
        onCancel={() => setBatchVisible(false)}
        onOk={async () => {
          try {
            setLoading(true);
            await fetchPlans();
            message.success('批量计划创建成功');
            setBatchVisible(false);
          } catch (error) {
            message.error('批量创建失败');
          } finally {
            setLoading(false);
          }
        }}
      />

      <PlanTemplate
        visible={templateVisible}
        onCancel={() => setTemplateVisible(false)}
      />
    </PageContainer>
  );
};

export default Plans;
