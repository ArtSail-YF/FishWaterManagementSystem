import { PageContainer } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import BaseFilter from './components/BaseFilter';
import GISStats from './components/GISStats';
import GisMap from './components/GisMap';
import { getBaseList } from '@/services/api/base';
import { MOCK_BASES } from '@/services/api/mock';
import { message } from 'antd';

const BaseDistribution: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bases, setBases] = useState<Pond.BaseItem[]>([]);
  const [selectedBase, setSelectedBase] = useState<Pond.BaseItem | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [filteredBases, setFilteredBases] = useState<Pond.BaseItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // 高级筛选状态
  const [advancedFilters, setAdvancedFilters] = useState({
    region: [] as string[],
    baseType: 'all',
    cooperationAttrs: {
      taiwanCooperation: false,
      deepSeaCertified: false,
      greenCertification: false,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBaseList();
      setBases(response.data || []);
    } catch (error) {
      console.error('获取基地数据失败，使用降级数据:', error);
      setBases(MOCK_BASES);
      message.warning('当前处于基地模拟视图');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 统计数据
  const stats = {
    normal: bases.filter((b) => b.status === 'normal').length,
    todo: bases.filter((b) => b.status === 'todo').length,
    warning: bases.filter((b) => b.status === 'warning').length,
  };

  // 过滤数据
  useEffect(() => {
    let result = bases;
    
    // 搜索过滤
    if (searchText) {
      result = result.filter((b) =>
        b.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 状态过滤
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }
    
    // 区域过滤
    if (advancedFilters.region.length > 0) {
      result = result.filter((b) => 
        advancedFilters.region.some(region => b.region?.includes(region))
      );
    }
    
    // 基地类型过滤
    if (advancedFilters.baseType !== 'all') {
      result = result.filter((b) => b.baseType === advancedFilters.baseType);
    }
    
    // 合作属性过滤
    const { cooperationAttrs } = advancedFilters;
    if (cooperationAttrs.taiwanCooperation) {
      result = result.filter((b) => b.taiwanCooperation === true);
    }
    if (cooperationAttrs.deepSeaCertified) {
      result = result.filter((b) => b.deepSeaCertified === true);
    }
    if (cooperationAttrs.greenCertification) {
      result = result.filter((b) => b.greenCertification === true);
    }
    
    setFilteredBases(result);
  }, [bases, searchText, statusFilter, advancedFilters]);

  const handleSelectBase = (base: Pond.BaseItem) => {
    setSelectedBase(base);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // 处理高级筛选变化
  const handleAdvancedFilterChange = (filters: {
    region: string[];
    baseType: string;
    cooperationAttrs: {
      taiwanCooperation: boolean;
      deepSeaCertified: boolean;
      greenCertification: boolean;
    };
  }) => {
    setAdvancedFilters(filters);
  };

  return (
    <PageContainer title={false}>
      {/* 顶部状态条 */}
      <GISStats 
        stats={stats} 
        onStatusClick={handleStatusFilter} 
      />
      
      {/* 主内容区域 */}
      <Row gutter={16} style={{ height: 'calc(100vh - 200px)' }}>
        {/* 左侧筛选面板 - 25%宽度 */}
        <Col span={6} style={{ height: '100%' }}>
          <BaseFilter
            bases={filteredBases}
            selectedBaseId={selectedBase?.id}
            onSelect={handleSelectBase}
            onSearch={handleSearch}
            onAdvancedFilterChange={handleAdvancedFilterChange}
            advancedFilters={advancedFilters}
          />
        </Col>
        
        {/* 中央地图区域 - 75%宽度 */}
        <Col span={18} style={{ height: '100%' }}>
          <GisMap
            bases={filteredBases}
            selectedBase={selectedBase}
            onMarkerClick={handleSelectBase}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default BaseDistribution;
