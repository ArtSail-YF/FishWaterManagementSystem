import { PageContainer } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import BaseFilter from './components/BaseFilter';
import GISStats from './components/GISStats';
import GisMap from './components/GisMap';
import { getBaseList } from '@/services/api/base';

const BaseDistribution: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bases, setBases] = useState<Pond.BaseItem[]>([]);
  const [selectedBase, setSelectedBase] = useState<Pond.BaseItem | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBaseList();
      // 后端返回的是 PageResult 结构，数据在 records 中
      const data = response.data?.records || response.data || [];
      setBases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取基地数据失败:', error);
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

  // 搜索过滤
  const filteredBases = bases.filter((b) =>
    b.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectBase = (base: Pond.BaseItem) => {
    setSelectedBase(base);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };




  return (
    <PageContainer header={{ title: '基地分布' }}>
      <GISStats stats={stats} />
      <Row gutter={16}>
        <Col span={7}>
          <BaseFilter
            bases={filteredBases}
            selectedBaseId={selectedBase?.id}
            onSelect={handleSelectBase}
            onSearch={handleSearch}
          />
        </Col>
        <Col span={17}>
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
