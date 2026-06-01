import React, { useRef } from 'react';
import { PageContainer, ProTable, type ActionType } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { searchMaintenance, deleteMaintenance } from '@/services/api/iot-maintenance';

const MAINT_TYPE_MAP: Record<string, string> = {
  CALIBRATE: '校准',
  REPAIR: '维修',
  INSPECT: '巡检',
  UPGRADE: '升级',
};

const IoTMaintenance = () => {
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: '维护类型',
      dataIndex: 'maintType',
      width: 120,
      render: (t: string) => (
        <Tag>{MAINT_TYPE_MAP[t] || t}</Tag>
      ),
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      width: 100,
    },
    {
      title: '维护前状态',
      dataIndex: 'beforeValue',
      width: 150,
      ellipsis: true,
      render: (v: any) => v || '-',
    },
    {
      title: '维护后状态',
      dataIndex: 'afterValue',
      width: 150,
      ellipsis: true,
      render: (v: any) => v || '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      ellipsis: true,
      render: (v: any) => v || '-',
    },
    {
      title: '维护时间',
      dataIndex: 'maintTime',
      width: 170,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确认删除该维护记录？',
              onOk: async () => {
                await deleteMaintenance(record.id);
                message.success('已删除');
                actionRef.current?.reload();
              },
            });
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        headerTitle="设备维护记录"
        columns={columns}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        request={async (params) => {
          const result = await searchMaintenance(params);
          return { data: result.data, success: true, total: result.total };
        }}
        size="small"
        scroll={{ x: 1100 }}
      />
    </PageContainer>
  );
};

export default IoTMaintenance;
