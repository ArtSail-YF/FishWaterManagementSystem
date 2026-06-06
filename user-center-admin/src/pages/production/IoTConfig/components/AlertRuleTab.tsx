import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Modal, message, Table, Typography, Input, Select, Form, Switch } from 'antd';
import {
  getAlertRuleList,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
  type IoTAlertRule,
} from '@/services/api/iot-alert-rule';
import { getMetricDefList, type MetricDef } from '@/services/api/iot-metric-def';

const { Text } = Typography;

const SEVERITY_LABELS: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
};

const CHANNEL_OPTIONS = [
  { label: '系统通知', value: 'system' },
  { label: '短信', value: 'sms' },
  { label: '邮件', value: 'email' },
];

const CHANNEL_LABELS: Record<string, string> = {
  system: '系统通知',
  sms: '短信',
  email: '邮件',
};

interface Props {
  deviceTypeId: number;
}

const parseChannels = (val: string | undefined): string[] =>
  val ? val.split(',').filter(Boolean) : [];

const joinChannels = (arr: string[]): string => arr.join(',');

const AlertRuleTab: React.FC<Props> = ({ deviceTypeId }) => {
  const [rules, setRules] = useState<IoTAlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [metricDefs, setMetricDefs] = useState<MetricDef[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadRules();
    loadMetricDefs();
  }, [deviceTypeId]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await getAlertRuleList(deviceTypeId);
      if (res.code === 200) setRules(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const loadMetricDefs = async () => {
    try {
      const res = await getMetricDefList(deviceTypeId);
      if (res.code === 200) setMetricDefs(res.data || []);
    } catch { /* ignore */ }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后该品种设备将不再触发此预警规则',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteAlertRule(id);
          message.success('已删除');
          loadRules();
        } catch { message.error('删除失败'); }
      },
    });
  };

  const startAdd = () => {
    form.resetFields();
    form.setFieldsValue({ deviceTypeId, isEnabled: 1, severity: 'MEDIUM', notifyChannels: ['system'] });
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (record: IoTAlertRule) => {
    form.setFieldsValue({ ...record, notifyChannels: parseChannels(record.notifyChannels) });
    setEditingId(record.id!);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const body = {
        ...values,
        notifyChannels: joinChannels(values.notifyChannels || []),
      };
      if (editingId) {
        await updateAlertRule(editingId, body);
        message.success('规则已更新');
      } else {
        await createAlertRule(body);
        message.success('规则已创建');
      }
      cancelEdit();
      loadRules();
      loadMetricDefs();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('操作失败');
    }
  };

  const metricKeyOptions = metricDefs.map(m => ({
    label: `${m.displayName} (${m.metricKey})`,
    value: m.metricKey,
  }));

  const isEditingRow = (record: IoTAlertRule) => editingId === record.id;

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      width: 130,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="ruleName" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Input size="small" placeholder="例如：溶氧过低预警" />
          </Form.Item>
        ) : record.ruleName;
      },
    },
    {
      title: '指标键',
      dataIndex: 'metricKey',
      width: 140,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="metricKey" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Select size="small" style={{ width: 130 }} options={metricKeyOptions} />
          </Form.Item>
        ) : (
          <code style={{ background: '#f5f5f5', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>{record.metricKey}</code>
        );
      },
    },
    {
      title: '触发条件',
      dataIndex: 'conditionExpr',
      width: 140,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="conditionExpr" rules={[{ required: true, message: '必填' }]} style={{ margin: 0 }}>
            <Input size="small" placeholder="例如：value < 3.0" />
          </Form.Item>
        ) : (
          <code style={{ fontSize: 12 }}>{record.conditionExpr}</code>
        );
      },
    },
    {
      title: '严重级别',
      dataIndex: 'severity',
      width: 85,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="severity" rules={[{ required: true }]} style={{ margin: 0 }}>
            <Select size="small" style={{ width: 80 }} options={[
              { label: '低', value: 'LOW' },
              { label: '中', value: 'MEDIUM' },
              { label: '高', value: 'HIGH' },
            ]} />
          </Form.Item>
        ) : (
          SEVERITY_LABELS[record.severity] || record.severity
        );
      },
    },
    {
      title: '通知渠道',
      dataIndex: 'notifyChannels',
      width: 200,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        if (editing) {
          return (
            <Form.Item name="notifyChannels" style={{ margin: 0 }}>
              <Select mode="multiple" size="small" style={{ width: 180 }} placeholder="选择渠道"
                options={CHANNEL_OPTIONS} />
            </Form.Item>
          );
        }
        const channels = parseChannels(record.notifyChannels);
        return channels.length > 0
          ? channels.map(ch => CHANNEL_LABELS[ch] || ch).join('、')
          : <Text type="secondary">未配置</Text>;
      },
    },
    {
      title: '启用',
      dataIndex: 'isEnabled',
      width: 55,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        return editing ? (
          <Form.Item name="isEnabled" style={{ margin: 0 }} valuePropName="checked">
            <Switch checkedValue={1} unCheckedValue={0} size="small" />
          </Form.Item>
        ) : (
          record.isEnabled === 1 ? <Text>启用</Text> : <Text type="secondary">停用</Text>
        );
      },
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: IoTAlertRule) => {
        const editing = isAdding ? (record.id === -1) : isEditingRow(record);
        if (editing) {
          return (
            <Space size={4}>
              <Button type="link" size="small" onClick={handleSave}>保存</Button>
              <Button type="link" size="small" onClick={cancelEdit}>取消</Button>
            </Space>
          );
        }
        return (
          <Space size={0}>
            <Button type="link" size="small" onClick={() => startEdit(record)}>编辑</Button>
            <Button type="link" size="small" danger onClick={() => handleDelete(record.id!)}>删除</Button>
          </Space>
        );
      },
    },
  ];

  const dataSource = isAdding
    ? [{ id: -1, deviceTypeId, ruleName: '', metricKey: '', conditionExpr: '', severity: 'MEDIUM', isEnabled: 1, notifyChannels: 'system' } as IoTAlertRule, ...rules]
    : rules;

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary">设备数据触发条件配置，满足条件时自动生成告警记录并推送通知</Text>
        {!isAdding && editingId === null && (
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={startAdd}>
            新增规则
          </Button>
        )}
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={r => (r.id ?? -1).toString()}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ x: 1000 }}
        locale={{ emptyText: isAdding ? '' : '暂无预警规则，点击上方"新增规则"添加' }}
      />
    </Form>
  );
};

export default AlertRuleTab;
