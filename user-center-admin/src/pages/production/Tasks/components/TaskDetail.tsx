import React from 'react';
import { Modal, Descriptions, Tag, Divider, Card } from 'antd';
import { ClockCircleOutlined, UserOutlined, DatabaseOutlined, CloudOutlined, FileTextOutlined } from '@ant-design/icons';

const STATUS_MAP: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: '待办', bgColor: '#EBE5DE', textColor: '#5C4F42' },
  assigned: { label: '已派发', bgColor: '#E1EEF4', textColor: '#2B6B8A' },
  doing: { label: '进行中', bgColor: '#F5EDD6', textColor: '#A0843A' },
  done: { label: '已完成', bgColor: '#E2EDD8', textColor: '#5B8C5A' },
  skipped: { label: '已跳过', bgColor: '#EBE5DE', textColor: '#7A6E64' },
  expired: { label: '已过期', bgColor: '#F5E0DC', textColor: '#B54E3C' },
};

const PRIORITY_MAP: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
};

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

const DEVICE_ACTION_MAP: Record<string, string> = {
  read: '读取数据',
  on: '开启',
  off: '关闭',
  set: '设置参数',
};

interface TaskDetailProps {
  visible: boolean;
  onCancel: () => void;
  task: any;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ visible, onCancel, task }) => {
  if (!task) return null;

  const statusConfig = STATUS_MAP[task.status] || { label: task.status, bgColor: '#f0f0f0', textColor: '#666' };
  const targetLabel = TARGET_TYPE_MAP[task.targetType] || task.targetType || '目标';

  return (
    <Modal title="任务详情" open={visible} onCancel={onCancel} footer={null} width={700} destroyOnClose>
      <Card size="small" style={{ marginBottom: 16, background: '#F7F3EF' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label={<><FileTextOutlined style={{ marginRight: 4 }} />任务标题</>}>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>{task.taskTitle}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="任务ID">{task.id}</Descriptions.Item>
        <Descriptions.Item label="来源计划">{task.planTitle || (task.planId ? `计划 #${task.planId}` : '手动创建')}</Descriptions.Item>
        <Descriptions.Item label="计划类型">{PLAN_TYPE_MAP[task.planType] || task.planType || '-'}</Descriptions.Item>
        <Descriptions.Item label="所属基地">{task.baseName || task.baseId || '-'}</Descriptions.Item>
        <Descriptions.Item label="作业对象">{task.targetName || `${targetLabel} #${task.targetId || ''}`}</Descriptions.Item>
        <Descriptions.Item label="任务状态">
          <Tag style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.textColor, border: 'none' }}>{statusConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="执行人">
          <UserOutlined style={{ marginRight: 4 }} />{task.assigneeName || task.assigneeId || '未分配'}
        </Descriptions.Item>
        <Descriptions.Item label="要求执行时间">
          <ClockCircleOutlined style={{ marginRight: 4 }} />{task.actionTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="最晚完成时间">
          <ClockCircleOutlined style={{ marginRight: 4 }} />{task.deadlineTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="优先级">{PRIORITY_MAP[task.priority] || task.priority || '-'}</Descriptions.Item>
        <Descriptions.Item label="操作说明">{task.contentDesc || '-'}</Descriptions.Item>
        <Descriptions.Item label="IoT 设备">
          {task.deviceId ? (
            <><CloudOutlined style={{ marginRight: 4 }} />{task.deviceName || `设备 #${task.deviceId}`}{task.deviceAction ? ` (${DEVICE_ACTION_MAP[task.deviceAction] || task.deviceAction})` : ''}</>
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="操作指令">
          {task.deviceAction ? (DEVICE_ACTION_MAP[task.deviceAction] || task.deviceAction) : '-'}
        </Descriptions.Item>
        {task.cancelReason && (
          <Descriptions.Item label="取消/跳过原因" span={2}>{task.cancelReason}</Descriptions.Item>
        )}
        {task.contentDesc && (
          <Descriptions.Item label="操作指南" span={2}>
            <div style={{ background: '#FFF7E6', padding: '8px 12px', borderRadius: 4, lineHeight: 1.6 }}>{task.contentDesc}</div>
          </Descriptions.Item>
        )}
        {(task.feedVariety || task.feedAmount) && (
          <>
            <Descriptions.Item label="饲料品种">{task.feedVariety || '-'}</Descriptions.Item>
            <Descriptions.Item label="投喂量">{task.feedAmount ? task.feedAmount + ' kg' : '-'}</Descriptions.Item>
          </>
        )}
        {(task.drugName || task.dosage) && (
          <>
            <Descriptions.Item label="药品名称">{task.drugName || '-'}</Descriptions.Item>
            <Descriptions.Item label="用量">{task.dosage || '-'}</Descriptions.Item>
          </>
        )}
        {task.withdrawalDays && (
          <Descriptions.Item label="休药期">{task.withdrawalDays} 天</Descriptions.Item>
        )}
        {task.weatherReq && (
          <Descriptions.Item label="气象要求">{task.weatherReq}</Descriptions.Item>
        )}
        {task.estYield && (
          <Descriptions.Item label="预计产量">{task.estYield} kg</Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '16px 0' }} />
      <Descriptions column={2} size="small">
        <Descriptions.Item label={<><DatabaseOutlined style={{ marginRight: 4 }} />创建时间</>}>
          {task.createTime || task.createdAt || '-'}
        </Descriptions.Item>
        {(task.updateTime || task.updatedAt) && (
          <Descriptions.Item label="更新时间">{task.updateTime || task.updatedAt}</Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default TaskDetail;
