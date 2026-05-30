import { Card, Col, List, Progress, Row, Space, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

const { Text } = Typography;

const RiskDashboard: React.FC = () => {
  const assetOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}M ({d}%)' },
    legend: { bottom: '0', left: 'center', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
    series: [
      {
        name: '受灾资产分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: '12', fontWeight: 'bold' } },
        data: [
          { value: 18.5, name: '鲍鱼 (舟山)' },
          { value: 12.2, name: '对虾 (宁波)' },
          { value: 8.5, name: '大黄鱼 (宁德)' },
          { value: 6.6, name: '海带 (福州)' },
        ],
        itemStyle: {
          color: (params: any) => {
            const colors = ['#cf1322', '#f5222d', '#ef4444', '#ffa39e'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  const highRiskBases = [
    { name: '舟山1号基地', risk: '极高', progress: 85, assets: '¥18.5M' },
    { name: '宁波象山基地', risk: '高', progress: 70, assets: '¥12.2M' },
    { name: '宁德三沙基地', risk: '高', progress: 45, assets: '¥8.5M' },
    { name: '福州连江基地', risk: '中', progress: 95, assets: '¥6.6M' },
  ];

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>受影响基地风险评估 / RISK ASSESSMENT</span>}
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
    >
      <Row gutter={24}>
        <Col span={10} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>受灾资产构成分布 (总额 ¥45.8M)</Text>
          </div>
          <ReactECharts option={assetOption} style={{ height: '220px' }} />
        </Col>

        <Col span={14}>
          <List
            dataSource={highRiskBases}
            header={<div style={{ fontSize: '12px', fontWeight: 'bold' }}>高风险基地清单 (按严重程度排序)</div>}
            renderItem={(item) => (
              <List.Item style={{ padding: '12px 0' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Space size={4}>
                      <Tag color={item.risk === '极高' ? 'error' : item.risk === '高' ? 'warning' : 'blue'} style={{ borderRadius: '2px', fontSize: '10px' }}>
                        {item.risk}风险
                      </Tag>
                      <Text strong style={{ fontSize: '13px' }}>{item.name}</Text>
                    </Space>
                    <Text className="fin-number" style={{ fontSize: '13px', color: '#cf1322' }}>{item.assets}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Progress 
                      percent={item.progress} 
                      size="small" 
                      status={item.progress < 50 ? 'exception' : 'active'}
                      strokeColor={item.progress < 50 ? '#ef4444' : '#6b7280'}
                      showInfo={false}
                    />
                    <Text type="secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>防灾进度 {item.progress}%</Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default RiskDashboard;
