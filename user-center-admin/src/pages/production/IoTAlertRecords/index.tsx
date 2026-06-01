import React, { useRef } from 'react';
import { PageContainer, ProTable, type ActionType } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Typography, Descriptions } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { searchAlerts, handleAlert, deleteAlert } from '@/services/api/iot-alert';

const { TextArea } = Typography;

const SEVERITY_MAP: Record<string, { label: string; color: string }> = {
  HIGH: { label: '高', color: 'red' },
  MEDIUM: { label: '中', color: 'orange' },
  LOW: { label: '低', color: 'blue' },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  UNHANDLED: { label: '未处理', color: 'red' },
  HANDLED: { label: '已处理', color: 'green' },
};

const IoTAlertRecords = () => {
  const actionRef = useRef<ActionType>();

  const handleProcess = (id: number) => {
    Modal.confirm({
      title: '确认处理',
      content: '确认已处理该告警？',
      onOk: async () => {
        await handleAlert(id, {});
        message.success('已处理');
        actionRef.current?.reload();
      },
    });
  };

  const columns = [
    {
      title: '告警编号',
      dataIndex: 'alertNo',
      width: 160,
    },
    {
      title: '告警标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'alertType',
      width: 120,
    },
    {
      title: '严重级别',
      dataIndex: 'severity',
      width: 100,
      render: (s: string) => {
        const m = SEVERITY_MAP[s];
        return m ? <Tag color={m.color}>{m.label}</Tag> : s;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => {
        const m = STATUS_MAP[s];
        return m ? <Tag color={m.color}>{m.label}</Tag> : s;
      },
    },
    {
      title: '触发时间',
      dataIndex: 'triggerTime',
      width: 170,
      valueType: 'dateTime',
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
      width: 170,
      valueType: 'dateTime',
      render: (t: any) => t || '-',
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      render: (_: any, record: any) => [
        record.status === 'UNHANDLED' && (
          <Button
            key="handle"
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleProcess(record.id)}
            style={{ color: '#52c41a' }}
          >
            处理
          </Button>
        ),
        <Button
          key="delete"
          type="link"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确认删除该告警记录？',
              onOk: async () => {
                await deleteAlert(record.id);
                message.success('已删除');
                actionRef.current?.reload();
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        headerTitle="IoT 告警记录"
        columns={columns}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        request={async (params) => {
          const result = await searchAlerts(params);
          return { data: result.data, success: true, total: result.total };
        }}
        size="small"
        scroll={{ x: 1300 }}
      />
    </PageContainer>
  );
};

export default IoTAlertRecords;
