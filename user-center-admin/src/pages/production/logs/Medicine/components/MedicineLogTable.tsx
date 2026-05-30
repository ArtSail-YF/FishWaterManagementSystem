import { PlusOutlined, UserAddOutlined, ExportOutlined, DownOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Progress, Space, Tag, Typography, Modal, message, Descriptions } from 'antd';
import React, { useState } from 'react';
import BatchMedicineModal from './BatchMedicineModal';
import dayjs from 'dayjs';
import { searchLogs } from '@/services/api/production/log';
import type { ProductionLog } from '@/types/model';
import type { MedicineFilterValues } from './MedicineFilter';

const { Text } = Typography;

interface MedicineLogTableProps {
  filters: MedicineFilterValues;
}

const MedicineLogTable: React.FC<MedicineLogTableProps> = ({ filters }) => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<ProductionLog[]>([]);

  const mapRecord = (item: any): ProductionLog => ({
    ...item,
    id: item.id,
    time: item.actionTime,
    taskId: item.taskId, planId: item.planId, baseId: item.baseId,
    targetType: item.targetType, targetId: item.targetId,
    logType: item.logType, quantity: item.quantity,
    photoUrls: item.photoUrls, source: item.source,
    createdBy: item.createdBy, actualWorkerId: item.actualWorkerId,
    isBackfilled: item.isBackfilled, backfillReason: item.backfillReason,
    verifyStatus: item.verifyStatus, createTime: item.createTime, updateTime: item.updateTime,
    details: {
      medicineName: item.medicineName || item.drugName,
      dose: item.quantity,
      reason: item.reason,
      withdrawalRemaining: item.withdrawalRemaining || 0,
      withdrawalDays: item.withdrawalDays || 1,
      status: item.withdrawalStatus,
      remarks: item.remark,
    },
    unit: item.unit,
    content: 用药  ,
    operator: item.actualWorkerId || item.createdBy,
  });

  const handleExport = (dataList: ProductionLog[], fileName: string = '用药记录报表') => {
    if (dataList.length === 0) { message.warning('暂无数据可导出'); return; }
    const hide = message.loading('正在准备...', 0);
    setTimeout(() => {
      hide();
      Modal.success({
        title: '导出成功',
        content: (
          <div>
            <p>已成功生成 <b>{fileName}.xlsx</b></p>
            <p>包含记录: <span className="fin-number">{dataList.length}</span> 条</p>
            <p>涉及药物: <span style={{ color: '#722ed1', fontWeight: 600 }}>
              {Array.from(new Set(dataList.map(item => (item as any).details?.medicineName || '未知'))).join(', ')}
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<ProductionLog>[] = [
    { title: '日志ID', dataIndex: 'id', width: 80, render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text> },
    { title: '操作时间', dataIndex: 'time', valueType: 'dateTime', width: 180, render: (text) => <Text className="fin-number" style={{ fontSize: '13px' }}>{text}</Text> },
    {
      title: '目标对象', dataIndex: 'targetId', width: 120,
      render: (_, record) => {
        const typeMap: Record<string, string> = { pond: '塘口', cage: '网箱', vsl: '工船' };
        return <Tag color="blue" style={{ borderRadius: '2px', fontSize: '11px', margin: 0 }}>{typeMap[record.targetType as string] || record.targetType}-{record.targetId}</Tag>;
      },
    },
    { title: '药物名称', dataIndex: ['details', 'medicineName'], width: 120, render: (text) => <Text style={{ fontSize: '12px' }}>{text || '-'}</Text> },
    { title: '剂量', dataIndex: ['details', 'dose'], width: 100, align: 'right', render: (text: any, record) => <Text className="fin-number" strong style={{ fontSize: '13px' }}>{text}{(record as any).unit || ''}</Text> },
    {
      title: '用药原因', dataIndex: ['details', 'reason'], width: 120,
      valueEnum: {
        '预防': { text: '预防性消毒', status: 'Default' },
        '烂鳟病': { text: '烂鳟病治疗', status: 'Error' },
        '肠炎': { text: '肠炎治疗', status: 'Error' },
        '寄生虫': { text: '寄生虫治疗', status: 'Warning' },
      },
    },
    {
      title: '休药期状态', key: 'withdrawal', width: 150,
      render: (_, record) => {
        const d = (record as any).details || {};
        const remaining = d.withdrawalRemaining || 0;
        const days = d.withdrawalDays || 1;
        const pct = Math.max(0, (1 - remaining / days) * 100);
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <Text type={d.status === 'locked' ? 'danger' : 'secondary'}>{d.status === 'locked' ? '锁定中' : '安全'}</Text>
              <Text className="fin-number">剩{remaining}天</Text>
            </div>
            <Progress percent={Math.round(pct)} size="small" strokeColor={remaining > 0 ? '#faad14' : '#52c41a'} showInfo={false} />
          </Space>
        );
      },
    },
    {
      title: '审核状态', dataIndex: 'verifyStatus', width: 100,
      valueEnum: { auto: { text: '自动通过', status: 'Success' }, pending: { text: '待审核', status: 'Warning' }, rejected: { text: '已驳回', status: 'Error' } },
    },
    { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime', width: 160 },
  ];

  const expandedRowRender = (record: any) => (
    <Descriptions bordered size="small" column={3} style={{ margin: '8px 16px' }}>
      <Descriptions.Item label="日志ID">{record.id || '-'}</Descriptions.Item>
      <Descriptions.Item label="任务ID">{record.taskId || '-'}</Descriptions.Item>
      <Descriptions.Item label="计划ID">{record.planId || '-'}</Descriptions.Item>
      <Descriptions.Item label="基地ID">{record.baseId || '-'}</Descriptions.Item>
      <Descriptions.Item label="目标类型">{record.targetType === 'pond' ? '塘口' : record.targetType === 'cage' ? '网箱' : record.targetType === 'vsl' ? '工船' : record.targetType}</Descriptions.Item>
      <Descriptions.Item label="目标ID">{record.targetId || '-'}</Descriptions.Item>
      <Descriptions.Item label="药物名称">{record.details?.medicineName || '-'}</Descriptions.Item>
      <Descriptions.Item label="剂量">{record.details?.dose}{record.unit || ''}</Descriptions.Item>
      <Descriptions.Item label="用药原因">{record.details?.reason || '-'}</Descriptions.Item>
      <Descriptions.Item label="休药期">{record.details?.withdrawalRemaining || 0} 天</Descriptions.Item>
      <Descriptions.Item label="来源">{record.source === 'app' ? 'APP' : record.source === 'admin' ? '文员代录' : record.source === 'system' ? '自动' : record.source}</Descriptions.Item>
      <Descriptions.Item label="是否补录">{record.isBackfilled ? '是' : '否'}</Descriptions.Item>
      <Descriptions.Item label="补录原因" span={2}>{record.backfillReason || '-'}</Descriptions.Item>
      <Descriptions.Item label="GPS坐标">{record.gpsLat && record.gpsLng ? `${record.gpsLat}, ${record.gpsLng}` : '-'}</Descriptions.Item>
      <Descriptions.Item label="照片">{record.photoUrls || '-'}</Descriptions.Item>
      <Descriptions.Item label="备注">{record.details?.remarks || '-'}</Descriptions.Item>
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
            current: current || 1, pageSize: pageSize || 10,
            logType: 'medication',
            actionTimeStart: filters.dateRange?.[0], actionTimeEnd: filters.dateRange?.[1],
            baseId: filters.baseId, source: filters.source, verifyStatus: filters.verifyStatus,
          });
          const pageResult = res.data as any;
          const records = pageResult?.records || [];
          const mappedData = (Array.isArray(records) ? records : []).map(mapRecord);
          return { data: mappedData, success: true, total: pageResult?.total || 0 };
        }}
        expandable={{
          expandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) => (
            <DownOutlined onClick={(e) => onExpand(record, e)} style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', cursor: 'pointer', fontSize: '12px', color: '#1890ff' }} />
          ),
        }}
        options={{ density: true, fullScreen: true, setting: true }}
        rowSelection={{ onChange: (_, selectedRows) => setSelectedRows(selectedRows) }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}><span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span><a onClick={onCleanSelected}>取消选择</a></Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button type="link" icon={<ExportOutlined />} onClick={() => handleExport(selectedRowsState, 用药批量导出_)}>导出报表</Button>
          </Space>
        )}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        size="small"
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>用药明细流水 / MEDICINE LOGS</span>}
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />}>导出全部</Button>,
          <Button key="batch" type="primary" icon={<UserAddOutlined />} onClick={() => setBatchModalVisible(true)} style={{ borderRadius: '2px' }}>批量代填 (文员/技术员专用)</Button>,
          <Button key="add" icon={<PlusOutlined />} style={{ borderRadius: '2px' }}>单笔录入</Button>,
        ]}
      />
      <BatchMedicineModal visible={batchModalVisible} onCancel={() => setBatchModalVisible(false)} onSuccess={() => setBatchModalVisible(false)} />
    </Card>
  );
};

export default MedicineLogTable;
