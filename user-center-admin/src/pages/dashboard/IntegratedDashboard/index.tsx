import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Typography, Alert, Badge, Tag, Statistic } from 'antd';
import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';

// 塘口档案组件
import PondFilterBar from '../PondArchives/components/PondFilterBar';
import PondGrid from '../PondArchives/components/PondGrid';
import PondSummaryStats from '../PondArchives/components/PondSummaryStats';
import PondDetailDrawer from '../PondArchives/components/PondDetailDrawer';

// 水质监控组件
import QualityTrendChart from '../WaterQuality/components/QualityTrendChart';
import RecentAlerts from '../WaterQuality/components/RecentAlerts';

// 服务引用
import { getPondListWithSummary, deletePond } from '@/services/api/pond';
import { getWaterDataList } from '@/services/api/water';
import { MOCK_PONDS, MOCK_POND_STATS } from '@/services/api/mock';

// 类型定义
import type { PondItem } from '@/types/model';
import type { PondStatusItem } from '@/models/pond';

const { Text, Title } = Typography;

const IntegratedDashboard: React.FC = () => {
  // 路由参数处理
  const [searchParams] = useSearchParams();
  const initialBaseId = searchParams.get('baseId');

  // 2. 核心状态管理
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'production' | 'device'>('production');
  const [pondData, setPondData] = useState<PondItem[]>([]);
  const [summaryData, setSummaryData] = useState<any>({});
  const [selectedPondId, setSelectedPondId] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<any>({
    baseId: initialBaseId || undefined,
    pageNum: 1,
    pageSize: 10,
  });

  // 水质监控状态
  const [waterPondList, setWaterPondList] = useState<PondStatusItem[]>([]);
  const [selectedWaterPond, setSelectedWaterPond] = useState<PondStatusItem>();
  const [waterLoading, setWaterLoading] = useState(false);

  // 异常塘口速览
  const [abnormalPonds, setAbnormalPonds] = useState<Array<{ id: string; name: string; metric: string; value: number }>>([]);
  const [newAlerts, setNewAlerts] = useState<number>(0);

  // 底部指标卡数据
  const [bottomStats, setBottomStats] = useState({
    avgOxygen: 7.2,
    avgPh: 7.8,
    avgTemp: 26.3,
    avgTransparency: 32,
    worstOxygen: { value: 2.1, pondId: 'P005' },
    worstPh: { value: 8.5, pondId: 'P012' },
  });

  // 加载塘口档案数据
  const fetchPondData = async () => {
    setLoading(true);
    try {
      const response = await getPondListWithSummary(filterValues);
      if (response.data) {
        setPondData(response.data.list || []);
        setSummaryData(response.data.summary || {});
      }
    } catch (error) {
      console.error('获取塘口数据失败，使用降级数据:', error);
      setPondData(MOCK_PONDS);
      setSummaryData(MOCK_POND_STATS);
    } finally {
      setLoading(false);
    }
  };

  // 加载水质数据
  const fetchWaterData = async () => {
    setWaterLoading(true);
    try {
      const response = await getWaterDataList();
      const data = response?.data || [];
      setWaterPondList(data);
      if (data.length > 0) {
        setSelectedWaterPond(data[0]);
      }
      
      // 提取异常塘口
      const abnormal = data
        .filter(p => p.status === 'error' || p.status === 'warning')
        .map(p => {
          let metric = '溶氧';
          let value = p.indicators.oxygen.value;
          if (p.indicators.ph.value > 8.0) {
            metric = 'pH';
            value = p.indicators.ph.value;
          }
          return {
            id: p.id,
            name: p.name,
            metric,
            value
          };
        });
      setAbnormalPonds(abnormal);
      setNewAlerts(Math.floor(Math.random() * 3));
    } catch (error) {
      console.error('获取水质数据失败:', error);
    } finally {
      setWaterLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchPondData();
    fetchWaterData();
  }, []);

  // 监听筛选条件变化
  useEffect(() => {
    fetchPondData();
  }, [filterValues]);

  // 处理塘口点击
  const handlePondClick = (pond: PondItem) => {
    setSelectedPondId(pond.id);
    setDrawerVisible(true);
    
    // 更新右侧水质趋势分析
    const correspondingWaterPond = waterPondList.find(p => p.id === pond.id);
    if (correspondingWaterPond) {
      setSelectedWaterPond(correspondingWaterPond);
    }
  };

  // 处理塘口悬停
  const handlePondHover = (pond: PondItem) => {
    // 更新右侧水质趋势分析
    const correspondingWaterPond = waterPondList.find(p => p.id === pond.id);
    if (correspondingWaterPond) {
      setSelectedWaterPond(correspondingWaterPond);
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setFilterValues({ ...filterValues, ...values, pageNum: 1 });
  };

  // 处理删除塘口
  const handleDeletePond = async (id: string) => {
    try {
      await deletePond(id);
      fetchPondData();
    } catch (error) {
      console.error('删除塘口失败:', error);
    }
  };

  // 处理水质塘口选择
  const handleSelectWaterPond = (pond: PondStatusItem) => {
    setSelectedWaterPond(pond);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer
        header={{ title: '综合监控仪表板' }}
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {/* 顶部状态卡 */}
          <Row gutter={[16, 16]}>
            {/* 1. 总塘口数 */}
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="fin-card">
                <Statistic
                  title={
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                      总塘口数 / TOTAL PONDS
                    </Text>
                  }
                  value={18}
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                  className="fin-number"
                  suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个</span>}
                />
                <div style={{ marginTop: '12px' }}>
                  <Space size={12} wrap>
                    <Badge status="processing" text={<span style={{ fontSize: '12px' }}>养殖中 12</span>} />
                    <Badge status="success" text={<span style={{ fontSize: '12px' }}>空塘 3</span>} />
                    <Badge status="error" text={<span style={{ fontSize: '12px' }}>锁定 1</span>} />
                  </Space>
                </div>
              </Card>
            </Col>

            {/* 2. 监测塘口总数 */}
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="fin-card">
                <Statistic
                  title={
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                      监测塘口总数
                    </Text>
                  }
                  value={18}
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                  className="fin-number"
                  suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个</span>}
                />
                <div style={{ marginTop: '12px' }}>
                  <Space size={12} wrap>
                    <Badge status="success" text={<span style={{ fontSize: '12px' }}>水质正常 13</span>} />
                    <Badge status="warning" text={<span style={{ fontSize: '12px' }}>低溶氧预警 4</span>} />
                    <Badge status="error" text={<span style={{ fontSize: '12px' }}>水质异常 1</span>} />
                  </Space>
                </div>
              </Card>
            </Col>

            {/* 3. 水质指标 */}
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="fin-card">
                <Statistic
                  title={
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                      水质指标
                    </Text>
                  }
                  value={13}
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}
                  className="fin-number"
                  suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个正常</span>}
                />
                <div style={{ marginTop: '12px', fontSize: '12px' }}>
                  <Space size={8} wrap>
                    <span>💧 7.2 mg/L</span>
                    <span>🧪 7.8 pH</span>
                    <span>🌡 26.3 °C</span>
                    <span>👁 32 cm</span>
                  </Space>
                </div>
              </Card>
            </Col>

            {/* 4. 今日报警 */}
            <Col xs={24} sm={12} lg={6}>
              <Card variant="borderless" className="fin-card">
                <Statistic
                  title={
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                      今日报警
                    </Text>
                  }
                  value={3}
                  valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}
                  className="fin-number"
                  suffix={<span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'normal' }}>个</span>}
                />
              </Card>
            </Col>
          </Row>

          {/* 中部区域：左右分栏 */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            {/* 左侧：塘口档案（70%宽度） */}
            <Col lg={17} xs={24}>
              <Card>
                <PondFilterBar 
                  onSearch={handleSearch} 
                  viewMode={viewMode} 
                  onViewModeChange={setViewMode} 
                  initialValues={filterValues}
                />
                <PondGrid 
                  ponds={pondData}        
                  loading={loading}    
                  onPondClick={handlePondClick} 
                  onPondHover={handlePondHover}
                  viewMode={viewMode}
                  filterValues={filterValues}
                />
              </Card>
            </Col>
            
            {/* 右侧：水质监控（30%宽度） */}
            <Col xs={24} lg={7}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <QualityTrendChart pond={selectedWaterPond} loading={waterLoading} />
                
                {/* 异常塘口速览条 */}
                <Alert
                  message={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {abnormalPonds.map((pond, index) => (
                          <span key={index} style={{ fontSize: 14 }}>
                            ⚠️ {pond.name}（{pond.metric}{pond.value}）
                          </span>
                        ))}
                        {newAlerts > 0 && (
                          <Badge count={newAlerts} showZero>
                            <span style={{ fontSize: 14 }}>🔔 新报警</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  }
                  type="warning"
                  showIcon
                />
                
                <Card
                  styles={{
                    body: { padding: '16px' },
                  }}
                  style={{ height: '300px', overflowY: 'auto' }}
                >
                  <RecentAlerts pond={selectedWaterPond} />
                </Card>
              </Space>
            </Col>
          </Row>


        </Space>
      </PageContainer>

      {/* 塘口详情抽屉 */}
      <PondDetailDrawer
        visible={drawerVisible}
        pondId={selectedPondId}
        onClose={() => setDrawerVisible(false)}
        onDelete={handleDeletePond}
      />
    </div>
  );
};

export default IntegratedDashboard;