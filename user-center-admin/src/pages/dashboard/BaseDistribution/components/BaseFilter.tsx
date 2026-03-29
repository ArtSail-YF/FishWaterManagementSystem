import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Card, Input, List, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface BaseItem {
  id: string;
  name: string;
  location: [number, number];
  status: 'normal' | 'warning' | 'todo';
  waterQuality: {
    oxygen: number;
    temp: number;
    ph: number;
  };
}

interface BaseFilterProps {
  bases: BaseItem[];
  selectedBaseId?: string;
  onSelect: (base: BaseItem) => void;
  onSearch: (value: string) => void;
}

const BaseFilter: React.FC<BaseFilterProps> = ({
  bases,
  selectedBaseId,
  onSelect,
  onSearch,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'warning':
        return 'error';
      case 'todo':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '预警';
      case 'todo':
        return '待办';
      default:
        return '未知';
    }
  };

  return (
    <Card
      title="基地/塘口筛选"
      styles={{ body: { padding: 0 } }}
      style={{ height: 'calc(100vh - 250px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: 16 }}>
        <Input
          placeholder="搜索基地或塘口"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        <List
          dataSource={bases}
          renderItem={(item) => (
            <List.Item
              onClick={() => onSelect(item)}
              style={{
                cursor: 'pointer',
                padding: '12px 8px',
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: selectedBaseId === item.id ? '#e6f7ff' : 'transparent',
                border: selectedBaseId === item.id ? '1px solid #91d5ff' : '1px solid transparent',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text strong>{item.name}</Text>
                  <Badge status={getStatusColor(item.status)} text={getStatusText(item.status)} />
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {item.location[0].toFixed(4)}, {item.location[1].toFixed(4)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tag color="blue">溶氧: {item.waterQuality.oxygen}mg/L</Tag>
                  <Tag color="orange">水温: {item.waterQuality.temp}℃</Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default BaseFilter;
