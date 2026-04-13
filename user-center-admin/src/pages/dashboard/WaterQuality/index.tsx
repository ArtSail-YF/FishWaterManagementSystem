import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Typography, Input, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { use, useState } from 'react';
import PondCardGrid from './components/PondCardGrid';
import QualityTrendChart from './components/QualityTrendChart';
import RecentAlerts from './components/RecentAlerts';
import WaterQualityStats from './components/WaterQualityStats';
import { useEffect } from 'react';
import  {getWaterDataList } from '@/services/api/water';


import { userInfo } from 'os';
import { TrackOpTypes } from 'vue';

const { Title } = Typography;

// 模拟塘口数据
const MOCK_PONDS: API.PondStatus[] = [
  {
    id: '1',
    name: '萧山 1 号塘',
    baseName: '萧山基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.8, trend: 'stable' },
      temp: { value: 24.5, trend: 'up' },
      ph: { value: 7.8, trend: 'stable' },
    },
  },
  {
    id: '2',
    name: '余杭 2 号塘',
    baseName: '余杭基地',
    status: 'warning',
    indicators: {
      oxygen: { value: 4.8, trend: 'down' },
      temp: { value: 26.1, trend: 'up' },
      ph: { value: 8.2, trend: 'up' },
    },
  },
  {
    id: '3',
    name: '富阳 3 号塘',
    baseName: '富阳基地',
    status: 'error',
    indicators: {
      oxygen: { value: 3.5, trend: 'down' },
      temp: { value: 23.8, trend: 'down' },
      ph: { value: 7.5, trend: 'stable' },
    },
  },
  {
    id: '4',
    name: '桐庐 4 号塘',
    baseName: '桐庐基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
    {
    id: '5',
    name: '桐庐 4 号塘',
    baseName: '桐庐基地',
    status: 'normal',
    indicators: {
      oxygen: { value: 6.5, trend: 'up' },
      temp: { value: 25.2, trend: 'stable' },
      ph: { value: 7.6, trend: 'stable' },
    },
  },
];





const WaterQuality: React.FC = () => {
  const [pondList, setPondList] = useState<API.PondStatus[]>([]);
  const [filteredPondList, setFilteredPondList] = useState<API.PondStatus[]>([]);
  const [selectedPond, setSelectedPond] = useState<API.PondStatus >();
  const [loading, setLoading] = useState(false);
  
  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [baseFilter, setBaseFilter] = useState<string>('all');




  const fecthPondData = async () => {
     try{
       const response=await getWaterDataList();
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
    
    // 状态过滤
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }
    
    // 基地过滤
    if (baseFilter !== 'all') {
      result = result.filter((p) => p.baseName === baseFilter);
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

  // 获取唯一的基地列表
  const baseOptions = Array.from(new Set(pondList.map(p => p.baseName))).map(name => ({
    value: name,
    label: name,
  }));

  // 重置筛选
  const handleReset = () => {
    setSearchText('');
    setStatusFilter('all');
    setBaseFilter('all');
  };

  const handleSelectPond = (pond:API. PondStatus) => {
    setSelectedPond(pond);
  };

  return (
    <PageContainer header={{ title: '水质监控' }}>
      <WaterQualityStats stats={stats} />
      
      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索塘口名称或基地"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'normal', label: '正常' },
              { value: 'warning', label: '预警' },
              { value: 'error', label: '异常' },
            ]}
          />
          <Select
            placeholder="基地筛选"
            value={baseFilter}
            onChange={setBaseFilter}
            style={{ width: 160 }}
            options={[
              { value: 'all', label: '全部基地' },
              ...baseOptions,
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
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
