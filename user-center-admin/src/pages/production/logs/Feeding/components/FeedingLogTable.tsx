import { PlusOutlined, UserAddOutlined, ExportOutlined, DownOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Space, Tag, Typography, Modal, message, Descriptions } from 'antd';
import React, { useState } from 'react';
import BatchFeedingModal from './BatchFeedingModal';
import dayjs from 'dayjs';
import { searchLogs } from '@/services/api/production/log';
import type { ProductionLog } from '@/types/model';
import type { FeedingFilterValues } from './FeedingFilter';

const { Text } = Typography;

interface FeedingLogTableProps {
  filters: FeedingFilterValues;
}

const FeedingLogTable: React.FC<FeedingLogTableProps> = ({ filters }) => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<ProductionLog[]>([]);

  const mapRecord = (item: any): ProductionLog => ({
    ...item,
    id: item.id,
    time: item.actionTime,
    taskId: item.taskId,
    planId: item.planId,
    baseId: item.baseId,
    targetType: item.targetType,
    targetId: item.targetId,
    logType: item.logType,
    quantity: item.quantity,
    photoUrls: item.photoUrls,
    gpsLat: item.gpsLat,
    gpsLng: item.gpsLng,
    source: item.source,
    createdBy: item.createdBy,
    actualWorkerId: item.actualWorkerId,
    isBackfilled: item.isBackfilled,
    backfillReason: item.backfillReason,
    verifyStatus: item.verifyStatus,
    createTime: item.createTime,
    updateTime: item.updateTime,
    content: '投喂 kg',
    operator: item.actualWorkerId || item.createdBy,
    status: item.verifyStatus === 'auto' ? 'normal' : item.verifyStatus === 'pending' ? 'low' : 'normal',
  });

  const handleExport = (dataList: ProductionLog[], fileName: string = '投喂记录报表') => {
    if (dataList.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    const hide = message.loading('正在准备...', 0);
    setTimeout(() => {
      hide();
      Modal.success({
        title: '导出成功',
        content: (
          <div>
            <p>已成功生成 <b>{fileName}.xlsx</b></p>
            <p>包含记录: <span className="fin-number">{dataList.length}</span> 条</p>
            <p>涉及总投喂量 <span className="fin-number" style={{ color: '#1890ff', fontWeight: 600 }}>
              {dataList.reduce((sum, item) => sum + (item.quantity || 0), 0).toFixed(2)} kg
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<ProductionLog>[] = [
    {
      title: '日志ID', dataIndex: 'id', width: 80,
      render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text>,
    },
    {
      title: '操作时间', dataIndex: 'time', valueType: 'dateTime', width: 160,
      render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text>,
    },
    {
      title: '目标对象', dataIndex: 'targetId', width: 120,
      render: (_, record) => {
        const typeMap: Record<string, string> = { pond: '塘口', cage: '网箱', vsl: '工船' };
        const typeName = typeMap[record.targetType as string] || record.targetType;
        return <Tag color="blue" style={{ borderRadius: '2px', fontSize: '11px', margin: 0 }}>{typeName}-{record.targetId}</Tag>;
      },
    },
    {
      title: '投喂量(kg)', dataIndex: 'quantity', width: 100, align: 'right',
      render: (text) => <Text className="fin-number" strong style={{ fontSize: '13px', color: '#1890ff' }}>{text}</Text>,
    },
    { title: '操作人', dataIndex: 'actualWorkerId', width: 100, render: (text) => <Text style={{ fontSize: '12px' }}>{text || '-'}</Text> },
    {
      title: '来源', dataIndex: 'source', width: 80,
      valueEnum: { app: { text: 'APP', status: 'Default' }, admin: { text: '文员代录', status: 'Processing' }, system: { text: '自动', status: 'Success' } },
    },
    {
      title: '照片', dataIndex: 'photoUrls', width: 100,
      render: (text) => {
        if (!text) return '-';
        const urls = typeof text === 'string' ? text.split(',') : Array.isArray(text) ? text : [];
        return urls.length > 0 ? <Tag color="geekblue">{urls.length} 张</Tag> : '-';
      },
    },
    {
      title: '审核状态', dataIndex: 'verifyStatus', width: 100,
      valueEnum: {
        auto: { text: '自动通过', status: 'Success' },
        pending: { text: '待审核', status: 'Warning' },
        approved: { text: '已通过', status: 'Success' },
        rejected: { text: '已驳回', status: 'Error' },
      },
    },
    { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', valueType: 'dateTime', width: 160 },
  ];

  const expandedRowRender = (record: ProductionLog) => (
    <Descriptions bordered size="small" column={3} style={{ margin: '8px 16px' }}>
      <Descriptions.Item label="任务ID">{record.taskId || '-'}</Descriptions.Item>
      <Descriptions.Item label="计划ID">{record.planId || '-'}</Descriptions.Item>
      <Descriptions.Item label="基地ID">{record.baseId || '-'}</Descriptions.Item>
      <Descriptions.Item label="目标ID">{record.targetId || '-'}</Descriptions.Item>
      <Descriptions.Item label="目标类型">
        {record.targetType === 'pond' ? '塘口' : record.targetType === 'cage' ? '网箱' : record.targetType === 'vsl' ? '工船' : record.targetType}
      </Descriptions.Item>
      <Descriptions.Item label="作业类型">{record.logType || '-'}</Descriptions.Item>
      <Descriptions.Item label="来源">
        {record.source === 'app' ? 'APP' : record.source === 'admin' ? '文员代录' : record.source === 'system' ? '自动' : record.source}
      </Descriptions.Item>
      <Descriptions.Item label="录入人ID">{record.createdBy || '-'}</Descriptions.Item>
      <Descriptions.Item label="实际执行人ID">{record.actualWorkerId || '-'}</Descriptions.Item>
      <Descriptions.Item label="是否补录">{record.isBackfilled ? '是' : '否'}</Descriptions.Item>
      <Descriptions.Item label="补录原因" span={2}>{record.backfillReason || '-'}</Descriptions.Item>
      <Descriptions.Item label="审核状态">
        {record.verifyStatus === 'auto' ? '自动通过' : record.verifyStatus === 'pending' ? '待审核' : record.verifyStatus === 'rejected' ? '已驳回' : record.verifyStatus}
      </Descriptions.Item>
      <Descriptions.Item label="GPS坐标">{record.gpsLat && record.gpsLng ? `${record.gpsLat}, ${record.gpsLng}` : '-'}</Descriptions.Item>
      <Descriptions.Item label="照片">{record.photoUrls || '-'}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{record.createTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="更新时间">{record.updateTime || '-'}</Descriptions.Item>
    </Descriptions>
  );

  return (
    <Card className="fin-card" variant="borderless" styles={{ body: { padding: '0' } }}>
      <ProTable<ProductionLog>
        columns={columns}
        rowKey="id"
        search={false}
        request={async (params) => {
          const { current, pageSize } = params;
          const res = await searchLogs({
            current: current || 1,
            pageSize: pageSize || 10,
            logType: 'feeding',
            actionTimeStart: filters.dateRange?.[0],
            actionTimeEnd: filters.dateRange?.[1],
            baseId: filters.baseId,
            source: filters.source,
            verifyStatus: filters.verifyStatus,
          });
          const pageResult = res.data as any;
          const records = pageResult?.records || [];
          const mappedData = (Array.isArray(records) ? records : []).map(mapRecord);
          return { data: mappedData, success: true, total: pageResult?.total || 0 };
        }}
        expandable={{
          expandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) => (
            <DownOutlined
              onClick={(e) => onExpand(record, e)}
              style={{
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s', cursor: 'pointer', fontSize: '12px', color: '#1890ff',
              }}
            />
          ),
        }}
        options={{ density: true, fullScreen: true, setting: true }}
        rowSelection={{ onChange: (_, selectedRows) => setSelectedRows(selectedRows) }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button type="link" icon={<ExportOutlined />} onClick={() => handleExport(selectedRowsState, 投喂批量导出_)}>
              导出报表
            </Button>
          </Space>
        )}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        size="small"
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>投喂明细流水 / FEEDING LOGS</span>}
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />} onClick={() => {}}>
            导出全部
          </Button>,
          <Button key="batch" type="primary" icon={<UserAddOutlined />} onClick={() => setBatchModalVisible(true)} style={{ borderRadius: '2px' }}>
            批量代填 (文员专用)
          </Button>,
          <Button key="add" icon={<PlusOutlined />} style={{ borderRadius: '2px' }}>
            单笔录入
          </Button>,
        ]}
      />
      <BatchFeedingModal visible={batchModalVisible} onCancel={() => setBatchModalVisible(false)} onSuccess={() => setBatchModalVisible(false)} />
    </Card>
  );
};

export default FeedingLogTable;
