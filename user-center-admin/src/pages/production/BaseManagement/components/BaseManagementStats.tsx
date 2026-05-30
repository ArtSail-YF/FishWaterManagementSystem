import { Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import { AppstoreOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import React from 'react';

const { Text } = Typography;

interface StatsProps {
  data?: any[];
}

const BaseManagementStats: React.FC<StatsProps> = ({ data = [] }) => {
  // 统计各类基地数量
  const typeStats = {
    海水养殖: data.filter(item => item.greenCertification === '海水养殖' || item.type === '海水养殖').length,
    淡水养殖: data.filter(item => item.greenCertification === '淡水养殖' || item.type === '淡水养殖').length,
    特种养殖: data.filter(item => item.greenCertification === '特种养殖' || item.type === '特种养殖').length,
    综合养殖: data.filter(item => item.greenCertification === '综合养殖' || item.type === '综合养殖').length,
  };

  // 统计总面积
  const totalArea = data.reduce((sum, item) => sum + (item.totalArea || item.area || 0), 0);

  // 统计状态分布
  const statusStats = {
    active: data.filter(item => item.status === 1 || item.status === '1' || item.status === 'active').length,
    inactive: data.filter(item => item.status === 0 || item.status === '0' || item.status === 'inactive').length,
    maintenance: data.filter(item => item.status === 'maintenance').length,
  };

  // 统计负责人数量
  const uniqueManagers = new Set(data.map(item => item.contactPerson || item.manager)).size;

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>基地总数</Text>}
            value={data.length}
            suffix="个"
valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#2C2416' }}
            prefix={<AppstoreOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>总面积</Text>}
            value={totalArea}
            suffix="亩"
valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#2C2416' }}
            prefix={<EnvironmentOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>负责人数量</Text>}
            value={uniqueManagers}
            suffix="人"
valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#2C2416' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: '12px' }}>运营中</Text>}
            value={statusStats.active}
            suffix={`/ ${data.length}`}
valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#2C2416' }}
            prefix={<PhoneOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default BaseManagementStats;
