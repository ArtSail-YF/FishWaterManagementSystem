import React, { useState, useRef, useEffect } from 'react';
import { ProTable, type ProColumns, type ActionType } from '@ant-design/pro-components';
import { Tag, Space, Typography, Select } from 'antd';
import { getCommandLogs, searchIotDevices } from '@/services/api/iot';

const { Text } = Typography;

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  SENT: { label: '已发送', color: 'processing' },
  SUCCESS: { label: '执行成功', color: 'success' },
  FAILED: { label: '执行失败', color: 'error' },
  TIMEOUT: { label: '超时', color: 'warning' },
};

const CommandLogsTab = () => {
  const actionRef = useRef<ActionType>(null);
  const [deviceList, setDeviceList] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(undefined);

  useEffect(() => {
    searchIotDevices({ page: 1, pageSize: 999 }).then((res: any) => {
      if (res.data) setDeviceList(res.data.list || []);
    });
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: 140,
      render: (_, record) => {
        const device = deviceList.find(d => d.id === record.deviceId);
        return device?.deviceName || `设备#${record.deviceId}`;
      },
    },
    {
      title: '指令',
      dataIndex: 'commandKey',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: string) => {
        const cfg = STATUS_MAP[s] || { label: s, color: 'default' };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '发送时间',
      dataIndex: 'triggerTime',
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '设备回复时间',
      dataIndex: 'responseTime',
      width: 160,
      valueType: 'dateTime',
      render: (t: any) => t || <Text type="secondary">-</Text>,
    },
    {
      title: '返回数据',
      dataIndex: 'responseData',
      width: 160,
      ellipsis: true,
      render: (t: any) => t || <Text type="secondary">-</Text>,
    },
    {
      title: '错误信息',
      dataIndex: 'errorMsg',
      width: 160,
      ellipsis: true,
      render: (t: any) => t ? <Text type="danger">{t}</Text> : <Text type="secondary">-</Text>,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span style={{ fontWeight: 500, fontSize: 13 }}>选择设备：</span>
          <Select
            placeholder="请选择设备"
            allowClear
            showSearch
            style={{ width: 260 }}
            value={selectedDeviceId}
            onChange={(val) => {
              setSelectedDeviceId(val);
              setTimeout(() => actionRef.current?.reload(), 0);
            }}
            optionFilterProp="label"
            options={deviceList.map(d => ({
              label: `${d.deviceName} (${d.deviceSn})`,
              value: d.id,
            }))}
          />
        </Space>
      </div>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async () => {
          if (!selectedDeviceId) {
            return { data: [], success: true, total: 0 };
          }
          const res: any = await getCommandLogs(selectedDeviceId);
          const list = res.data || [];
          return { data: list, success: true, total: list.length };
        }}
        search={false}
        pagination={{ pageSize: 20 }}
        size="small"
        scroll={{ x: 1000 }}
      />
    </>
  );
};

export default CommandLogsTab;
