import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, message, Tag, Card, Typography, Divider, Alert, Spin, Table } from 'antd';
import { PoweroffOutlined, PlayCircleOutlined, ToolOutlined, HistoryOutlined } from '@ant-design/icons';
import { sendDeviceCommand } from '@/services/api/iot';
import { getCommandLogs } from '@/services/api/iot';
import { getCommandList } from '@/services/api/iot-device-type-command';

const { Text, Title } = Typography;

const SENSOR_TYPE_IDS = [2, 3, 4];

const COMMAND_ICONS: Record<string, React.ReactNode> = {
  start: <PlayCircleOutlined />,
  stop: <PoweroffOutlined />,
  feed_once: <PlayCircleOutlined />,
  stop_feeding: <PoweroffOutlined />,
};

const DeviceControlModal = ({ visible, device, onCancel }) => {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cmdResult, setCmdResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 打开时拉取该设备类型的指令列表
  useEffect(() => {
    if (!visible || !device) return;
    setShowHistory(false);
    setCmdResult(null);
    const isSensor = SENSOR_TYPE_IDS.includes(device.typeId);
    if (isSensor) {
      setCommands([]);
      return;
    }
    setLoading(true);
    getCommandList(device.typeId).then((res: any) => {
      if (res.code === 200 || res.success) {
        const list = (res.data || []).filter((cmd: any) => cmd.isActive !== 0);
        setCommands(list.map((cmd: any) => ({
          key: cmd.commandKey,
          label: cmd.commandName,
          confirm: cmd.confirmText,
          icon: COMMAND_ICONS[cmd.commandKey] || <PlayCircleOutlined />,
        })));
      }
    }).finally(() => setLoading(false));
  }, [visible, device]);

  const loadHistory = async () => {
    if (!device) return;
    setHistoryLoading(true);
    try {
      const res: any = await getCommandLogs(device.id);
      if (res.code === 200 || res.success) {
        setHistoryLogs(res.data || []);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCommand = async (cmd: any) => {
    Modal.confirm({
      title: '确认操作',
      content: cmd.confirm || `确定向设备发送「${cmd.label}」指令吗？`,
      onOk: async () => {
        setSending(true);
        setCmdResult(null);
        try {
          const res: any = await sendDeviceCommand(device.id, cmd.key);
          if (res.code === 200 || res.success) {
            setCmdResult({ type: 'success', msg: res.data || '指令已发送，等待设备执行' });
            message.success('指令已发送');
          } else {
            setCmdResult({ type: 'error', msg: res.message || '发送失败' });
          }
        } catch {
          setCmdResult({ type: 'error', msg: '发送失败，请检查后端服务连接' });
        } finally {
          setSending(false);
        }
      },
    });
  };

  if (!device) return null;

  const isSensor = SENSOR_TYPE_IDS.includes(device.typeId);
  const deviceTypeName = device.typeName || '未知设备';

  const historyColumns = [
    { title: '指令', dataIndex: 'commandKey', key: 'commandKey', width: 100 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: string) => <Tag>{s}</Tag>,
    },
    { title: '发送时间', dataIndex: 'triggerTime', key: 'triggerTime', width: 160 },
    { title: '回复时间', dataIndex: 'responseTime', key: 'responseTime', width: 160 },
    { title: '结果', dataIndex: 'responseData', key: 'responseData', ellipsis: true },
    { title: '错误', dataIndex: 'errorMsg', key: 'errorMsg', ellipsis: true },
  ];

  return (
    <Modal
      title={<Space>设备控制 - {device.deviceName}<Tag>{deviceTypeName}</Tag></Space>}
      open={visible}
      onCancel={() => { setShowHistory(false); onCancel(); }}
      footer={null}
      width={showHistory ? 700 : 480}
      destroyOnClose
    >
      {isSensor ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ToolOutlined style={{ fontSize: 48, color: '#8c8c8c' }} />
          <Title level={5} type="secondary" style={{ marginTop: 16 }}>
            {deviceTypeName}为传感器类设备
          </Title>
          <Text type="secondary">传感器只能上报数据，不支持远程控制</Text>
        </div>
      ) : showHistory ? (
        <Spin spinning={historyLoading}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>指令执行记录</Text>
            <Button size="small" onClick={() => { setShowHistory(false); }}>返回控制</Button>
          </div>
          <Table
            dataSource={historyLogs}
            columns={historyColumns}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, showSizeChanger: false }}
          />
        </Spin>
      ) : (
        <Spin spinning={loading}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button size="small" icon={<HistoryOutlined />} onClick={() => { loadHistory(); setShowHistory(true); }}>
              查看指令历史
            </Button>
          </div>

          <Card size="small" style={{ marginBottom: 12, backgroundColor: '#f5f5f5' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              指令将通过 MQTT 发送到设备，需要设备处于在线状态才能接收
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

          {commands.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary">该设备当前没有可用的控制指令</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  请到 <a href="/production/operation/iot-config">IoT设备配置</a> 中为该品种添加指令
                </Text>
              </div>
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {commands.map(cmd => (
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
                  }}
                >
                  {cmd.label}
                </Button>
              ))}
            </Space>
          )}

          <Divider />
          <div style={{ fontSize: 12, color: '#999' }}>
            <div>设备接收主题：<Text code>aquaculture/{device.baseId}/{device.deviceSn}/command</Text></div>
          </div>
        </Spin>
      )}
    </Modal>
  );
};

export default DeviceControlModal;
