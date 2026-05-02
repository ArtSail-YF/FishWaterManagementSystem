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
import type { TableColumnsType, TableProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import PlanForm from './components/PlanForm';
import PlanDetail from './components/PlanDetail';
import BatchPlanModal from './components/BatchPlanModal';
import PlanTemplate from './components/PlanTemplate';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

// ==================== 类型定义 ====================
interface Plan {
  id: string;
  planType: string;
  planName: string;
  pondId: string;
  pondNames: string;
  startTime: string;
  endTime: string;
  status: PlanStatus;
  creator: string;
  createdAt: string;
}

type PlanStatus = 
  | '草稿'
  | '已发布'
  | '执行中'
  | '已完成'
  | '已延期'
  | '已取消';

interface Filters {
  planType: string;
  status: string;
  dateRange: [string, string] | null;
  search: string;
}

// ==================== 常量定义 ====================
const PLAN_TYPES = [
  '放苗计划',
  '投喂计划',
  '用药计划',
  '换水/增氧计划',
  '收获计划',
  '深远海 – 工船作业计划',
  '深远海 – 网箱维护计划',
  '深远海 – 捕捞计划',
] as const;

const PLAN_STATUSES: PlanStatus[] = [
  '草稿',
  '已发布',
  '执行中',
  '已完成',
  '已延期',
  '已取消',
];

// ==================== 模拟数据 ====================
const mockPlans: Plan[] = [
  {
    id: '1',
    planType: '放苗计划',
    planName: '南美白对虾放苗计划',
    pondId: '1,2,3',
    pondNames: '1号塘, 2号塘, 3号塘',
    startTime: '2026-04-20',
    endTime: '2026-10-20',
    status: '草稿',
    creator: '管理员',
    createdAt: '2026-04-15',
  },
  {
    id: '2',
    planType: '投喂计划',
    planName: '每日投喂计划',
    pondId: '4,5',
    pondNames: '4号塘, 5号塘',
    startTime: '2026-04-16',
    endTime: '2026-04-30',
    status: '已发布',
    creator: '技术员',
    createdAt: '2026-04-14',
  },
  {
    id: '3',
    planType: '用药计划',
    planName: '消毒用药计划',
    pondId: '6',
    pondNames: '6号塘',
    startTime: '2026-04-18',
    endTime: '2026-04-20',
    status: '执行中',
    creator: '管理员',
    createdAt: '2026-04-13',
  },
];

const Plans: React.FC = () => {
  // ==================== 状态管理 ====================
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [batchVisible, setBatchVisible] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    planType: '',
    status: '',
    dateRange: null,
    search: '',
  });

  // ==================== 工具函数 ====================
  const getStatusColor = useCallback((status: PlanStatus): string => {
    const colorMap: Record<PlanStatus, string> = {
      '草稿': 'blue',
      '已发布': 'green',
      '执行中': 'orange',
      '已完成': 'purple',
      '已延期': 'red',
      '已取消': 'gray',
    };
    return colorMap[status] || 'default';
  }, []);

  // ==================== 数据过滤逻辑 ====================
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      // 计划类型过滤
      if (filters.planType && plan.planType !== filters.planType) {
        return false;
      }

      // 状态过滤
      if (filters.status && plan.status !== filters.status) {
        return false;
      }

      // 日期范围过滤
      if (filters.dateRange) {
        const [startDate, endDate] = filters.dateRange;
        if (startDate && plan.startTime < startDate) {
          return false;
        }
        if (endDate && plan.endTime > endDate) {
          return false;
        }
      }

      // 搜索过滤
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          plan.planName.toLowerCase().includes(searchLower) ||
          plan.pondNames.toLowerCase().includes(searchLower) ||
          plan.creator.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [plans, filters]);

  // ==================== 事件处理 ====================
  const handleCreate = useCallback(async (values: Partial<Plan>) => {
    setLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEdit && selectedPlan) {
        setPlans(prevPlans =>
          prevPlans.map(plan =>
            plan.id === selectedPlan.id ? { ...plan, ...values } : plan
          )
        );
        message.success('计划编辑成功');
      } else {
        const newPlan: Plan = {
          id: (plans.length + 1).toString(),
          ...values,
          creator: '当前用户',
          createdAt: new Date().toISOString().split('T')[0],
          status: '草稿',
        } as Plan;
        setPlans(prevPlans => [...prevPlans, newPlan]);
        message.success('计划创建成功');
      }

      // 重置表单状态
      setVisible(false);
      setSelectedPlan(null);
      setIsEdit(false);
    } catch (error) {
      message.error('操作失败，请重试');
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isEdit, selectedPlan, plans]);

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个计划吗？删除后无法恢复。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 模拟API请求
          await new Promise(resolve => setTimeout(resolve, 500));
          setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
          message.success('计划删除成功');
        } catch (error) {
          message.error('删除失败，请重试');
        }
      },
    });
  }, []);

  const handleView = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setDetailVisible(true);
  }, []);

  const handleEdit = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setIsEdit(true);
    setVisible(true);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      planType: '',
      status: '',
      dateRange: null,
      search: '',
    });
  }, []);

  // ==================== 表格列配置 ====================
  const columns: TableColumnsType<Plan> = useMemo(() => [
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.planName.localeCompare(b.planName),
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      key: 'planType',
      filters: PLAN_TYPES.map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.planType === value,
      width: 150,
    },
    {
      title: '关联塘口',
      dataIndex: 'pondNames',
      key: 'pondNames',
      ellipsis: true,
      width: 180,
    },
    {
      title: '计划时间',
      key: 'time',
      render: (_, record) => (
        <span>{`${record.startTime} ~ ${record.endTime}`}</span>
      ),
      width: 200,
      sorter: (a, b) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: PLAN_STATUSES.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
      render: (status: PlanStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
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
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [getStatusColor, handleView, handleEdit, handleDelete]);

  // ==================== JSX渲染 ====================
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
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Select
            placeholder="计划类型"
            style={{ width: 150 }}
            value={filters.planType}
            onChange={(value) => setFilters(prev => ({ ...prev, planType: value }))}
            allowClear
          >
            {PLAN_TYPES.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="计划状态"
            style={{ width: 120 }}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            allowClear
          >
            {PLAN_STATUSES.map(status => (
              <Option key={status} value={status}>{status}</Option>
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
              } else {
                setFilters(prev => ({ ...prev, dateRange: null }));
              }
            }}
          />
          
          <Search
            placeholder="搜索计划名称"
            style={{ width: 200 }}
            onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
            allowClear
          />
          
          {(filters.planType || filters.status || filters.dateRange || filters.search) && (
            <Button onClick={handleResetFilters}>
              重置筛选
            </Button>
          )}
        </div>

        {/* 数据表格 */}
        <Spin spinning={loading} tip="加载中...">
          <Table
            columns={columns}
            dataSource={filteredPlans}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            locale={{
              emptyText: (
                <Empty
                  description="暂无计划数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* 模态框组件 */}
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
            // 模拟批量创建
            await new Promise(resolve => setTimeout(resolve, 1000));
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