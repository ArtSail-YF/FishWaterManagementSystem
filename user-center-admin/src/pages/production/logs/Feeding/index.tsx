import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import FeedingAnalysis from './components/FeedingAnalysis';
import FeedingLogTable from './components/FeedingLogTable';
import FeedingStats from './components/FeedingStats';

const FeedingLogs: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer title={false}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <FeedingStats />
          <FeedingLogTable />
          <FeedingAnalysis />
        </Space>
      </PageContainer>
    </div>
  );
};

export default FeedingLogs;