import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import WeatherHistoryFilter from './components/WeatherHistoryFilter';
import WeatherHistoryTable from './components/WeatherHistoryTable';
import WeatherTrendAnalysis from './components/WeatherTrendAnalysis';

const WeatherHistory: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 多维组合筛选 */}
          <WeatherHistoryFilter />

          {/* 2. 趋势深度对比分析 */}
          <WeatherTrendAnalysis />

          {/* 3. 高密度数据列表 */}
          <WeatherHistoryTable />
        </Space>
      </PageContainer>
    </div>
  );
};

export default WeatherHistory;
