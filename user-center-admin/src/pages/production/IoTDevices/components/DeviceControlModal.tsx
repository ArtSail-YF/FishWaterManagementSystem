import React, { useState } from 'react';
import { Modal, Button, Space, message, Tag, Card, Slider, Switch, Typography, Divider, Alert } from 'antd';
import { PoweroffOutlined, PlayCircleOutlined, ToolOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const CONTROL_CONFIG: Record<number, { label: string; commands: any[] }> = {
  1: { // 自动投喂机
    label: '自动投喂机',
    commands: [
      { key: 'start_feeding', label: '启动投喂', icon: <PlayCircleOutlined />, type: 'action', confirm: '确认启动投喂？' },
      { key: 'stop_feeding', label: '停止投喂', icon: <PoweroffOutlined />, type: 'action', confirm: '确认停止投喂？' },
    ],
  },
  2: { // 溶解氧传感器 - 无操作命令
    label: '溶解氧传感器',
    commands: [],
  },
  3: { // pH传感器
    label: 'pH传感器',
    commands: [],
  },
  4: { // 温度传感器
    label: '温度传感器',
    commands: [],
  },
  5: { // 增氧机
    label: '增氧机',
    commands: [
      { key: 'start', label: '开启增氧', icon: <PlayCircleOutlined />, type: 'action', confirm: '确认开启增氧机？' },
      { key: 'stop', label: '关闭增氧', icon: <PoweroffOutlined />, type: 'action', confirm: '确认关闭增氧机？' },
    ],
  },
  6: { // 水泵
    label: '水泵',
    commands: [
      { key: 'start', label: '开启水泵', icon: <PlayCircleOutlined />, type: 'action', confirm: '确认开启水泵？' },
      { key: 'stop', label: '关闭水泵', icon: <PoweroffOutlined />, type: 'action', confirm: '确认关闭水泵？' },
    ],
  },
};

const SENSOR_TYPES = [2, 3, 4]; // 传感器类型（只能看不能控）

const DeviceControlModal = ({ visible, device, onCancel }) => {
  const [sending, setSending] = useState(false);
  const [cmdResult, setCmdResult] = useState(null);

  const handleCommand = async (cmd) => {
    Modal.confirm({
      title: '确认操作',
      content: cmd.confirm,
      onOk: async () => {
        setSending(true);
        setCmdResult(null);
        try {
          // Login to EMQX
          const loginRes = await fetch('/emqx/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'public' }),
          });
          const loginData = await loginRes.json();
          const token = loginData.token;

          const payload = JSON.stringify({
            command: cmd.key,
            timestamp: new Date().toISOString(),
            deviceSn: device.deviceSn,
          });

          // Publish command to device topic
          const pubRes = await fetch('/emqx/publish', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({
              topic: 'aquaculture/' + device.baseId + '/' + device.deviceSn + '/command',
              payload: payload,
              qos: 1,
              retain: false,
            }),
          });

          if (pubRes.ok) {
            setCmdResult({ type: 'success', msg: '命令已发送·等待设备执行' });
            message.success('命令已发送');
          } else {
            setCmdResult({ type: 'error', msg: '发送失败' });
          }
        } catch {
          setCmdResult({ type: 'error', msg: '发送失败，检查 EMQX 连接' });
        } finally {
          setSending(false);
        }
      },
    });
  };

  if (!device) return null;

  const config = CONTROL_CONFIG[device.typeId] || { label: '未知设备', commands: [] };
  const isSensor = SENSOR_TYPES.includes(device.typeId);

  return (
    <Modal
      title={<Space>设备控制 - {device.deviceName}<Tag>{config.label}</Tag></Space>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
      destroyOnClose
    >
      {isSensor ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ToolOutlined style={{ fontSize: 48, color: '#8c8c8c' }} />
          <Title level={5} type="secondary" style={{ marginTop: 16 }}>
            {config.label}为传感器类设备
          </Title>
          <Text type="secondary">传感器只能上报数据，不支持远程控制</Text>
        </div>
      ) : config.commands.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">该设备当前没有可用的控制命令</Text>
        </div>
      ) : (
        <div>
          <Card size="small" style={{ marginBottom: 12, backgroundColor: '#f5f5f5' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              命令将通过 MQTT 发送到设备，需要设备处于在线状态才能接收
            </Text>
          </Card>

          {cmdResult && (
            <Alert
              type={cmdResult.type}
              message={cmdResult.msg}
              showIcon
              style={{ marginBottom: 12 }}
              closable
              onClose={() => setCmdResult(null)}
            />
          )}

          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            {config.commands.map(cmd => (
              <Button
                key={cmd.key}
                size="large"
                block
                icon={cmd.icon}
                onClick={() => handleCommand(cmd)}
                loading={sending}
                style={{
                  height: 48,
                  fontSize: 16,
                  borderColor: cmd.key.includes('stop') ? '#ff4d4f' : '#52c41a',
                  color: cmd.key.includes('stop') ? '#ff4d4f' : '#52c41a',
                }}
              >
                {cmd.label}
              </Button>
            ))}
          </Space>

          <Divider />
          <div style={{ fontSize: 12, color: '#999' }}>
            <div>设备接收主题：<Text code>aquaculture/{device.baseId}/{device.deviceSn}/command</Text></div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeviceControlModal;