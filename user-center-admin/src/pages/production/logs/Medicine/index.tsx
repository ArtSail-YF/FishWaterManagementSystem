import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import MedicineAnalysis from './components/MedicineAnalysis';
import MedicineLogTable from './components/MedicineLogTable';
import MedicineStats from './components/MedicineStats';

const MedicineLogs: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer title={false}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <MedicineStats />
          <MedicineLogTable />
          <MedicineAnalysis />
        </Space>
      </PageContainer>
    </div>
  );
};

export default MedicineLogs;