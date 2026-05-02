import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  List,
  Card,
} from 'antd';

interface PlanDetailProps {
  visible: boolean;
  onCancel: () => void;
  plan: any;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ visible, onCancel, plan }) => {
  // 状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '草稿':
        return 'blue';
      case '已发布':
        return 'green';
      case '执行中':
        return 'orange';
      case '已完成':
        return 'purple';
      case '已延期':
        return 'red';
      case '已取消':
        return 'gray';
      default:
        return 'default';
    }
  };

  // 模拟计划执行记录
  const executionRecords = [
    {
      id: '1',
      time: '2026-04-18 08:00',
      executor: '张三',
      content: '完成第一次投喂，投喂量50kg',
      status: '已执行',
    },
    {
      id: '2',
      time: '2026-04-19 08:30',
      executor: '李四',
      content: '完成第二次投喂，投喂量55kg',
      status: '已执行',
    },
  ];

  if (!plan) return null;

  return (
    <Modal
      title="计划详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="计划名称">{plan.planName}</Descriptions.Item>
        <Descriptions.Item label="计划类型">{plan.planType}</Descriptions.Item>
        <Descriptions.Item label="关联塘口">{plan.pondNames}</Descriptions.Item>
        <Descriptions.Item label="计划时间">
          {plan.startTime} 至 {plan.endTime}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={getStatusColor(plan.status)}>{plan.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建人">{plan.creator}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{plan.createdAt}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">计划内容</Divider>
      <Card style={{ marginBottom: 16 }}>
        <p>{plan.content || '暂无计划内容'}</p>
      </Card>

      <Divider orientation="left">执行记录</Divider>
      <List
        dataSource={executionRecords}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space>
                  <span>{item.time}</span>
                  <Tag color={item.status === '已执行' ? 'green' : 'orange'}>
                    {item.status}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  <p>执行人：{item.executor}</p>
                  <p>执行内容：{item.content}</p>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: '暂无执行记录' }}
      />

      <Divider orientation="left">操作</Divider>
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>关闭</Button>
        <Button type="primary">编辑计划</Button>
        <Button danger>取消计划</Button>
      </Space>
    </Modal>
  );
};

export default PlanDetail;