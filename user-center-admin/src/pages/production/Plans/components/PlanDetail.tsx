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
import type { ProductionPlan } from '@/types/model';

const PLAN_TYPE_MAP: Record<string, string> = {
  feeding: '投喂计划',
  medication: '用药计划',
  harvest: '收获计划',
  maintenance: '维护计划',
  seeding: '放苗计划',
  water_change: '换水/增氧计划',
};

const TARGET_TYPE_MAP: Record<string, string> = {
  pond: '塘口',
  cage: '网箱',
  vsl: '工船',
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'blue' },
  published: { label: '已发布', color: 'cyan' },
  active: { label: '执行中', color: 'orange' },
  completed: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'gray' },
};

interface PlanDetailProps {
  visible: boolean;
  onCancel: () => void;
  plan: ProductionPlan | null;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ visible, onCancel, plan }) => {
  if (!plan) return null;

  const statusConfig = STATUS_MAP[plan.status || ''] || { label: plan.status, color: 'default' };

  const executionRecords = plan.id ? [
    {
      id: '1',
      time: '2026-04-18 08:00',
      executor: '张三',
      content: '完成第一次投喂，投喂量50kg',
      status: '已执行',
    },
  ] : [];

  return (
    <Modal
      title="计划详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="计划标题">{plan.title || '-'}</Descriptions.Item>
        <Descriptions.Item label="计划类型">
          {PLAN_TYPE_MAP[plan.planType || ''] || plan.planType || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="目标类型">
          {TARGET_TYPE_MAP[plan.targetType || ''] || plan.targetType || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="目标ID">{plan.targetId || '-'}</Descriptions.Item>
        <Descriptions.Item label="计划时间">
          {plan.startTime ? `${plan.startTime} ~ ${plan.endTime || '-'}` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="循环规则">{plan.cycleRule || '一次性计划'}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="指派班组ID">{plan.assigneeGroupId || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{plan.createTime || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">详细描述</Divider>
      <Card style={{ marginBottom: 16 }}>
        <p>{plan.contentDesc || '暂无详细描述'}</p>
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
