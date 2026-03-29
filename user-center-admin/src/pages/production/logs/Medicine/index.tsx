import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import MedicineAnalysis from './components/MedicineAnalysis';
import MedicineLogTable from './components/MedicineLogTable';
import MedicineStats from './components/MedicineStats';

const MedicineLogs: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer 
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {/* 1. 用药核心指标 */}
          <MedicineStats />

          {/* 2. 高密度用药日志 (代填优先) */}
          <MedicineLogTable />

          {/* 3. 用药趋势与原因分析 */}
          <MedicineAnalysis />
        </Space>
      </PageContainer>
    </div>
  );
};

export default MedicineLogs;
