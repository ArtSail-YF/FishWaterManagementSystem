import React, { useState, useEffect } from 'react';
import {
  Button, Tag, Space, Row, Col, Card, Statistic, Typography, Tabs, Badge, message,
} from 'antd';
import {
  SearchOutlined, ReloadOutlined, BarChartOutlined, AlertOutlined,
  MedicineBoxOutlined, CoffeeOutlined, EnvironmentOutlined, ToolOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { searchLogs } from '@/services/api/production/log';
import dayjs from 'dayjs';

const { Text } = Typography;

const LOG_TYPE_OPTIONS = [
  { key: 'all', label: '全部日志', icon: <BarChartOutlined /> },
  { key: 'feeding', label: '投喂日志', icon: <CoffeeOutlined /> },
  { key: 'medication', label: '用药日志', icon: <MedicineBoxOutlined /> },
  { key: 'harvest', label: '捕捞日志', icon: <EnvironmentOutlined /> },
  { key: 'water_check', label: '水质检测', icon: <AlertOutlined /> },
  { key: 'maintenance', label: '维护日志', icon: <ToolOutlined /> },
];

const LOG_TYPE_TAG: Record<string, { color: string; label: string }> = {
  feeding: { color: 'blue', label: '投喂' },
  medication: { color: 'red', label: '用药' },
  harvest: { color: 'green', label: '捕捞' },
  water_check: { color: 'cyan', label: '水质' },
  maintenance: { color: 'orange', label: '维护' },
};

const SOURCE_MAP: Record<string, string> = {
  app: 'APP', admin: '后台', system: '系统', task: '任务',
};

const VERIFY_STATUS_MAP: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  auto: { label: '自动通过', color: 'success' },
  pending: { label: '待审核', color: 'warning' },
  rejected: { label: '已驳回', color: 'error' },
};

const ProductionLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [statsLoading, setStatsLoading] = useState(false);
  const [todayStats, setTodayStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    setStatsLoading(true);
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const results: Record<string, number> = {};
      for (const opt of LOG_TYPE_OPTIONS) {
        if (opt.key === 'all') continue;
        const res = await searchLogs({
          logType: opt.key,
          actionTimeStart: today + ' 00:00:00',
          actionTimeEnd: today + ' 23:59:59',
          current: 1, pageSize: 1,
        });
        results[opt.key] = (res as any)?.total || 0;
      }
      setTodayStats(results);
    } catch (e) {
      console.error('获取今日统计失败:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '日志类型',
      dataIndex: 'logType',
      width: 90,
      render: (_, record) => {
        const cfg = LOG_TYPE_TAG[record.logType || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.label}</Tag> : (record.logType || '-');
      },
    },
    {
      title: '塘口/目标',
      dataIndex: 'targetId',
      width: 100,
      render: (val, record) => {
        const typeLabel = { pond: '塘', cage: '箱', vsl: '船' }[record.targetType || ''] || '';
        return val ? typeLabel + val : '-';
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
      render: (val) => (val != null ? <Text className="fin-number">{val}</Text> : '-'),
    },
    {
      title: '操作时间',
      dataIndex: 'actionTime',
      width: 155,
      render: (val) => (val ? dayjs(val).format('MM-DD HH:mm') : '-'),
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 70,
      render: (val) => SOURCE_MAP[val || ''] || val || '-',
    },
    {
      title: '审核状态',
      dataIndex: 'verifyStatus',
      width: 100,
      render: (val) => {
        const cfg = VERIFY_STATUS_MAP[val || ''];
        return cfg ? <Badge status={cfg.color} text={cfg.label} /> : '-';
      },
    },
    {
      title: '执行人',
      dataIndex: 'actualWorkerId',
      width: 90,
      render: (val) => val || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 155,
      render: (val) => (val ? dayjs(val).format('MM-DD HH:mm') : '-'),
    },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer title={false} breadcrumb={undefined} style={{ marginTop: '-24px' }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {LOG_TYPE_OPTIONS.filter(o => o.key !== 'all').map(opt => (
            <Col span={4} key={opt.key}>
              <Card variant="borderless" className="fin-card" loading={statsLoading}
                    styles={{ body: { padding: '16px' } }}>
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: '12px' }}>今日 {opt.label}</Text>}
                  value={todayStats[opt.key] || 0}
                  valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans' }}
                  prefix={opt.icon}
                />
              </Card>
            </Col>
          ))}
          <Col span={4}>
            <Card variant="borderless" className="fin-card" loading={statsLoading}
                  styles={{ body: { padding: '16px' } }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: '12px' }}>今日合计</Text>}
                value={Object.values(todayStats).reduce((a, b) => a + b, 0)}
                valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#1890ff' }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '12px 16px' } }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            tabBarExtraContent={
              <Space>
                <Button size="small" icon={<ReloadOutlined />} onClick={() => { fetchTodayStats(); }}>
                  刷新
                </Button>
              </Space>
            }
          >
            {LOG_TYPE_OPTIONS.map(opt => (
              <Tabs.TabPane
                tab={<Space size={4}>{opt.icon}<span>{opt.label}</span></Space>}
                key={opt.key}
              />
            ))}
          </Tabs>

          <ProTable<any>
            columns={columns}
            rowKey="id"
            params={{ tabKey: activeTab }}
            search={{
              labelWidth: 80,
              defaultCollapsed: true,
            }}
            request={async (params = {}) => {
              const queryParams: any = {
                current: params.current || 1,
                pageSize: params.pageSize || 20,
                ...params,
              };
              if (activeTab !== 'all') queryParams.logType = activeTab;
              delete queryParams._timestamp;
              const response = await searchLogs(queryParams);
              return {
                data: (response as any)?.data || [],
                success: true,
                total: (response as any)?.total || 0,
              };
            }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => '共 ' + total + ' 条',
            }}
            toolbar={{
              title: '生产日志列表',
              settings: [],
            }}
            toolBarRender={() => [
              <Button key="stats" icon={<BarChartOutlined />} onClick={fetchTodayStats}>
                刷新统计
              </Button>,
            ]}
            size="small"
            scroll={{ x: 900 }}
          />
        </Card>
      </PageContainer>
    </div>
  );
};

export default ProductionLogs;
