import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Form, Input, Select, Checkbox, Space, Divider, Alert, message, Table, TimePicker, Button, InputNumber } from 'antd';
import { CheckCircleOutlined, PlusOutlined, DeleteOutlined, FlagOutlined } from '@ant-design/icons';
import { publishPlan, getTaskTemplates } from '@/services/api/production/plan';
import { getEmployeesByBase } from '@/services/api/breeder';
import { getIotDeviceOptions } from '@/services/api/iot';
import type { ProductionPlan } from '@/types/model';
import dayjs from 'dayjs';

const PLAN_TYPE_MAP: Record<string, string> = {
  feeding: '投喂计划',
  medication: '用药计划',
  harvest: '收获计划',
  maintenance: '维护计划',
  seeding: '放苗计划',
  water_change: '换水/增氧计划',
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low: { label: '低', color: '#8c8c8c' },
  medium: { label: '中', color: '#A0843A' },
  high: { label: '高', color: '#B54E3C' },
  urgent: { label: '紧急', color: '#cf1322' },
};

const STATUS_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  draft: { label: '草稿', bgColor: '#EBE5DE', textColor: '#5C4F42' },
  published: { label: '已发布', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  active: { label: '执行中', bgColor: '#F5EDD6', textColor: '#A0843A' },
  completed: { label: '已完成', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  cancelled: { label: '已取消', bgColor: '#EBE5DE', textColor: '#7A6E64' },
};

interface TaskRow {
  key: string;
  enabled: boolean;
  taskTitle: string;
  actionTime: string; // HH:mm
  actionDate: string; // yyyy-MM-dd
  durationMinutes: number;
  assigneeId?: number;
  deviceId?: number;
  deviceAction?: string;
  priority?: string;
}

interface PublishPlanModalProps {
  visible: boolean;
  plan: ProductionPlan | null;
  onCancel: () => void;
  onSuccess: (result: { planTitle: string; tasksGenerated: number }) => void;
}

const PublishPlanModal: React.FC<PublishPlanModalProps> = ({ visible, plan, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<Array<{ label: string; value: number }>>([]);
  const [devices, setDevices] = useState<Array<{ label: string; value: number; typeCode: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [skipGen, setSkipGen] = useState(false);

  // 获取模板任务
  useEffect(() => {
    if (visible && plan) {
      fetchEmployees(plan);
      fetchDevices(plan);
      form.resetFields();
      setSkipGen(false);
      loadTaskTemplates(plan);
    }
  }, [visible, plan]);

  const fetchEmployees = async (p: ProductionPlan) => {
    if (!p.baseId) return;
    try {
      const options = await getEmployeesByBase(p.baseId);
      setUsers(options);
    } catch { /* ignore */ }
  };

  const fetchDevices = async (p: ProductionPlan) => {
    if (!p.baseId) return;
    try {
      const res = await getIotDeviceOptions(p.baseId);
      const list = (res?.data || []).map((d: any) => ({
        label: d.deviceName,
        value: d.id,
        typeCode: d.typeCode,
      }));
      setDevices(list);
    } catch { setDevices([]); }
  };

  const loadTaskTemplates = async (p: ProductionPlan) => {
    if (!p.planType) {
      setTaskRows([]);
      return;
    }
    try {
      const res = await getTaskTemplates(
        p.planType,
        p.startTime || undefined,
        p.endTime || undefined
      );
      const templates = res?.data || [];
      if (templates.length === 0) {
        // 无模板时，用旧逻辑兜底
        setTaskRows([]);
        return;
      }

      // 将模板转为任务行
      // 确定基准日期
      const baseDate = p.startTime ? dayjs(p.startTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

      const rows: TaskRow[] = templates.map((tpl: any, idx: number) => {
        const hour = tpl.defaultHour ?? 8;
        const minute = tpl.defaultMinute ?? 0;
        return {
          key: `task_${idx}`,
          enabled: true,
          taskTitle: tpl.taskTitle || '',
          actionDate: baseDate,
          actionTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
          durationMinutes: tpl.durationMinutes || 60,
          priority: 'medium',
          assigneeId: undefined,
          deviceId: tpl.supportIot ? undefined : undefined,
          deviceAction: undefined,
        };
      });
      setTaskRows(rows);
    } catch (e) {
      console.error('获取任务模板失败:', e);
      setTaskRows([]);
    }
  };

  // 处理单行变更
  const updateRow = (key: string, field: string, value: any) => {
    setTaskRows(prev =>
      prev.map(row => (row.key === key ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (key: string) => {
    setTaskRows(prev => prev.filter(row => row.key !== key));
  };

  const addRow = () => {
    const baseDate = plan?.startTime ? dayjs(plan.startTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    const newRow: TaskRow = {
      key: `task_${Date.now()}`,
      enabled: true,
      taskTitle: '新建任务',
      actionDate: baseDate,
      actionTime: '08:00',
      durationMinutes: 60,
      priority: 'medium',
    };
    setTaskRows(prev => [...prev, newRow]);
  };

  const handlePublish = async () => {
    if (!plan?.id) return;

    if (!skipGen && taskRows.filter(r => r.enabled).length === 0) {
      message.warning('请至少添加一个任务，或勾选"跳过任务生成"');
      return;
    }

    setSubmitting(true);
    try {
      // 获取默认执行人
      const defaultAssigneeId = form.getFieldValue('defaultAssigneeId');

      // 构建 tasks 参数
      const tasks = skipGen
        ? undefined
        : taskRows
            .filter(r => r.enabled)
            .map(row => ({
              taskTitle: row.taskTitle,
              // LocalDateTime 需要 T 分隔
              actionTime: `${row.actionDate}T${row.actionTime}:00`,
              durationMinutes: row.durationMinutes,
              priority: row.priority || 'medium',
              // 单行没选执行人时用默认执行人
              assigneeId: row.assigneeId || defaultAssigneeId || undefined,
              deviceId: row.deviceId || undefined,
              deviceAction: row.deviceAction || undefined,
            }));

      const body: any = {
        skipTaskGen: skipGen,
      };
      if (tasks && tasks.length > 0) {
        body.tasks = tasks;
      }

      const result = await publishPlan(plan.id, body);
      const data = result.data as any;
      onSuccess({
        planTitle: plan.title || '',
        tasksGenerated: data?.tasksGenerated || 0,
      });
    } catch (error: any) {
      message.error(error?.message || '发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!plan) return null;

  const statusConfig = STATUS_MAP[plan.status || ''] || { label: plan.status, bgColor: '#f0f0f0', textColor: '#666' };
  const enabledCount = taskRows.filter(r => r.enabled).length;

  const columns = [
    {
      title: '',
      dataIndex: 'enabled',
      width: 40,
      render: (_: any, record: TaskRow) => (
        <Checkbox
          checked={record.enabled}
          onChange={e => updateRow(record.key, 'enabled', e.target.checked)}
        />
      ),
    },
    {
      title: '任务名称',
      dataIndex: 'taskTitle',
      width: 180,
      render: (val: string, record: TaskRow) => (
        <Input
          size="small"
          value={val}
          onChange={e => updateRow(record.key, 'taskTitle', e.target.value)}
          style={{ width: 160 }}
        />
      ),
    },
    {
      title: '日期',
      dataIndex: 'actionDate',
      width: 110,
      render: (val: string, record: TaskRow) => (
        <input
          type="date"
          value={val}
          onChange={e => updateRow(record.key, 'actionDate', e.target.value)}
          style={{ width: 110, border: '1px solid #d9d9d9', borderRadius: 4, padding: '2px 6px', fontSize: 13 }}
        />
      ),
    },
    {
      title: '时间',
      dataIndex: 'actionTime',
      width: 80,
      render: (val: string, record: TaskRow) => (
        <input
          type="time"
          value={val}
          onChange={e => updateRow(record.key, 'actionTime', e.target.value)}
          style={{ width: 80, border: '1px solid #d9d9d9', borderRadius: 4, padding: '2px 4px', fontSize: 13 }}
        />
      ),
    },
    {
      title: '优先级', dataIndex: 'priority', width: 80,
      render: (val, record) => (
        <Select
          size="small"
          value={val || 'medium'}
          onChange={v => updateRow(record.key, 'priority', v)}
          style={{ width: 75 }}
          options={[
            { label: '低', value: 'low' },
            { label: '中', value: 'medium' },
            { label: '高', value: 'high' },
            { label: '紧急', value: 'urgent' },
          ]}
        />
      ),
    },
    {
      title: '时长(分)',
      dataIndex: 'durationMinutes',
      width: 70,
      render: (val: number, record: TaskRow) => (
        <InputNumber
          size="small"
          min={5}
          max={1440}
          step={5}
          value={val}
          onChange={v => updateRow(record.key, 'durationMinutes', v || 60)}
          style={{ width: 65 }}
        />
      ),
    },
    {
      title: '执行人',
      dataIndex: 'assigneeId',
      width: 120,
      render: (val: number | undefined, record: TaskRow) => (
        <Select
          size="small"
          allowClear
          placeholder="不分配"
          value={val}
          onChange={v => updateRow(record.key, 'assigneeId', v)}
          showSearch
          filterOption={(input, option) =>
            (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={users}
          style={{ width: 110 }}
        />
      ),
},
    // IoT 设备
    {
      title: 'IoT 设备', width: 150,
      render: (val: any, record: TaskRow) => {
        const available = devices;
        if (available.length === 0) {
          return <Tag style={{ color: '#999', background: '#f5f5f5', border: 'none' }}>无设备</Tag>;
        }
        return (
          <Select
            size="small"
            allowClear
            placeholder="选择设备"
            value={record.deviceId}
            onChange={v => {
              const dev = available.find(d => d.value === v);
                updateRow(record.key, 'deviceId', v);
                updateRow(record.key, 'deviceAction', v ? (dev?.typeCode?.startsWith('DO_') || dev?.typeCode?.startsWith('PH_') || dev?.typeCode?.startsWith('TEMP_') ? 'read' : 'on') : undefined);
            }}
            style={{ width: 130 }}
              options={available.map(d => ({
               label: d.label + ' (' + (d.typeCode || '') + ')',
              value: d.value,
            }))}
          />
        );
      },
    },
    {
      title: '',
      width: 40,
      render: (_: any, record: TaskRow) => (
        <DeleteOutlined
          style={{ color: '#999', cursor: 'pointer' }}
          onClick={() => removeRow(record.key)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#B54E3C' }} />
          发布计划
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handlePublish}
      confirmLoading={submitting}
      okText="确认发布"
      cancelText="取消"
      width={960}
      destroyOnClose
    >
      {/* 计划信息卡片 */}
      <div style={{ background: '#F7F3EF', padding: '12px 16px', borderRadius: 6, marginBottom: 16 }}>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="计划标题">{plan.title || '-'}</Descriptions.Item>
          <Descriptions.Item label="计划类型">{PLAN_TYPE_MAP[plan.planType || ''] || plan.planType || '-'}</Descriptions.Item>
          <Descriptions.Item label="当前状态">
            <Tag style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.textColor, border: 'none' }}>{statusConfig.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所属基地">{plan.baseName || '-'}</Descriptions.Item>
          <Descriptions.Item label="作业对象">{plan.targetName || '-'}</Descriptions.Item>
          <Descriptions.Item label="计划时间">
            {plan.startTime ? `${plan.startTime} ~ ${plan.endTime || ''}` : '-'}
          </Descriptions.Item>
          {plan.contentDesc && (
            <Descriptions.Item label="操作指南" span={3}>
              <div style={{ background: '#FFF7E6', padding: '6px 10px', borderRadius: 4, fontSize: 13, lineHeight: 1.6 }}>{plan.contentDesc}</div>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>

      {/* 任务清单 */}
      {!skipGen && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>任务清单</span>
            <Space>
              <span style={{ fontSize: 12, color: '#999' }}>将生成 {enabledCount} 个任务</span>
              <Button size="small" icon={<PlusOutlined />} onClick={addRow}>
                添加任务
              </Button>
            </Space>
          </div>

          {taskRows.length > 0 ? (
            <Table
              dataSource={taskRows}
              columns={columns}
              rowKey="key"
              pagination={false}
              size="small"
              bordered
              style={{ marginBottom: 12 }}
              scroll={{ x: 'max-content' }}
            />
          ) : (
            <Alert
              type="info"
              showIcon
              message="该计划类型暂无默认任务模板，你可以点击「添加任务」手动添加"
              style={{ marginBottom: 12 }}
            />
          )}
        </>
      )}

      {/* 底部设置 */}
      <Form form={form} layout="inline" style={{ marginTop: 8 }}>
        <Form.Item name="defaultAssigneeId" label="默认执行人">
          <Select
            style={{ width: 160 }}
            size="small"
            allowClear
            placeholder="不选则不分配"
            showSearch
            filterOption={(input, option) =>
              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={users}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={skipGen} onChange={e => setSkipGen(e.target.checked)}>
            跳过任务生成，仅发布计划
          </Checkbox>
        </Form.Item>
      </Form>

      {skipGen && (
        <Alert
          type="warning"
          showIcon
          message="跳过任务生成后，计划状态变为「已发布」，但不会创建任何任务"
          style={{ marginTop: 8 }}
        />
      )}
    </Modal>
  );
};

export default PublishPlanModal;
