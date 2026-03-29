import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import PondDetailDrawer from './components/PondDetailDrawer';
import PondGrid, { type PondItem } from './components/PondGrid';
import PondSummaryStats from './components/PondSummaryStats';
import PondFilterBar from './components/PondFilterBar';

const PondArchives: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialBaseId = searchParams.get('baseId');
  const [selectedPond, setSelectedPond] = useState<PondItem | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'production' | 'device'>('device');
  const [filterValues, setFilterValues] = useState<any>({
    baseId: initialBaseId || undefined,
  });

  const handlePondClick = (pond: PondItem) => {
    setSelectedPond(pond);
    setDrawerVisible(true);
  };

  const handleSearch = (values: any) => {
    setFilterValues(values);
  };

  const handleDeletePond = (id: string) => {
    console.log('执行删除:', id);
    // 这里未来会调用 API
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer
        header={{ title: '塘口档案' }}
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
        extra={[
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ borderRadius: '2px' }}>
            新增塘口档案
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 资产与规模概览 */}
          <PondSummaryStats />

          {/* 2. 搜索与视图切换栏 */}
          <PondFilterBar 
            onSearch={handleSearch} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
            initialValues={filterValues}
          />

          {/* 3. 塘口矩阵监控网格 */}
          <PondGrid 
            onPondClick={handlePondClick} 
            viewMode={viewMode}
            filterValues={filterValues}
          />
        </Space>
      </PageContainer>

      {/* 4. 详情抽屉 */}
      <PondDetailDrawer
        visible={drawerVisible}
        pond={selectedPond}
        onClose={() => setDrawerVisible(false)}
        onDelete={handleDeletePond}
      />
    </div>
  );
};

export default PondArchives;
