import { EditOutlined, SaveOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Divider, Drawer, Empty, Form, Input, InputNumber, Row, Select, Space, Statistic, Tabs, Tag, Timeline, Typography, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPondFullDetail, updatePond } from '@/services/api/pond';

const { Text, Title } = Typography;
const { confirm } = Modal;



interface TimelineItem {
  label: string;      
  children: string;   
}

interface PondDetailDrawerProps {
  visible: boolean;
  pondId: string | null; 
  onClose: () => void;
  onDelete: (id: string) => void;
}


const PondDetailDrawer: React.FC<PondDetailDrawerProps> = ({ visible, pondId, onClose, onDelete }) => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pond, setPond] = useState<Pond.PondDetail | null>(null);


  useEffect(() => {
    if (pondId && visible) {
      setLoading(true);
      getPondFullDetail(pondId)
        .then(res => {
          setPond(res.data);
          form.setFieldsValue(res.data);
        })
        .catch(() => message.error('加载失败'))
        .finally(() => setLoading(false));
    }
  }, [pondId, visible]);

  if (!pondId) return null;


  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updatePond(pondId, values);
      message.success('塘口档案更新成功');
      setIsEditing(false);
      
      // 重新加载当前详情
      const res = await getPondFullDetail(pondId);
      setPond(res.data);
      form.setFieldsValue(res.data);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请检查输入或网络连接');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
     title: `确定要删除 ${pond?.id} (${pond?.name}) 吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '删除后，该塘口的所有历史养殖记录、设备关联信息将无法找回，请谨慎操作。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        onDelete(pondId);
        message.success(`${pondId} 档案已彻底删除`);
        onClose();
      },
    });
  };

  // const pondTimeLines = [
  //   { label: '2026-03-27 18:30', children: '系统自动投喂 45.2kg (1.5mm 高蛋白)' },
  //   { label: '2026-03-26 10:30', children: '技术员-李工 录入用药记录：聚维酮碘 120g (预防)' },
  //   { label: '2026-03-20 09:00', children: '水质采样送检：指标符合二级养殖水标准' },
  //   { label: '2026-02-10 08:00', children: '正式放苗：南美白对虾 50万尾' },
  // ];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title level={4} style={{ margin: 0 }}>{pondId} 数字化档案</Title>
            <Tag color="blue">{pond?.name}</Tag>
          </div>
          <Space>
            {!isEditing && (
              <Button 
                danger 
                size="small" 
                icon={<DeleteOutlined />} 
                onClick={showDeleteConfirm}
                style={{ borderRadius: '2px' }}
              >
                删除塘口
              </Button>
            )}
            {isEditing ? (
              <>
                <Button size="small" onClick={() => setIsEditing(false)}>取消</Button>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存修改</Button>
              </>
            ) : (
              <Button size="small" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>修改档案</Button>
            )}
          </Space>
        </div>
      }
      width={650}
      onClose={onClose}
      
      open={visible}
      styles={{ body: { padding: '0 24px 24px' } }}
      extra={null}
      destroyOnClose
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '实时概览',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {isEditing ? (
                  <Form form={form} layout="vertical" initialValues={pond || {}}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="name" label="塘口名称" rules={[{ required: true }]}>
                          <Input placeholder="请输入塘口名称" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="status" label="运营状态" rules={[{ required: true }]}>
                          <Select options={[
                            { label: '养殖中', value: 'breeding' },
                            { label: '空塘', value: 'empty' },
                            { label: '待出塘', value: 'ready' },
                            { label: '锁定', value: 'locked' },
                          ]} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="species" label="养殖品种">
                          <Select options={[
                            { label: '南美白对虾', value: '南美白对虾' },
                            { label: '大黄鱼', value: '大黄鱼' },
                            { label: '鲍鱼', value: '鲍鱼' },
                          ]} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="area" label="水体面积 (m²)">
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="bottomType" label="底质类型">
                          <Select options={[
                            { label: '沙泥质', value: '沙泥质' },
                            { label: '水泥底', value: '水泥底' },
                            { label: '地膜', value: '地膜' },
                          ]} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="aerators" label="增氧机配置">
                          <Input.TextArea rows={2} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card variant="borderless" className="fin-card" style={{ backgroundColor: '#f9f9f9' }}>
                          <Statistic title="当前存塘量 (估算)" value={pond?.estWeight} suffix="kg" className="fin-number" />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card variant="borderless" className="fin-card" style={{ backgroundColor: '#f9f9f9' }}>
                          <Statistic title="养殖天数" value={pond?.days} suffix="天" className="fin-number" />
                        </Card>
                      </Col>
                    </Row>

                    <Descriptions title="基本物理参数" bordered size="small" column={2}>
                      <Descriptions.Item label="水体面积">{pond?.area} m²</Descriptions.Item>
                      <Descriptions.Item label="标准水深">1.8 m</Descriptions.Item>
                      <Descriptions.Item label="底质类型">沙泥质</Descriptions.Item>
                      <Descriptions.Item label="进排水口">自动闸门</Descriptions.Item>
                      <Descriptions.Item label="增氧机配置" span={2}>3kW 浮子式 x 4, 1.5kW 纳米曝气 x 2</Descriptions.Item>
                    </Descriptions>
                  </>
                )}

                <Divider style={{ margin: '8px 0' }} />

                <Title level={5}>养殖生命周期时间轴</Title>
                <Timeline 
                  mode="left" 
                  items={pond?.timeline?.map(item => ({
                    label: item.time,
                    children: item.content,
                  }))} 
                />
              </Space>
            ),
          },
          {
            key: '2',
            label: '履历统计',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic title="累计投喂" value={4520} suffix="kg" className="fin-number" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="累计用药" value={12} suffix="次" className="fin-number" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="累计耗电" value={1280} suffix="kWh" className="fin-number" />
                  </Col>
                </Row>
                <Divider />
                <Empty description="暂无历史批次对比数据" />
              </Space>
            ),
          },
          {
            key: '3',
            label: '设备监控',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <div style={{ width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff' }}>[ 摄像头实时画面模拟 - {pond?.id} ]</Text>
                </div>
                <Descriptions title="在线设备状态" size="small">
                  <Descriptions.Item label="溶氧传感器"><Tag color="success">在线</Tag></Descriptions.Item>
                  <Descriptions.Item label="投饵机A"><Tag color="success">待命</Tag></Descriptions.Item>
                  <Descriptions.Item label="1号增氧机"><Tag color="processing">运行中</Tag></Descriptions.Item>
                </Descriptions>
              </Space>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

export default PondDetailDrawer;
