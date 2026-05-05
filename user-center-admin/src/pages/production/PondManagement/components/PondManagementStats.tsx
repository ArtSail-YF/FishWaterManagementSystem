import { Card, Col, Row, Statistic, Progress, Tag } from 'antd';
import { AppstoreOutlined, VideoCameraOutlined, ApiOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import React from 'react';

interface StatsProps {
  data?: any[];
}

const PondManagementStats: React.FC<StatsProps> = ({ data = [] }) => {
  // 统计各类设施数量
  const categoryStats = {
    pond: data.filter(item => item.category === 'pond').length,
    cage: data.filter(item => item.category === 'cage').length,
    workboat: data.filter(item => item.category === 'workboat').length,
  };

  // 统计各类设施总面积/容量
  const totalArea = data.reduce((sum, item) => {
    if (item.category === 'pond') return sum + (item.area || 0);
    if (item.category === 'cage') return sum + (item.capacity || 0);
    if (item.category === 'workboat') return sum + (item.tonnage || 0);
    return sum;
  }, 0);

  // 统计在线设备数量
  const onlineCount = data.filter(item => item.videoStatus === 'online').length;
  const onlineRate = data.length > 0 ? (onlineCount / data.length) * 100 : 0;

  // 统计传感器总数
  const totalSensors = data.reduce((sum, item) => sum + (item.sensorCount || 0), 0);

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="管理设施总数"
            value={data.length}
            suffix="个"
            valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            prefix={<AppstoreOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <Tag color="blue" size="small">塘口: {categoryStats.pond}</Tag>
            <Tag color="green" size="small">网箱: {categoryStats.cage}</Tag>
            <Tag color="orange" size="small">工船: {categoryStats.workboat}</Tag>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="养殖规模总量"
            value={totalArea}
            suffix={data.some(item => item.category === 'pond') ? '亩' : '单位'}
            precision={1}
            valueStyle={{ color: '#52c41a', fontFamily: 'AlibabaSans' }}
            prefix={<DeploymentUnitOutlined />}
          />
          <div style={{ marginTop: 8 }}>
            <Progress percent={Math.min(onlineRate, 100)} size="small" strokeColor="#52c41a" showInfo={false} />
            <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
              <span>设备在线率</span>
              <span>{onlineRate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="监控在线率"
            value={onlineRate}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            prefix={<VideoCameraOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span style={{ color: '#52c41a' }}>● 在线: {onlineCount}</span>
            <span style={{ marginLeft: 12, color: '#ff4d4f' }}>● 异常: {data.length - onlineCount}</span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
          <Statistic
            title="IoT 设备覆盖"
            value={totalSensors}
            suffix="个"
            valueStyle={{ color: '#722ed1', fontFamily: 'AlibabaSans' }}
            prefix={<ApiOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
            <span>传感器总数: {totalSensors}个</span>
            <span style={{ marginLeft: 12 }}>覆盖设施: {data.length}个</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PondManagementStats;
