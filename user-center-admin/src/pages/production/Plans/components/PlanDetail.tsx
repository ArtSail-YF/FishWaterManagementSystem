import React, { useState, useEffect } from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  List,
  Card,
  Timeline,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import type { ProductionPlan } from '@/types/model';
import { getApprovalRecords } from '@/services/api/production/plan';
import type { ApprovalRecord } from '@/types/api/plan';

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
  pending_approval: { label: '待审批', color: 'warning' },
  approved: { label: '已审批', color: 'cyan' },
  rejected: { label: '已驳回', color: 'red' },
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
  const [approvalRecords, setApprovalRecords] = useState<ApprovalRecord[]>([]);

  // 获取审批记录中操作人的名称
  const getActorName = (record: ApprovalRecord) => {
    if (record.action === 'submit') return plan?.submitterName || '提交人';
    if (record.action === 'approve') return plan?.approverName || '审批人';
    if (record.action === 'reject') return plan?.approverName || '审批人';
    return '-';
  };

  useEffect(() => {
    if (visible && plan?.id) {
      fetchApprovalRecords(plan.id);
    } else {
      setApprovalRecords([]);
    }
  }, [visible, plan?.id]);

  const fetchApprovalRecords = async (planId: number) => {
    try {
      const res = await getApprovalRecords(planId);
      if (res.data) {
        setApprovalRecords(res.data);
      }
    } catch {
      // ignore
    }
  };

  if (!plan) return null;

  const statusConfig = STATUS_MAP[plan.status || ''] || { label: plan.status, color: 'default' };

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
        <Descriptions.Item label="作业对象">{plan.targetName || plan.targetId || '-'}</Descriptions.Item>
        <Descriptions.Item label="计划时间">
          {plan.startTime ? `${plan.startTime} ~ ${plan.endTime || '-'}` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="循环规则">{plan.cycleRule || '一次性计划'}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="制定人">{plan.submitterName || plan.ownerId || '-'}</Descriptions.Item>
        <Descriptions.Item label="指派班组">{plan.assigneeGroupId || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{plan.createTime || '-'}</Descriptions.Item>
        {plan.approveTime && (
          <Descriptions.Item label="审批时间">{plan.approveTime}</Descriptions.Item>
        )}
        {plan.approverName && (
          <Descriptions.Item label="审批人">{plan.approverName}</Descriptions.Item>
        )}
        {plan.approveComment && (
          <Descriptions.Item label="审批意见">{plan.approveComment}</Descriptions.Item>
        )}
      </Descriptions>

      <Divider orientation="left">审批记录</Divider>
      {approvalRecords.length > 0 ? (
        <Timeline
          items={approvalRecords.map((r) => {
            let color = 'gray';
            let icon = <ClockCircleOutlined />;
            if (r.action === 'submit') {
              color = 'blue';
              icon = <SendOutlined />;
            } else if (r.action === 'approve') {
              color = 'green';
              icon = <CheckCircleOutlined />;
            } else if (r.action === 'reject') {
              color = 'red';
              icon = <CloseCircleOutlined />;
            }
            const actionLabels: Record<string, string> = {
              submit: '提交审批',
              approve: '审批通过',
              reject: '驳回',
            };
            return {
              color,
              dot: icon,
              children: (
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {actionLabels[r.action] || r.action}
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {r.actionTime}
  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
    {getActorName(r)}
  </div>
                    {r.comment ? ` - ${r.comment}` : ''}
                  </div>
                </div>
              ),
            };
          })}
        />
      ) : (
        <Card>
          <p style={{ color: '#8c8c8c', textAlign: 'center' }}>暂无审批记录</p>
        </Card>
      )}

      <Divider orientation="left">详细描述</Divider>
      <Card style={{ marginBottom: 16 }}>
        <p>{plan.contentDesc || '暂无详细描述'}</p>
      </Card>

      <Divider orientation="left">操作</Divider>
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>关闭</Button>
      </Space>
    </Modal>
  );
};

export default PlanDetail;
