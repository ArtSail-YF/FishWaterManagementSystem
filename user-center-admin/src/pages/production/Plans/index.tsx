import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  message,
  Spin,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import PlanForm from './components/PlanForm';
import PlanDetail from './components/PlanDetail';
import BatchPlanModal from './components/BatchPlanModal';
import PlanTemplate from './components/PlanTemplate';
import { searchPlans, deletePlan, publishPlan, cancelPlan } from '@/services/api/production';
import { getBaseOptions } from '@/services/api/base';
import type { ProductionPlan } from '@/types/model';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const PLAN_TYPE_MAP: Record<string, string> = {
  seeding: '放苗计划',
  feeding: '投喂计划',
  medication: '用药计划',
  water_change: '换水/增氧计划',
  harvest: '收获计划',
  maintenance: '维护计划',
};

const TARGET_TYPE_MAP: Record<string, string> = {
  pond: '塘口',
  cage: '网箱',
  vsl: '工船',
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'blue' },
  published: { label: '已发布', color: 'green' },
  active: { label: '执行中', color: 'orange' },
  completed: { label: '已完成', color: 'purple' },
  cancelled: { label: '已取消', color: 'gray' },
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
  const [filters, setFilters] = useState({
    baseId: undefined,
    planType: '',
    status: '',
    dateRange: null,
    search: '',
  });

  useEffect(() => {
    fetchPlans();
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const options = await getBaseOptions();
      setBases(options);
    } catch (error) {
      console.error('获取基地列表失败:', error);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const apiParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        baseId: filters.baseId,
        planType: filters.planType || undefined,
        status: filters.status || undefined,
        keyword: filters.search || undefined,
        startTime: filters.dateRange ? filters.dateRange[0] : undefined,
        endTime: filters.dateRange ? filters.dateRange[1] : undefined,
      };

      const response = await searchPlans(apiParams);
      
      setPlans(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
    } catch (error) {
      message.error('获取计划列表失败');
      console.error('获取计划列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = useCallback(async (values: Partial<ProductionPlan>) => {
    setLoading(true);
    try {
      await fetchPlans();
      setVisible(false);
      setSelectedPlan(null);
      setIsEdit(false);
      message.success(isEdit ? '计划编辑成功' : '计划创建成功');
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isEdit]);

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个计划吗？删除后无法恢复。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
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
  }, []);

  const handlePublish = useCallback(async (id: number) => {
    try {
      await publishPlan(id);
      message.success('计划已发布');
      fetchPlans();
    } catch (error) {
      message.error('发布失败，请重试');
    }
  }, []);

  const handleCancel = useCallback(async (id: number) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个计划吗？',
      okText: '确认取消',
      okType: 'danger',
      cancelText: '返回',
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
  }, []);

  const handleView = useCallback((plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setDetailVisible(true);
  }, []);

  const handleEdit = useCallback((plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setIsEdit(true);
    setVisible(true);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      baseId: undefined,
      planType: '',
      status: '',
      dateRange: null,
      search: '',
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const columns: TableColumnsType<ProductionPlan> = useMemo(() => [
    {
      title: '计划标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      ellipsis: true,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: '所属基地',
      dataIndex: 'baseId',
      key: 'baseId',
      width: 180,
      ellipsis: true,
      render: (baseId: number) => {
        const base = bases.find(b => b.value === baseId);
        return base ? base.label : '-';
      },
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      key: 'planType',
      filters: Object.entries(PLAN_TYPE_MAP).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.planType === value,
      width: 120,
      render: (type: string) => PLAN_TYPE_MAP[type] || type,
    },
    {
      title: '目标',
      key: 'target',
      render: (_, record) => (
        <span>{TARGET_TYPE_MAP[record.targetType || ''] || ''} {record.targetId || ''}</span>
      ),
      width: 120,
    },
    {
      title: '计划时间',
      key: 'time',
      render: (_, record) => (
        <span>{`${record.startTime || ''} ~ ${record.endTime || ''}`}</span>
      ),
      width: 200,
      sorter: (a, b) => (a.startTime || '').localeCompare(b.startTime || ''),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: Object.entries(STATUS_MAP).map(([value, { label }]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const config = STATUS_MAP[status] || { label: status, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
      width: 100,
    },
    {
      title: '制定人',
      dataIndex: 'ownerId',
      key: 'ownerId',
      width: 100,
      render: (ownerId: number) => ownerId || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''),
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'draft' && (
            <Button
              type="text"
              size="small"
              onClick={() => handlePublish(record.id!)}
            >
              发布
            </Button>
          )}
          {(record.status === 'draft' || record.status === 'published') && (
            <Button
              type="text"
              size="small"
              danger
              onClick={() => handleCancel(record.id!)}
            >
              取消
            </Button>
          )}
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id!)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [bases, handleView, handleEdit, handleDelete, handlePublish, handleCancel]);

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="计划管理"
        extra={
          <Space size="middle">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsEdit(false);
                setSelectedPlan(null);
                setVisible(true);
              }}
            >
              新建计划
            </Button>
            <Button
              icon={<FileDoneOutlined />}
              onClick={() => setBatchVisible(true)}
            >
              批量计划
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={() => setTemplateVisible(true)}
            >
              计划模板
            </Button>
            <Button
              icon={<CalendarOutlined />}
            >
              日历视图
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Select
            placeholder="所属基地"
            style={{ width: 180 }}
            value={filters.baseId}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, baseId: value }));
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            allowClear
          >
            {bases.map(base => (
              <Option key={base.value} value={base.value}>{base.label}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="计划类型"
            style={{ width: 150 }}
            value={filters.planType}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, planType: value }));
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            allowClear
          >
            {Object.entries(PLAN_TYPE_MAP).map(([value, label]) => (
              <Option key={value} value={value}>{label}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="计划状态"
            style={{ width: 120 }}
            value={filters.status}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, status: value }));
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            allowClear
          >
            {Object.entries(STATUS_MAP).map(([value, { label }]) => (
              <Option key={value} value={value}>{label}</Option>
            ))}
          </Select>
          
          <RangePicker
            style={{ width: 300 }}
            placeholder={['开始日期', '结束日期']}
            onChange={(dates, dateStrings) => {
              if (dates && dateStrings) {
                setFilters(prev => ({ 
                  ...prev, 
                  dateRange: [dateStrings[0], dateStrings[1]] 
                }));
                setPagination(prev => ({ ...prev, current: 1 }));
              } else {
                setFilters(prev => ({ ...prev, dateRange: null }));
              }
            }}
          />
          
          <Search
            placeholder="搜索计划名称"
            style={{ width: 200 }}
            onSearch={(value) => {
              setFilters(prev => ({ ...prev, search: value }));
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            allowClear
          />
          
          {(filters.baseId || filters.planType || filters.status || filters.dateRange || filters.search) && (
            <Button onClick={handleResetFilters}>
              重置筛选
            </Button>
          )}
        </div>

        <Spin spinning={loading} tip="加载中...">
          <Table
            columns={columns}
            dataSource={plans}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize, total: pagination.total });
              },
            }}
            locale={{
              emptyText: (
                <Empty
                  description="暂无计划数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            scroll={{ x: 1400 }}
          />
        </Spin>
      </Card>

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

      <PlanDetail
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        plan={selectedPlan}
      />

      <BatchPlanModal
        visible={batchVisible}
        onCancel={() => setBatchVisible(false)}
        onOk={async (values) => {
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
    </div>
  );
};

export default Plans;