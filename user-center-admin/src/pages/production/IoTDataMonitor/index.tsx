import React, { useRef, useState } from 'react';
import { PageContainer, ProTable, type ActionType } from '@ant-design/pro-components';
import { Tag, Space, Card, Select, Typography, Row, Col, Statistic } from 'antd';
import { searchTsData, getLatestTsData } from '@/services/api/iot-ts-data';
import { getMetricDefList } from '@/services/api/iot-metric-def';

const { Text } = Typography;

const METRIC_LABELS: Record<string, string> = {
  temperature: '温度',
  dissolved_oxygen: '溶氧',
  ph: 'pH值',
  salinity: '盐度',
  turbidity: '浑浊度',
  ammonia: '氨氮',
};

const METRIC_UNITS: Record<string, string> = {
  temperature: '°C',
  dissolved_oxygen: 'mg/L',
  ph: '',
  salinity: 'ppt',
  turbidity: 'NTU',
  ammonia: 'mg/L',
};

const IoTDataMonitor = () => {
  const [latestData, setLatestData] = useState<any[]>([]);

  useEffect(() => {
    getMetricDefList().then(res => {
      if (res?.data) {
        const labels: Record<string, string> = {};
        const units: Record<string, string> = {};
        res.data.forEach((d: any) => {
          labels[d.metricKey] = d.displayName;
          units[d.metricKey] = d.unit || '';
        });
        if (Object.keys(labels).length > 0) {
          setMetricLabels(labels);
          setMetricUnits(units);
        }
      }
    }).catch(() => {});
    getLatestTsData().then(res => {
      if (res?.data) setLatestData(res.data);
    }).catch(() => {});
  }, []);
  const actionRef = useRef<ActionType>();
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: 150,
    },
    {
      title: '序列号',
      dataIndex: 'deviceSn',
      width: 130,
    },
    {
      title: '指标',
      dataIndex: 'metricKey',
      width: 100,
      render: (key: string) => metricLabels[key] || key,
    },
    {
      title: '数值',
      dataIndex: 'metricValue',
      width: 120,
      render: (val: number, r: any) => `${val} ${metricUnits[r.metricKey] || ''}`,
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      width: 100,
    },
    {
      title: '记录时间',
      dataIndex: 'recordTime',
      width: 170,
      valueType: 'dateTime',
    },
    {
      title: '质量',
      dataIndex: 'qualityFlag',
      width: 80,
      render: (flag: number) => (
        <Tag color={flag === 1 ? 'green' : 'red'}>{flag === 1 ? '正常' : '异常'}</Tag>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Text strong>指标筛选：</Text>
          <Select
            value={selectedMetric}
            onChange={(val) => {
              setSelectedMetric(val);
              actionRef.current?.reload();
            }}
            style={{ width: 150 }}
            options={Object.entries(METRIC_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
        </Space>
      </Card>

      <ProTable
        actionRef={actionRef}
        headerTitle="设备监测数据"
        columns={columns}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        request={async (params) => {
          const result = await searchTsData({ ...params, metricKey: selectedMetric });
          return { data: result.data, success: true, total: result.total };
        }}
        size="small"
        scroll={{ x: 1000 }}
      />
    </PageContainer>
  );
};

export default IoTDataMonitor;
