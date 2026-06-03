import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Typography, Alert, Tag, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined, WarningFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';

import PondFilterBar from '../PondArchives/components/PondFilterBar';
import PondGrid from '../PondArchives/components/PondGrid';
import PondSummaryStats from '../PondArchives/components/PondSummaryStats';
import PondDetailDrawer from '../PondArchives/components/PondDetailDrawer';

import WaterQualityStats from '../WaterQuality/components/WaterQualityStats';
import QualityTrendChart from '../WaterQuality/components/QualityTrendChart';
import RecentAlerts from '../WaterQuality/components/RecentAlerts';

import { getPondListRaw, deletePond } from '@/services/api/pond';
import { getEnvWqList, getEnvWqDict } from '@/services/api/iot-ts-data';
import { MOCK_PONDS, MOCK_POND_STATS } from '@/services/api/mock';

import type { PondItem } from '@/types/model';
import type { PondStatusItem } from '@/models/pond';

const { Text } = Typography;

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 14 }} />;
  if (trend === 'down') return <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 14 }} />;
  return <MinusOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />;
};

const MetricCard = ({ label, value, unit, trend }: {
  label: string; value: number | string; unit: string; trend?: 'up' | 'down' | 'stable';
}) => (
  <Card size="small" styles={{ body: { padding: '10px 14px' } }}>
    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>{label}</Text>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 22, fontWeight: 600, lineHeight: '28px' }}>
        {typeof value === 'number' ? value.toFixed(1) : value}
      </span>
      {unit && <span style={{ fontSize: 12, color: '#8c8c8c' }}>{unit}</span>}
      {trend && <TrendIcon trend={trend} />}
    </div>
  </Card>
);

const IntegratedDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialBaseId = searchParams.get('baseId');

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

  const [waterPondList, setWaterPondList] = useState<PondStatusItem[]>([]);
  const [selectedWaterPond, setSelectedWaterPond] = useState<PondStatusItem>();
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterStats, setWaterStats] = useState({ total: 0, normal: 0, warning: 0, error: 0 });
  const [abnormalPonds, setAbnormalPonds] = useState<Array<{ name: string; metric: string; value: number }>>([]);
  const [dictData, setDictData] = useState<any>({});

  const fetchPondData = async () => {
    setLoading(true);
    try {
      const apiParams = {
        current: filterValues.pageNum,
        pageSize: filterValues.pageSize,
        pondName: filterValues.searchText,
        baseId: filterValues.baseId,
        status: filterValues.status === 'breeding' ? 1 : filterValues.status === 'empty' ? 0 : undefined,
        currentSpecies: filterValues.species,
      };

      const response = await getPondListRaw(apiParams);
      const list = response.data?.data?.records || response.data?.records || [];
      const total = response.data?.data?.total || response.data?.total || 0;
      const summary = response.data?.data?.summary || response.data?.summary || {};

      setPondData(list.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.pondName || item.name,
        status: item.status === 'ENABLED' ? 'breeding' : item.status === 'DISABLED' ? 'empty' : 'locked',
        species: item.currentSpecies || item.species,
      })));

      setSummaryData({
        totalPonds: total,
        breedingCount: summary.breedingCount || list.filter((i: any) => i.status === 'ENABLED').length,
        emptyCount: summary.emptyCount || list.filter((i: any) => i.status === 'DISABLED').length,
        lockedCount: summary.lockedCount || list.filter((i: any) => i.status === 'MAINTENANCE').length,
        totalArea: summary.totalArea || 0,
        avgDepth: summary.avgDepth || 0,
        totalBiomass: summary.totalBiomass || 0,
        species: summary.species || [],
      });
    } catch {
      setPondData(MOCK_PONDS as any);
      setSummaryData(MOCK_POND_STATS);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterData = async () => {
    setWaterLoading(true);
    try {
      const response = await getEnvWqList();
      const data = response?.data || [];
      setWaterPondList(data);
      if (data.length > 0) setSelectedWaterPond(data[0]);

      const normal = data.filter((p: PondStatusItem) => p.status === 'normal').length;
      const warning = data.filter((p: PondStatusItem) => p.status === 'warning').length;
      const error = data.filter((p: PondStatusItem) => p.status === 'error').length;
      setWaterStats({ total: data.length, normal, warning, error });

      const abnormal = data
        .filter((p: PondStatusItem) => p.status === 'error' || p.status === 'warning')
        .map((p: PondStatusItem) => ({
          name: p.name,
          metric: p.indicators.ph.value > 8.0 ? 'pH' : '溶解氧',
          value: p.indicators.ph.value > 8.0 ? p.indicators.ph.value : p.indicators.oxygen.value,
        }));
      setAbnormalPonds(abnormal);
    } catch {
      console.error('水质数据加载失败');
    } finally {
      setWaterLoading(false);
    }
  };

  const fetchDict = async () => {
    try {
      const data = await getEnvWqDict();
      setDictData(data);
    } catch {}
  };

  useEffect(() => {
    fetchPondData();
    fetchWaterData();
    fetchDict();
  }, []);

  useEffect(() => {
    fetchPondData();
  }, [filterValues]);

  const handlePondClick = (pond: PondItem) => {
    setSelectedPondId(pond.id);
    setDrawerVisible(true);
    const match = waterPondList.find(p => p.id === pond.id);
    if (match) setSelectedWaterPond(match);
  };

  const handlePondHover = (pond: PondItem) => {
    const match = waterPondList.find(p => p.id === pond.id);
    if (match) setSelectedWaterPond(match);
  };

  const handleSearch = (values: any) => {
    setFilterValues({ ...filterValues, ...values, pageNum: 1 });
  };

  const handleDeletePond = async (id: string) => {
    try {
      await deletePond(id);
      fetchPondData();
    } catch {
      console.error('删除塘口失败');
    }
  };

  const currentMetrics = selectedWaterPond ? {
    oxygen: selectedWaterPond.indicators?.oxygen,
    temp: selectedWaterPond.indicators?.temp,
    ph: selectedWaterPond.indicators?.ph,
  } : null;

  const statusLabel = selectedWaterPond
    ? selectedWaterPond.status === 'normal' ? '正常'
      : selectedWaterPond.status === 'warning' ? '预警' : '异常'
    : '';

  const trendPondId = selectedWaterPond ? selectedWaterPond.id : undefined;

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <PageContainer
        header={{ title: '综合监控仪表盘' }}
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: -24 }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>

          {/* 顶部统计行 */}
          <Row gutter={16}>
            <Col xs={24} lg={14}>
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
            </Col>
            <Col xs={24} lg={10}>
              <WaterQualityStats stats={waterStats} />
            </Col>
          </Row>

          {/* 异常告警横幅 */}
          {abnormalPonds.length > 0 && (
            <Alert
              type="warning"
              showIcon
              icon={<WarningFilled />}
              message={
                <Space wrap size={[16, 4]}>
                  {abnormalPonds.map((p, i) => (
                    <span key={i}>
                      <Tag color="red" style={{ marginRight: 4 }}>异常</Tag>
                      {p.name}({p.metric}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value})
                    </span>
                  ))}
                </Space>
              }
            />
          )}

          {/* 主体内容：左塘口网格 + 右水质面板 */}
          <Row gutter={16}>
            <Col xs={24} lg={14}>
              <Card styles={{ body: { padding: 16 } }}>
                <PondFilterBar
                  dict={{
                    baseList: dictData.baseList,
                    pondStatusList: dictData.pondStatusList,
                    speciesList: dictData.speciesList,
                  }}
                  onSearch={handleSearch}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  initialValues={filterValues}
                />
                <div style={{ marginTop: 12 }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                  ) : (
                    <PondGrid
                      ponds={pondData}
                      onPondClick={handlePondClick}
                      onPondHover={handlePondHover}
                      viewMode={viewMode}
                      filterValues={filterValues}
                    />
                  )}
                </div>
              </Card>
            </Col>

            {/* 右侧面板 */}
            <Col xs={24} lg={10}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>

                {/* 指标卡片 */}
                <Card
                  title={selectedWaterPond?.name || '水质指标'}
                  styles={{
                    header: { padding: '12px 16px', fontWeight: 600, fontSize: 14 },
                    body: { padding: '12px 16px' },
                  }}
                >
                  {currentMetrics ? (
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <MetricCard label="溶解氧" value={currentMetrics.oxygen.value} unit="mg/L" trend={currentMetrics.oxygen.trend} />
                      </Col>
                      <Col span={12}>
                        <MetricCard label="pH 值" value={currentMetrics.ph.value} unit="" trend={currentMetrics.ph.trend} />
                      </Col>
                      <Col span={12}>
                        <MetricCard label="水温" value={currentMetrics.temp.value} unit="℃" trend={currentMetrics.temp.trend} />
                      </Col>
                      <Col span={12}>
                        <MetricCard label="塘口状态" value={statusLabel} unit="" />
                      </Col>
                    </Row>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#bdbdbd', padding: '32px 0', fontSize: 13 }}>
                      点击左侧塘口查看实时水质
                    </div>
                  )}
                </Card>

                {/* 水质趋势图 */}
                <Card
                  title="水质趋势"
                  styles={{
                    header: { padding: '12px 16px', fontWeight: 600, fontSize: 14 },
                    body: { padding: '12px 16px' },
                  }}
                >
                  <QualityTrendChart pondId={trendPondId} />
                </Card>

                {/* 最近告警 */}
                <Card
                  title="最近告警"
                  styles={{
                    header: { padding: '12px 16px', fontWeight: 600, fontSize: 14 },
                    body: { padding: '12px 16px' },
                  }}
                >
                  <Spin spinning={waterLoading}>
                    <RecentAlerts pondId={trendPondId} />
                  </Spin>
                </Card>

              </Space>
            </Col>
          </Row>

        </Space>
      </PageContainer>

      <PondDetailDrawer
        open={drawerVisible}
        pondId={selectedPondId}
        onClose={() => setDrawerVisible(false)}
        onDelete={(id) => handleDeletePond(id)}
      />
    </div>
  );
};

export default IntegratedDashboard;
