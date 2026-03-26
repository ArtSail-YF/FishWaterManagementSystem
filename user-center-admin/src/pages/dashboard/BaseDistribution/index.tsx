import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const BaseDistribution: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={4}>基地分布</Title>
      </Card>
    </PageContainer>
  );
};

export default BaseDistribution;
