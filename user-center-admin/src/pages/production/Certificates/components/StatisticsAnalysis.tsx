import { Card, Space, Row, Col, Statistic, Typography, Progress, Tag, message } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { getCertificateStats } from '@/services/api/certificate';

const { Text } = Typography;

interface StatData {
  total: number;
  validCount: number;
  expiredCount: number;
  usedCount: number;
  strategyCount: number;
}

const StatisticsAnalysis: React.FC = () => {
  const [stats, setStats] = useState<StatData>({
    total: 0,
    validCount: 0,
    expiredCount: 0,
    usedCount: 0,
    strategyCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCertificateStats();
      if (res?.code === 200 && res?.data) {
        setStats(res.data as unknown as StatData);
      }
    } catch (e: any) {
      message.error('获取统计数据失败: ' + (e?.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const validPercent = stats.total > 0 ? Math.round((stats.validCount / stats.total) * 100) : 0;
  const expiredPercent = stats.total > 0 ? Math.round((stats.expiredCount / stats.total) * 100) : 0;

  return (
    <Card
      className="fin-card"
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>统计分析 / STATISTICS ANALYSIS</span>}
      variant="borderless"
      loading={loading}
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
            value={stats.validCount}
            prefix="✅"
            suffix="张"
            valueStyle={{ color: '#8C7C6E' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="已过期"
            value={stats.expiredCount}
            prefix="⏰"
            suffix="张"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="策略类型数"
            value={stats.strategyCount}
            prefix="📋"
            suffix="种"
          />
        </Col>
      </Row>

      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>有效率</Text>
            <Text>{validPercent}%</Text>
          </div>
          <Progress percent={validPercent} status="active" />
        </div>

        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>合格证状态分布</Text>
              <Space direction="vertical" size={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>有效</Text>
                  <Tag color="green">{validPercent}%</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>已过期</Text>
                  <Tag color="red">{expiredPercent}%</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>已使用</Text>
                  <Tag color="blue">{stats.total > 0 ? Math.round((stats.usedCount / stats.total) * 100) : 0}%</Tag>
                </div>
              </Space>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>策略类型数量</Text>
              <Tag color="green" style={{ fontSize: 24, padding: '8px 16px' }}>{stats.strategyCount}</Tag>
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>种合格证策略配置</Text>
            </div>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default StatisticsAnalysis;
