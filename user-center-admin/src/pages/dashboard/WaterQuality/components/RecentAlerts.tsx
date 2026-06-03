import { List, Tag, Typography, Spin, Empty } from 'antd';
import React from 'react';
import { getWaterAlarmList } from '@/services/api/iot-alert';
import { useState, useEffect } from 'react';
import type { PondStatusItem } from '@/models/pond';

const { Text } = Typography;

interface RecentAlertsProps {
  pond?: PondStatusItem;
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ pond }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const req = await getWaterAlarmList();
        setAlerts(req?.data || []);
      } catch (error) {
        console.error('获取数据失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const levelColor: Record<string, string> = {
    HIGH: '#ef4444',
    MEDIUM: '#fa8c16',
    LOW: '#9ca3af',
  };

  const levelLabel: Record<string, string> = {
    HIGH: '严重',
    MEDIUM: '中等',
    LOW: '轻微',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>;

  const displayData = pond ? alerts : [];

  return (
    <List
      header={<div style={{ fontWeight: 'bold' }}>最近报警记录</div>}
      bordered
      dataSource={displayData}
      locale={{ emptyText: <Empty description="暂无报警记录" /> }}
      size="small"
      renderItem={(item: any) => (
        <List.Item
          style={{
            padding: '12px',
            borderLeft: `4px solid ${levelColor[item.level] || '#9ca3af'}`,
            marginBottom: 8,
            borderRadius: 4,
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text strong style={{ fontSize: 13 }}>{item.content || item.title || '告警'}</Text>
              <Tag color={levelColor[item.level] || 'default'} style={{ fontSize: 10 }}>
                {levelLabel[item.level] || item.level}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 11 }}>{item.time || item.triggerTime || ''}</Text>
          </div>
        </List.Item>
      )}
    />
  );
};

export default RecentAlerts;
