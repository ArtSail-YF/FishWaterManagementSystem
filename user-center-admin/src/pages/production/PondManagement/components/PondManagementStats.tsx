import { Card, Col, Row, Statistic, Progress } from 'antd';
import { AppstoreOutlined, VideoCameraOutlined, ApiOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import React from 'react';

const PondManagementStats: React.FC = () => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="管理塘口总数"
            value={12}
            suffix="个"
            valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            prefix={<AppstoreOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span>已启用: 10</span>
            <span style={{ marginLeft: 12 }}>规划中: 2</span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="水产养殖总面积"
            value={85.5}
            suffix="亩"
            precision={1}
            valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            prefix={<DeploymentUnitOutlined />}
          />
          <div style={{ marginTop: 8 }}>
            <Progress percent={75} size="small" strokeColor="#52c41a" showInfo={false} />
            <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
              <span>利用率</span>
              <span>75%</span>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="监控在线率"
            value={92.5}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            prefix={<VideoCameraOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span style={{ color: '#52c41a' }}>● 在线: 11</span>
            <span style={{ marginLeft: 12, color: '#ff4d4f' }}>● 异常: 1</span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="IoT 设备覆盖"
            value={85}
            suffix="%"
            valueStyle={{ color: '#722ed1', fontFamily: 'AlibabaSans' }}
            prefix={<ApiOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span>关联传感器: 32个</span>
            <span style={{ marginLeft: 12 }}>覆盖塘口: 9个</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PondManagementStats;
