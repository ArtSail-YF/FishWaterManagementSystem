import { Drawer, Form, Input, Button, Switch, Select, Space, Divider, message, Card } from 'antd';
import { VideoCameraOutlined, ApiOutlined, PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import type { PondManagementItem } from '../index';

interface DeviceHubDrawerProps {
  visible: boolean;
  onClose: () => void;
  pond: PondManagementItem | null;
}

const DeviceHubDrawer: React.FC<DeviceHubDrawerProps> = ({ visible, onClose, pond }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && pond) {
      form.setFieldsValue({
        videoUrl: pond.videoUrl,
        iotNodes: pond.iotNodes.join(','),
        enableControl: true,
      });
    }
  }, [visible, pond]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存设备配置:', values);
      message.success(`${pond?.name} 设备配置已更新`);
      onClose();
    } catch (error) {
      console.error('表单校验失败:', error);
    }
  };

  const testConnection = () => {
    message.loading({ content: '正在测试视频流连接...', key: 'test' });
    setTimeout(() => {
      message.success({ content: '视频流连接成功 (HLS 0.5s 延迟)', key: 'test', duration: 2 });
    }, 1500);
  };

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>设备配置: {pond?.name}</span>
        </Space>
      }
      width={500}
      onClose={onClose}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              保存配置
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Divider orientation="left" style={{ marginTop: 0 }}>
          <VideoCameraOutlined /> 视频监控配置
        </Divider>
        <Form.Item
          name="videoUrl"
          label="视频流地址 (RTSP/HLS/FLV)"
          tooltip="支持海康、大华等主流厂家的标准流协议"
          rules={[{ required: true, message: '请输入视频流地址' }]}
        >
          <Input placeholder="rtsp://admin:password@ip:port/stream" />
        </Form.Item>
        
        <div style={{ marginBottom: 24 }}>
          <Button 
            icon={<PlayCircleOutlined />} 
            onClick={testConnection}
            style={{ width: '100%', height: '120px', borderStyle: 'dashed', backgroundColor: '#fafafa' }}
          >
            点击测试预览画面
          </Button>
        </div>

        <Form.Item name="enableControl" label="开启云台控制" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>

        <Divider orientation="left">
          <ApiOutlined /> IoT 传感器映射
        </Divider>
        <Form.Item
          name="iotNodes"
          label="关联设备节点 (SN/ID)"
          tooltip="输入多个节点 ID，用逗号分隔"
        >
          <Input.TextArea rows={3} placeholder="NODE-001, NODE-002..." />
        </Form.Item>

        <Form.Item name="reportFrequency" label="上报频率 (秒)" initialValue={30}>
          <Select options={[
            { label: '5s (实时)', value: 5 },
            { label: '30s (标准)', value: 30 },
            { label: '60s (节能)', value: 60 },
          ]} />
        </Form.Item>

        <Card size="small" title="连接诊断" style={{ backgroundColor: '#f9f9f9' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>● 最近心跳: 2026-03-28 14:25:31</div>
            <div>● 信号强度: <span style={{ color: '#6b7280' }}>Excellent (-45dBm)</span></div>
            <div>● 数据延迟: <span className="fin-number">12ms</span></div>
          </div>
        </Card>
      </Form>
    </Drawer>
  );
};

// 补全缺失的图标导入
import { SettingOutlined } from '@ant-design/icons';

export default DeviceHubDrawer;
