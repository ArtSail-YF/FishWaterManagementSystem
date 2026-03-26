import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const WaterQuality: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={4}>水质监控</Title>
      </Card>
    </PageContainer>
  );
};

export default WaterQuality;
