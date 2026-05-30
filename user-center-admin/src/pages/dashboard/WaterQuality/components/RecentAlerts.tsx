import { List, Badge, Tag, Typography } from 'antd';
import React from 'react';
import{ getWaterAlarmList } from'@/services/api/water';
import { type WaterAlarmLog } from '@/services/api/water';
import { useState, useEffect } from 'react';
import type { PondStatusItem } from '@/models/pond';

const { Text } = Typography;

interface RecentAlertsProps {
  pond?: PondStatusItem;
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ pond }) => {

  const [alerts, setAlerts] = useState<WaterAlarmLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
           setLoading(true);
            const req= await getWaterAlarmList();
            setAlerts(req.data);
            setLoading(false);
      } catch (error) {
        console.error('获取数据失败', error);
      }
 
    };
    fetchData();
  }, []);

  // // 模拟最近报警数据
  // const alerts = [
  //   { id: '1', time: '2026-03-27 08:30:12', metric: '溶氧', value: 4.2, threshold: 5.0, status: 'warning', handle: '已通知管理员' },
  //   { id: '2', time: '2026-03-27 10:15:45', metric: '溶氧', value: 3.8, threshold: 4.0, status: 'error', handle: '增氧机已开启' },
  //   { id: '3', time: '2026-03-26 14:20:00', metric: 'PH值', value: 8.6, threshold: 8.5, status: 'warning', handle: '已处理' },
  // ];

  return (
    <List
      header={<div style={{ fontWeight: 'bold' }}>最近报警记录</div>}
      bordered
      dataSource={pond ? alerts : []}
      locale={{ emptyText: '暂无报警记录' }}
      size="small"
      renderItem={(item) => (
        <List.Item
          style={{
            padding: '16px 12px',
            borderLeft: `4px solid ${item.status === 'error' ? '#ef4444' : '#9ca3af'}`,
            marginBottom: 12,
            borderRadius: 6,
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>{item.metric}异常: {item.value} (阈值 {item.threshold})</Text>
              <Badge status={item.status === 'error' ? 'error' : 'warning'} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
              <Tag color={item.handle === '已处理' ? 'success' : 'processing'} style={{ fontSize: 11, margin: 0 }}>
                {item.handle}
              </Tag>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default RecentAlerts;
