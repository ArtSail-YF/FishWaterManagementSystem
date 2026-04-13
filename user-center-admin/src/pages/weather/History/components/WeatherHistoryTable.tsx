import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Card, Space, Tag, Typography, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { getWeatherHistory, type WeatherHistoryItem } from '@/services/api/weather';
import { MOCK_WEATHER_HISTORY } from '@/services/ant-design-pro/mock';

const { Text } = Typography;

const WeatherHistoryTable: React.FC = () => {
  const [data, setData] = useState<WeatherHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeatherHistory()
      .then(res => {
        setData(res.data || []);
      })
      .catch(() => {
        console.error('获取气象历史失败，使用降级数据');
        setData(MOCK_WEATHER_HISTORY as any);
        message.warning('当前展示为气象历史模拟数据');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const columns: ProColumns<WeatherHistoryItem>[] = [
    {
      title: '采集时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      width: 160,
      render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text>,
    },
    {
      title: '监测基地',
      dataIndex: 'base',
      width: 120,
      valueEnum: {
        hz: { text: '杭州基地' },
        zs: { text: '舟山基地' },
        nb: { text: '宁波基地' },
        wz: { text: '温州基地' },
      },
    },
    {
      title: '天气现象',
      dataIndex: 'weather',
      width: 100,
      render: (text) => (
        <Space size={4}>
          <Text style={{ fontSize: '12px' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '平均气温',
      dataIndex: 'avgTemp',
      width: 100,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number" style={{ 
          color: text > 30 ? '#cf1322' : text < 15 ? '#3f8600' : '#262626',
          fontWeight: 'bold'
        }}>
          {text}°C
        </Text>
      ),
    },
    {
      title: '最大风力',
      dataIndex: 'maxWind',
      width: 100,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number" style={{ color: text > 8 ? '#cf1322' : '#262626' }}>
          {text}级
        </Text>
      ),
    },
    {
      title: '总降水量',
      dataIndex: 'totalRain',
      width: 100,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number">{text}mm</Text>
      ),
    },
    {
      title: '平均气压',
      dataIndex: 'avgPressure',
      width: 110,
      align: 'right',
      render: (text: any) => (
        <Text className="fin-number">{text}hPa</Text>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'status',
      width: 100,
      render: (text: any) => (
        <Tag color={text === 'extreme' ? 'error' : 'success'} style={{ borderRadius: '2px', fontSize: '11px', margin: 0 }}>
          {text === 'extreme' ? '极端天气' : '常规气象'}
        </Tag>
      ),
    },
  ];

  const mockData: WeatherHistoryItem[] = [
    { id: '1', time: '2026-03-27 08:00:00', base: 'hz', weather: '晴', avgTemp: 26.4, maxWind: 3, totalRain: 0, avgPressure: 1012, status: 'normal' },
    { id: '2', time: '2026-03-27 07:00:00', base: 'zs', weather: '多云', avgTemp: 22.1, maxWind: 5, totalRain: 0.5, avgPressure: 1010, status: 'normal' },
    { id: '3', time: '2026-03-26 23:00:00', base: 'nb', weather: '大暴雨', avgTemp: 18.5, maxWind: 10, totalRain: 85.2, avgPressure: 995, status: 'extreme' },
    { id: '4', time: '2026-03-26 22:00:00', base: 'wz', weather: '暴雨', avgTemp: 20.2, maxWind: 9, totalRain: 42.1, avgPressure: 998, status: 'extreme' },
    { id: '5', time: '2026-03-26 12:00:00', base: 'hz', weather: '晴', avgTemp: 32.4, maxWind: 2, totalRain: 0, avgPressure: 1008, status: 'extreme' },
  ];

  return (
    <Card 
      className="fin-card" 
      variant="borderless" 
      styles={{ body: { padding: '0' } }}
    >
      <ProTable<WeatherHistoryItem>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        size="small"
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>历史气象明细清单 / DATA LIST</span>}
      />
    </Card>
  );
};

export default WeatherHistoryTable;
