import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import RiskMonitoring from './components/RiskMonitoring';
import CertificateApplication from './components/CertificateApplication';
import HistoryRecords from './components/HistoryRecords';
import StatisticsAnalysis from './components/StatisticsAnalysis';

const Certificates: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 休药期风险监控 */}
          <RiskMonitoring />

          {/* 2. 合格证申请管理 */}
          <CertificateApplication />

          {/* 3. 历史记录查询 */}
          <HistoryRecords />

          {/* 4. 统计分析 */}
          <StatisticsAnalysis />
        </Space>
      </PageContainer>
    </div>
  );
};

export default Certificates;