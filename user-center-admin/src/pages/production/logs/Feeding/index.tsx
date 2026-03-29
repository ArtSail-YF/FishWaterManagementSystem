import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import FeedingAnalysis from './components/FeedingAnalysis';
import FeedingLogTable from './components/FeedingLogTable';
import FeedingStats from './components/FeedingStats';

const FeedingLogs: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 核心投喂指标 */}
          <FeedingStats />

          {/* 2. 高密度投喂日志明细 (向上移动) */}
          <FeedingLogTable />

          {/* 3. 投喂趋势与时段分析 */}
          <FeedingAnalysis />
        </Space>
      </PageContainer>
    </div>
  );
};

export default FeedingLogs;
