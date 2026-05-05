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
import { getPondListRaw, deletePond } from '@/services/api/pond';
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
      // 构造符合后端对齐的参数
      const apiParams = {
        current: filterValues.pageNum,
        pageSize: filterValues.pageSize,
        pondName: filterValues.searchText,
        baseId: filterValues.baseId,
        status: filterValues.status === 'breeding' ? 'ENABLED' : filterValues.status === 'empty' ? 'DISABLED' : undefined,
        currentSpecies: filterValues.species,
      };
      
      const response = await getPondListRaw(apiParams);
      
      // 后端返回格式: {code: 200, message: "success", data: {records: [...], total, size, current, pages}}
      const pondData = response.data?.data?.records || response.data?.records || [];
      const total = response.data?.data?.total || response.data?.total || 0;
      const summary = response.data?.data?.summary || response.data?.summary || {};
      
      setPondData(pondData.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.pondName || item.name,
        status: item.status === 'ENABLED' ? 'breeding' : item.status === 'DISABLED' ? 'empty' : 'locked',
        species: item.currentSpecies || item.species,
      })));
      
      // 解析汇总数据
      setSummaryData({
        totalPonds: total,
        breedingCount: summary.breedingCount || pondData.filter((i: any) => i.status === 'ENABLED').length,
        emptyCount: summary.emptyCount || pondData.filter((i: any) => i.status === 'DISABLED').length,
        lockedCount: summary.lockedCount || pondData.filter((i: any) => i.status === 'MAINTENANCE').length,
        totalArea: summary.totalArea || 0,
        avgDepth: summary.avgDepth || 0,
        totalBiomass: summary.totalBiomass || 0,
        species: summary.species || [],
      });
    } catch (error) {
      console.error('获取塘口数据失败:', error);
      // 使用Mock数据降级
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
          <PondSummaryStats 
            totalPonds={summaryData?.totalPonds || 18}
            breedingCount={summaryData?.breedingCount || 12}
            emptyCount={summaryData?.emptyCount || 3}
            lockedCount={summaryData?.lockedCount || 1}
            totalArea={summaryData?.totalArea || 12500}
            avgDepth={summaryData?.avgDepth || 1.8}
            totalBiomass={summaryData?.totalBiomass || 45.8}
            species={summaryData?.species || ['南美白对虾', '大黄鱼']}
          />

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