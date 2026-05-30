import { Alert, Button, Card, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const EmergencyPanel: React.FC = () => {
  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold', color: '#cf1322' }}>🚨 极端天气预警与联动 / EMERGENCY</span>}
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Alert
          message={<span style={{ fontWeight: 'bold', fontSize: '14px' }}>台风红色预警！预计 24 小时内影响我区</span>}
          description={
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '13px', color: '#cf1322', marginBottom: '12px' }}>
                ⚠️ 请立即撤离人员上岸，加固渔排设施，提前降低池塘水位。
              </div>
              <Space split={<div style={{ height: '14px', width: '1px', backgroundColor: '#ffa39e' }} />}>
                <Button type="primary" danger size="small" style={{ borderRadius: '2px' }}>一键导航至避风港</Button>
                <Button size="small" style={{ borderRadius: '2px' }}>查看撤离点分布</Button>
                <Button size="small" style={{ borderRadius: '2px' }}>联系渔政支援</Button>
              </Space>
            </div>
          }
          type="error"
          showIcon
          style={{ border: '1px solid #ffa39e', borderRadius: '4px' }}
        />

        <div style={{ backgroundColor: '#fffbe6', padding: '12px', border: '1px solid #ffe58f', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '13px' }}>管理者闭环确认</Text>
            <Tag color="warning">待确认 12 户</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#856404', marginBottom: '12px' }}>
            系统已自动通过短信和 APP 强提醒推送至 45 户养殖户。
          </div>
          <Button block type="primary" style={{ backgroundColor: '#9ca3af', border: 'none', borderRadius: '2px' }}>
            查看养殖户收悉状态
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default EmergencyPanel;
