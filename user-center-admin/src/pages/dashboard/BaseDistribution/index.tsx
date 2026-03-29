import { PageContainer } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import BaseFilter, { BaseItem } from './components/BaseFilter';
import GISStats from './components/GISStats';
import GisMap from './components/GisMap';

// 模拟数据
const MOCK_BASES: BaseItem[] = [
  {
    id: '1',
    name: '萧山生态基地 01',
    location: [120.253576, 30.227459],
    status: 'normal',
    waterQuality: { oxygen: 6.8, temp: 24.5, ph: 7.8 },
  },
  {
    id: '2',
    name: '余杭育苗基地 02',
    location: [120.003576, 30.287459],
    status: 'warning',
    waterQuality: { oxygen: 4.2, temp: 26.1, ph: 8.2 },
  },
  {
    id: '3',
    name: '富阳智慧渔场 03',
    location: [119.953576, 30.057459],
    status: 'todo',
    waterQuality: { oxygen: 7.2, temp: 23.8, ph: 7.5 },
  },
  {
    id: '4',
    name: '桐庐淡水养殖区 04',
    location: [119.653576, 29.857459],
    status: 'normal',
    waterQuality: { oxygen: 6.5, temp: 25.2, ph: 7.6 },
  },
];

const BaseDistribution: React.FC = () => {
  const [bases, setBases] = useState<BaseItem[]>(MOCK_BASES);
  const [selectedBase, setSelectedBase] = useState<BaseItem | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  // 统计数据
  const stats = {
    normal: MOCK_BASES.filter((b) => b.status === 'normal').length,
    todo: MOCK_BASES.filter((b) => b.status === 'todo').length,
    warning: MOCK_BASES.filter((b) => b.status === 'warning').length,
  };

  // 搜索过滤
  const filteredBases = bases.filter((b) =>
    b.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectBase = (base: BaseItem) => {
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
