import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const Page: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={4}>预警记录</Title>
      </Card>
    </PageContainer>
  );
};

export default Page;
