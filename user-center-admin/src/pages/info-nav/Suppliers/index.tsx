import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const Page: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={4}>供应商名</Title>
      </Card>
    </PageContainer>
  );
};

export default Page;
