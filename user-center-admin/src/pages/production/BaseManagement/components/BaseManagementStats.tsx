import { Card, Col, Row, Statistic, Tag } from 'antd';
import { AppstoreOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import React from 'react';

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
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="基地总数"
            value={data.length}
            suffix="个"
            valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            prefix={<AppstoreOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <Tag color="blue" size="small">海水养殖: {typeStats.海水养殖}</Tag>
            <Tag color="green" size="small">淡水养殖: {typeStats.淡水养殖}</Tag>
            <Tag color="orange" size="small">特种养殖: {typeStats.特种养殖}</Tag>
            <Tag color="purple" size="small">综合养殖: {typeStats.综合养殖}</Tag>
          </div>
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="总面积"
            value={totalArea}
            suffix="亩"
            valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            prefix={<EnvironmentOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            平均面积: {data.length > 0 ? (totalArea / data.length).toFixed(1) : 0}亩
          </div>
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="负责人数量"
            value={uniqueManagers}
            suffix="人"
            valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            prefix={<UserOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            平均管理: {data.length > 0 ? (data.length / uniqueManagers).toFixed(1) : 0}个/人
          </div>
        </Card>
      </Col>
      
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="基地状态"
            value={statusStats.active}
            suffix={`/ ${data.length}`}
            valueStyle={{ color: statusStats.active > 0 ? '#52c41a' : '#d9d9d9', fontFamily: 'AlibabaSans' }}
            prefix={<PhoneOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <Tag color="green" size="small">运营中: {statusStats.active}</Tag>
            <Tag color="red" size="small">停用: {statusStats.inactive}</Tag>
            <Tag color="orange" size="small">维护中: {statusStats.maintenance}</Tag>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default BaseManagementStats;