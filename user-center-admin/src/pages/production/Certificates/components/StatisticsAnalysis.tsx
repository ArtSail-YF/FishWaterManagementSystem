import { Card, Space, Row, Col, Statistic, Typography, Progress, Tag } from 'antd';
import React, { useState, useEffect } from 'react';

const { Title, Text } = Typography;

interface StatData {
  total: number;
  valid: number;
  expired: number;
  typeA: number;
  typeB: number;
  complianceRate: number;
  riskPonds: number;
  totalPonds: number;
}

const StatisticsAnalysis: React.FC = () => {
  const [stats, setStats] = useState<StatData>({
    total: 0,
    valid: 0,
    expired: 0,
    typeA: 0,
    typeB: 0,
    complianceRate: 0,
    riskPonds: 0,
    totalPonds: 0,
  });

  useEffect(() => {
    // 模拟获取统计数据
    setTimeout(() => {
      setStats({
        total: 12,
        valid: 10,
        expired: 2,
        typeA: 8,
        typeB: 4,
        complianceRate: 85,
        riskPonds: 2,
        totalPonds: 18,
      });
    }, 500);
  }, []);

  return (
    <Card 
      className="fin-card" 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>统计分析 / STATISTICS ANALYSIS</span>}
      variant="borderless"
    >
      <Row gutter={16}>
        <Col span={6}>
          <Statistic 
            title="总合格证数" 
            value={stats.total} 
            prefix="📄"
            suffix="张"
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="有效合格证" 
            value={stats.valid} 
            prefix="✅"
            suffix="张"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="A类合格证" 
            value={stats.typeA} 
            prefix="📊"
            suffix="张"
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="B类合格证" 
            value={stats.typeB} 
            prefix="🧪"
            suffix="张"
          />
        </Col>
      </Row>

      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>合规率</Text>
            <Text>{stats.complianceRate}%</Text>
          </div>
          <Progress percent={stats.complianceRate} status="active" />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>风险塘口比例</Text>
            <Text>{stats.riskPonds}/{stats.totalPonds}</Text>
          </div>
          <Progress 
            percent={(stats.riskPonds / stats.totalPonds) * 100} 
            status="warning" 
            strokeColor="#faad14"
          />
        </div>

        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>合格证类型分布</Text>
              <Space direction="vertical" size={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>A类（质量控制）</Text>
                  <Tag color="green">{Math.round((stats.typeA / stats.total) * 100)}%</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>B类（检测合格）</Text>
                  <Tag color="blue">{Math.round((stats.typeB / stats.total) * 100)}%</Tag>
                </div>
              </Space>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>合格证状态分布</Text>
              <Space direction="vertical" size={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>有效</Text>
                  <Tag color="green">{Math.round((stats.valid / stats.total) * 100)}%</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>已过期</Text>
                  <Tag color="red">{Math.round((stats.expired / stats.total) * 100)}%</Tag>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default StatisticsAnalysis;