import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Tag, Popconfirm, Select, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { getDeviceConfigs, saveDeviceConfigs, addDeviceConfig, deleteDeviceConfig, type DeviceConfigItem } from '@/services/api/deviceConfig';

const { Text } = Typography;

const PRESET_KEYS = {
  REPORT_INTERVAL: { label: '上报间隔', desc: '设备每隔多少秒向服务器报告一次数据', unit: '秒', examples: ['60', '300', '600'] },
  ALARM_THRESHOLD_HIGH: { label: '高值告警阈值', desc: '当设备数据超过这个值时触发告警', unit: '', examples: ['32', '100', '50'] },
  ALARM_THRESHOLD_LOW: { label: '低值告警阈值', desc: '当设备数据低于这个值时触发告警', unit: '', examples: ['3.0', '6.5', '20'] },
  FEED_SCHEDULE: { label: '投喂时间表', desc: '每天自动投喂的时间点', unit: 'HH:mm', examples: ['06:00,12:00,18:00'] },
  FEED_AMOUNT: { label: '单次投喂量', desc: '每次投喂的料重', unit: 'kg', examples: ['50', '100', '200'] },
  AERATION_DURATION: { label: '增氧时长', desc: '增氧机每次运行时间', unit: '分钟', examples: ['30', '60', '120'] },
  CALIBRATION_VALUE: { label: '校准值', desc: '传感器的校准偏移值', unit: '', examples: ['0.0', '0.5', '-0.3'] },
};

interface DeviceConfigModalProps {
  visible: boolean;
  deviceId: number;
  deviceName: string;
  onCancel: () => void;
}

const DeviceConfigModal = ({ visible, deviceId, deviceName, onCancel }) => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadConfigs = async () => {
    setLoading(true);
    try { const res = await getDeviceConfigs(deviceId); setConfigs(res.data || []); }
    catch { setConfigs([]); } finally { setLoading(false); }
  };

  useEffect(() => { if (visible && deviceId) loadConfigs(); }, [visible, deviceId]);

  const addRow = (presetKey) => {
    if (presetKey) {
      if (configs.find(c => c.paramKey === presetKey)) {
        message.info('该参数已存在，直接编辑即可'); return;
      }
      setConfigs(prev => [...prev, { paramKey: presetKey, paramValue: PRESET_KEYS[presetKey].examples[0] || '' }]);
    } else {
      setConfigs(prev => [...prev, { paramKey: '', paramValue: '' }]);
    }
  };

  const removeRow = async (index, item) => {
    if (item.id) {
      try { await deleteDeviceConfig(item.id); message.success('已删除'); loadConfigs(); return; }
      catch { message.error('删除失败'); return; }
    }
    setConfigs(prev => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    setConfigs(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    for (const item of configs) {
      if (!item.paramKey.trim()) { message.warning('参数键不能为空'); return; }
      if (!item.paramValue.trim()) { message.warning('参数值不能为空'); return; }
    }
    setSaving(true);
    try { await saveDeviceConfigs(deviceId, configs); message.success('配置已保存'); onCancel(); }
    catch { message.error('保存失败'); } finally { setSaving(false); }
  };

  const availablePresets = Object.keys(PRESET_KEYS).filter(k => !configs.find(c => c.paramKey === k));

  return (
    <Modal
      title={<Space>设备配置 - {deviceName}<Tag color="blue" style={{ fontSize: 11 }}>#{deviceId}</Tag></Space>}
      open={visible} onCancel={onCancel} onOk={handleSave}
      confirmLoading={saving} okText="保存配置" cancelText="取消" width={640} destroyOnClose
    >
      {availablePresets.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Space size={4} wrap>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>快速添加：</Text>
            {availablePresets.map(k => (
              <Tag key={k} color="blue" style={{ cursor: 'pointer' }} onClick={() => addRow(k)}>{PRESET_KEYS[k].label}</Tag>
            ))}
          </Space>
        </div>
      )}

      <Table
        dataSource={configs}
        columns={[
          { title: '参数', width: 180,
            render: (_, __, i) => (
              <Select size="small" value={configs[i]?.paramKey || undefined}
                placeholder="选择参数" style={{ width: 160 }} showSearch
                onChange={v => updateRow(i, 'paramKey', v)}
                options={Object.entries(PRESET_KEYS).map(([k, v]) => ({ label: v.label + ' (' + k + ')', value: k }))} />
            ),
          },
          { title: '值', width: 120,
            render: (_, __, i) => {
              const unit = configs[i]?.paramKey ? (PRESET_KEYS[configs[i].paramKey]?.unit || '') : '';
              return <Input size="small" value={configs[i]?.paramValue || ''}
                placeholder="输入值" onChange={e => updateRow(i, 'paramValue', e.target.value)}
                suffix={unit} style={{ width: 110 }} />;
            }
          },
          { title: '说明', width: 220,
            render: (_, __, i) => {
              const p = configs[i]?.paramKey ? PRESET_KEYS[configs[i].paramKey] : null;
              return p ? <Text type="secondary" style={{ fontSize: 12 }}>{p.desc}</Text>
                : configs[i]?.paramKey ? <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>自定义参数</Text> : null;
            }
          },
          { title: '操作', width: 50,
            render: (_, __, i) => (
              <Popconfirm title="确定删除？" onConfirm={() => removeRow(i, configs[i])}>
                <DeleteOutlined style={{ color: '#999', cursor: 'pointer' }} />
              </Popconfirm>
            )
          },
        ]}
        rowKey={(_, i) => String(i)} pagination={false} size="small" bordered
        loading={loading} style={{ marginBottom: 8 }}
        locale={{ emptyText: '暂无配置，点击上方快速添加' }}
      />

      <Button type="dashed" icon={<PlusOutlined />} onClick={() => addRow()} block>自定义参数</Button>

      <div style={{ marginTop: 8, fontSize: 12, color: '#999', lineHeight: 1.6 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>点击上方蓝色标签一键添加常用配置，或点「自定义参数」手动输入</Text>
      </div>
    </Modal>
  );
};

export default DeviceConfigModal;