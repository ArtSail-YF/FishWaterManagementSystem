import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Typography, Input, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import PondCardGrid from './components/PondCardGrid';
import QualityTrendChart from './components/QualityTrendChart';
import RecentAlerts from './components/RecentAlerts';
import WaterQualityStats from './components/WaterQualityStats';
import { getPondSummary } from '@/services/api/iot-ts-data';

const { Title } = Typography;

// 模拟塘口数据
const MOCK_PONDS: API.PondStatus[] = [
  {
    id: '1',
    name: '海宁1号塘',
    baseName: '海宁1号基地,
    status: 'normal',
    indicators: {
      oxygen: { value: 6.8, trend: 'stable' },
      temp: { value: 24.5, trend: 'up' },
      ph: { value: 7.8, trend: 'stable' },
    },
  },
  {
    id: '2',
    name: '海宁2号塘',
    baseName: '海宁1号基地,
    status: 'warning',
    indicators: {
      oxygen: { value: 4.8, trend: 'down' },
      temp: { value: 26.1, trend: 'up' },
      ph: { value: 8.2, trend: 'up' },
    },
  },
  {
    id: '3',
    name: '嘉兴南湖1号塘',
    baseName: '嘉兴南湖基地',
    status: 'error',
    indicators: {
      oxygen: { value: 3.5, trend: 'down' },
      temp: { value: 23.8, trend: 'down' },
      ph: { value: 7.5, trend: 'stable' },
    },
  },
  {
    id: '4',
    name: '嘉兴南湖2号塘',
    baseName: '嘉兴南湖基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
  {
    id: '5',
    name: '舟山定海1号塘',
    baseName: '舟山定海基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
  {
    id: '6',
    name: '温州苍南1号塘',
    baseName: '温州苍南基地',
    status: 'warning',
    indicators: {
      oxygen: { value: 4.2, trend: 'down' },
      temp: { value: 26.5, trend: 'up' },
      ph: { value: 8.0, trend: 'stable' },
    },
  },
];





const WaterQuality: React.FC = () => {
  const [pondList, setPondList] = useState<Pond.PondStatus[]>([]);
  const [filteredPondList, setFilteredPondList] = useState<API.PondStatus[]>([]);
  const [selectedPond, setSelectedPond] = useState<API.PondStatus >();
  const [loading, setLoading] = useState(false);

  // 路由参数处理
  const [searchParams] = useSearchParams();
  const initialBaseId = searchParams.get('baseId');

  // 筛选状态过滤
  constsearchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [baseFilter, setBaseFilter] = useState<string>(initialBaseId || 'all');

  // 鍩哄湴閫夐」閰嶇疆
  const baseOptions = [
    { label: '全部基地', value: 'all' },
    { label: '海宁1号基地, value: 'B001' },
    { label: '嘉兴南湖基地', value: 'B002' },
    { label: '舟山定海基地', value: 'B003' },
    { label: '温州苍南基地', value: 'B004' },
  ];

  // 基地id到基地名称的映射
  const baseIdToNameMap: { [key: string]: string } = {
    'B001': '海宁1号基地,
    'B002': '嘉兴南湖基地',
    'B003': '舟山定海基地',
    'B004': '温州苍南基地'
  };

  const fecthPondData = async () => {
     try{
       const response=await getPondSummary();
       const data = response?.data || [];
       setPondList(data);
       setFilteredPondList(data);
        if (data.length > 0) {
        setSelectedPond(data[0]);
      }
     }catch(err){
       setPondList(MOCK_PONDS);
       setFilteredPondList(MOCK_PONDS);
       setSelectedPond(MOCK_PONDS[0]);
       console.log("获取水质数据失败");
     }

  };

  // 监听URL参数变化
  useEffect(() => {
    const baseId = searchParams.get('baseId');
    if (baseId) {
      setBaseFilter(baseId);
    }
  }, [searchParams]);

  useEffect(() => {

      fecthPondData();

  }, []);

  // 筛选逻辑
  useEffect(() => {
    let result = pondList;

    // 搜索过滤
    if (searchText) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.baseName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 状态过婊?
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // 基地过滤
    if (baseFilter !== 'all') {
      const baseName = baseIdToNameMap[baseFilter] || baseFilter;
      result = result.filter((p) => p.baseName === baseName);
    }

    setFilteredPondList(result);
  }, [pondList, searchText, statusFilter, baseFilter]);

  // 统计数据
  const stats = {
    total: filteredPondList.length,
    normal: filteredPondList.filter(p => p.status === 'normal').length,
    warning: filteredPondList.filter(p => p.status === 'warning').length,
    error: filteredPondList.filter(p => p.status === 'error').length,
  };

  // 重置筛选
  constandleSelectPond = (pond:API. PondStatus) => {
    setSelectedPond(pond);
  };

  return (
    <PageContainer  title={false} >
      <WaterQualityStats stats={stats} />

      {/* 统计栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索塘口名称或基地
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="状态筛閫?
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部状鎬? },
              { value: 'normal', label: '正常' },
              { value: 'warning', label: '预警' },
              { value: 'error', label: '异常' },
            ]}
          />
          <Select
            placeholder="基地筛閫?
            value={baseFilter}
            onChange={setBaseFilter}
            style={{ width: 160 }}
            options={baseOptions}
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            閲嶇疆
          </Button>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={24}>
          <PondCardGrid
            ponds={filteredPondList}
            selectedPondId={selectedPond?.id}
            onSelect={handleSelectPond}
          />
        </Col>
      </Row>

      <Row gutter={16}>

        <Col xs={24} lg={16}>
          <QualityTrendChart pond={selectedPond} loading={loading} />
        </Col>

        <Col xs={24} lg={8}>
          <Card
            styles={{
              body: { padding: '16px' },
            }}
            style={{ height: '420px', overflowY: 'auto' }}
          >
            <RecentAlerts pond={selectedPond} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default WaterQuality;
