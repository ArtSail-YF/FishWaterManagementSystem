﻿﻿﻿import { PlusOutlined, UserAddOutlined, ExportOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined, ClockCircleOutlined, EnvironmentOutlined, ClusterOutlined, MedicineBoxOutlined, TagOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Typography, Modal, message, Descriptions, Card } from 'antd';
import React, { useState } from 'react';
import BatchMedicineModal from './BatchMedicineModal';
import dayjs from 'dayjs';
import { searchMedicationRecords } from '@/services/api/medication-record';
import type { MedicationRecordModel } from '@/models/production';

const { Text } = Typography;

const VERIFY_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  auto: { label: '自动通过', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  pending: { label: '待审核', bgColor: '#F5EDD6', textColor: '#A0843A' },
  approved: { label: '已通过', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  rejected: { label: '已驳回', bgColor: '#F5E0DC', textColor: '#B54E3C' },
};

const SOURCE_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  app: { label: 'APP', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  admin: { label: '文员代录', bgColor: '#F5EDD6', textColor: '#A0843A' },
  system: { label: '自动', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
};

const METHOD_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  '泼洒': { label: '泼洒', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  '拌饵': { label: '拌饵', bgColor: '#F5EDD6', textColor: '#A0843A' },
  '浸泡': { label: '浸泡', bgColor: '#EBE5DE', textColor: '#5C4F42' },
};

const TARGET_MAP: Record<string, string> = { pond: '塘口', cage: '网箱', vsl: '工船' };

const MedicineLogTable: React.FC = () => {
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState<MedicationRecordModel[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<MedicationRecordModel | null>(null);

  const mapRecord = (item: any): any => ({
    ...item, id: item.id, time: item.actionTime,
    taskId: item.taskId, planId: item.planId, baseId: item.baseId,
    targetType: item.targetType, targetId: item.targetId,
    photoUrls: item.photoUrls, source: item.source,
    actualWorkerId: item.actualWorkerId, verifyStatus: item.verifyStatus,
    createTime: item.createTime, drugName: item.drugName,
    dosage: item.dosage, unit: item.unit, method: item.method,
    remark: item.remark, withdrawalDays: item.withdrawalDays || 0,
    baseName: item.baseName, targetName: item.targetName,
    details: {
      medicineName: item.drugName, dose: item.dosage, remarks: item.remark,
      withdrawalDays: item.withdrawalDays || 0,
      status: item.withdrawalDays > 0 ? 'locked' : 'safe',
    },
    content: item.drugName ? item.drugName + ' ' + item.dosage + item.unit : '用药',
    operator: String(item.actualWorkerId || ''),
  });

  const handleView = (record: MedicationRecordModel) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const handleExport = (dataList: any[], fileName: string = '用药记录报表') => {
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
          </div>
        ),
        okText: '好的',
      });
    }, 1200);
  };

  const columns: ProColumns<MedicationRecordModel>[] = [
    { title: 'ID', dataIndex: 'id', width: 60, hideInSearch: true,
      render: (text) => <Text className="fin-number" style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: '操作时间', dataIndex: 'time', width: 150, hideInSearch: true,
      render: (_, r) => r.time ? dayjs(r.time).format('MM-DD HH:mm') : '-',
    },
    { title: '日期范围', dataIndex: 'actionTime', valueType: 'dateRange', hideInTable: true,
      search: { transform: (value) => ({ actionTimeStart: dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss'), actionTimeEnd: dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss') }) },
    },
    {
      title: '目标对象', dataIndex: 'targetName', width: 160, hideInSearch: true,
      render: (text, record) => {
        const typeName = TARGET_MAP[record.targetType as string] || record.targetType;
        const name = text || (record.targetId ? typeName + '-' + record.targetId : '-');
        return <Tag style={{ backgroundColor: '#E1EEF4', color: '#2B6B8A', border: 'none', borderRadius: '2px', fontSize: '11px', margin: 0 }}>{name}</Tag>;
      },
    },
    { title: '药物名称', dataIndex: 'drugName', width: 120, hideInSearch: true },
    { title: '用量', dataIndex: 'dosage', width: 100, align: 'right', hideInSearch: true,
      render: (text, record) => <Text className="fin-number" strong>{text}{record.unit || ''}</Text> },
    {
      title: '用药方式', dataIndex: 'method', width: 100, hideInSearch: true,
      render: (_, r) => {
        const c = METHOD_MAP[r.method as string];
        return c ? <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none', fontSize: '11px' }}>{c.label}</Tag> : (r.method || '-');
      },
    },
    {
      title: '休药期', dataIndex: 'withdrawalDays', width: 80, hideInSearch: true,
      render: (text) => {
        const days = text || 0;
        return days > 0
          ? <Tag style={{ backgroundColor: '#F5EDD6', color: '#A0843A', border: 'none', fontSize: '11px' }}>{days}天</Tag>
          : <Tag style={{ backgroundColor: '#E2EDD8', color: '#5B8C5A', border: 'none', fontSize: '11px' }}>无</Tag>;
      },
    },
    {
      title: '来源', dataIndex: 'source', width: 100, hideInSearch: true,
      render: (_, r) => {
        const c = SOURCE_MAP[r.source as string];
        return c ? <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none', fontSize: '11px' }}>{c.label}</Tag> : (r.source || '-');
      },
    },
    {
      title: '审核状态', dataIndex: 'verifyStatus', width: 100, hideInSearch: true,
      render: (_, r) => {
        const c = VERIFY_MAP[r.verifyStatus as string];
        return c ? <Tag style={{ backgroundColor: c.bgColor, color: c.textColor, border: 'none', fontSize: '11px' }}>{c.label}</Tag> : (r.verifyStatus || '-');
      },
    },
    { title: '创建时间', dataIndex: 'createTime', width: 150, hideInSearch: true,
      render: (_, r) => r.createTime ? dayjs(r.createTime).format('MM-DD HH:mm') : '-',
    },
    {
      title: '操作', valueType: 'option', fixed: 'right', width: 200,
      render: (_, record) => [
        <Button key="view" type="link" size="small" icon={<EyeOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => handleView(record)}>查看</Button>,
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => message.info('编辑用药记录: ' + record.id)}>编辑</Button>,
        <Button key="delete" type="link" size="small" icon={<DeleteOutlined />} style={{ color: '#8c8c8c' }}
          onClick={() => {
            Modal.confirm({ title: '删除确认', content: '确定要删除该记录吗？', onOk: async () => { message.success('删除成功'); } });
          }}>删除</Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<MedicationRecordModel>
        columns={columns}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const { current, pageSize, actionTimeStart, actionTimeEnd, ...rest } = params;
          const apiParams: any = { current: current || 1, pageSize: pageSize || 10 };
          if (actionTimeStart) apiParams.actionTimeStart = actionTimeStart;
          if (actionTimeEnd) apiParams.actionTimeEnd = actionTimeEnd;
          const res = await searchMedicationRecords(apiParams);
          const records = res.data || [];
          const mappedData = (Array.isArray(records) ? records : []).map(mapRecord);
          return { data: mappedData, success: true, total: res.total || 0 };
        }}
        options={{ density: true, fullScreen: true, setting: true }}
        rowSelection={{ onChange: (_, selectedRows) => setSelectedRows(selectedRows) }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}><span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span><a onClick={onCleanSelected}>取消选择</a></Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button type="link" icon={<ExportOutlined />} style={{ color: '#8c8c8c' }} onClick={() => handleExport(selectedRowsState)}>导出报表</Button>
          </Space>
        )}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        size="small"
        scroll={{ x: 1200 }}
        headerTitle={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>用药明细流水 / MEDICINE LOGS</span>}
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />} style={{ color: '#8c8c8c', borderColor: '#d9d9d9' }}>导出全部</Button>,
          <Button key="batch" type="primary" icon={<UserAddOutlined />} onClick={() => setBatchModalVisible(true)}>批量代填 (文员/技术员专用)</Button>,
          <Button key="add" icon={<PlusOutlined />}>单笔录入</Button>,
        ]}
      />
      <BatchMedicineModal visible={batchModalVisible} onCancel={() => setBatchModalVisible(false)} onSuccess={() => setBatchModalVisible(false)} />
      <Modal title="用药记录详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700} destroyOnClose>
        <Card size="small" style={{ marginBottom: 16, background: '#F7F3EF' }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<><MedicineBoxOutlined style={{ marginRight: 4 }} />记录摘要</>}>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>{detailRecord?.content || '用药记录 #' + detailRecord?.id}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label={<><FileTextOutlined style={{ marginRight: 4 }} />记录ID</>}>{detailRecord?.id || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><ClockCircleOutlined style={{ marginRight: 4 }} />操作时间</>}>{detailRecord?.time ? dayjs(detailRecord.time).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label="任务ID">{detailRecord?.taskId || '-'}</Descriptions.Item>
          <Descriptions.Item label="计划ID">{detailRecord?.planId || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined style={{ marginRight: 4 }} />基地</>}>{detailRecord?.baseName || detailRecord?.baseId || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><ClusterOutlined style={{ marginRight: 4 }} />目标对象</>}>
            {detailRecord ? (() => {
              const typeName = TARGET_MAP[detailRecord.targetType as string] || detailRecord.targetType;
              return detailRecord.targetName || (detailRecord.targetId ? typeName + '-' + detailRecord.targetId : '-');
            })() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<><MedicineBoxOutlined style={{ marginRight: 4 }} />药物名称</>}>{detailRecord?.drugName || '-'}</Descriptions.Item>
          <Descriptions.Item label={<><TagOutlined style={{ marginRight: 4 }} />用量</>}>
            <Text className="fin-number" strong>{detailRecord?.dosage}{detailRecord?.unit || ''}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="用药方式">
            {detailRecord ? (METHOD_MAP[detailRecord.method as string]?.label || detailRecord.method || '-') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="休药期">
            {detailRecord?.withdrawalDays ? <Tag style={{ backgroundColor: '#F5EDD6', color: '#A0843A', border: 'none' }}>{detailRecord.withdrawalDays} 天</Tag> : <Tag style={{ backgroundColor: '#E2EDD8', color: '#5B8C5A', border: 'none' }}>无</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined style={{ marginRight: 4 }} />操作人</>}>{detailRecord?.actualWorkerId || '-'}</Descriptions.Item>
          <Descriptions.Item label="来源">{detailRecord ? (SOURCE_MAP[detailRecord.source as string]?.label || detailRecord.source || '-') : '-'}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            {detailRecord ? <Tag style={{ backgroundColor: (VERIFY_MAP[detailRecord.verifyStatus as string]?.bgColor || '#f0f0f0'), color: (VERIFY_MAP[detailRecord.verifyStatus as string]?.textColor || '#666'), border: 'none' }}>{VERIFY_MAP[detailRecord.verifyStatus as string]?.label || detailRecord.verifyStatus}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<><DatabaseOutlined style={{ marginRight: 4 }} />创建时间</>}>{detailRecord?.createTime ? dayjs(detailRecord.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
};

export default MedicineLogTable;
