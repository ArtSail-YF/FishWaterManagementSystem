import dayjs from 'dayjs';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Divider,
  message,
} from 'antd';
import { getPondOptions } from '@/services/api/pond';
import { createPlan, updatePlan } from '@/services/api/production/plan';
import type { ProductionPlan } from '@/types/model';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const PLAN_TYPES = [
  { value: 'feeding', label: '投喂计划' },
  { value: 'medication', label: '用药计划' },
  { value: 'harvest', label: '收获计划' },
  { value: 'maintenance', label: '维护计划' },
  { value: 'seeding', label: '放苗计划' },
  { value: 'water_change', label: '换水/增氧计划' },
];

const TARGET_TYPES = [
  { value: 'pond', label: '塘口' },
  { value: 'cage', label: '网箱' },
  { value: 'vsl', label: '工船' },
];

interface PlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Partial<ProductionPlan>) => void;
  initialValues?: ProductionPlan;
  isEdit?: boolean;
  bases?: Array<{ label: string; value: number }>;
  ponds?: Array<{ label: string; value: number }>;
}

const PlanForm: React.FC<PlanFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  isEdit = false,
  bases = [],
  ponds = [],
}) => {
  const [form] = Form.useForm();
  const [planType, setPlanType] = useState<string>('');
  const [targetType, setTargetType] = useState<string>('');
  const [baseId, setBaseId] = useState<number | undefined>();
  const [targetPonds, setTargetPonds] = useState<Array<{ label: string; value: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        timeRange: initialValues.startTime && initialValues.endTime
          ? [dayjs(initialValues.startTime), dayjs(initialValues.endTime)]
          : undefined,
      });
      setPlanType(initialValues.planType || '');
      setTargetType(initialValues.targetType || '');
      setBaseId(initialValues.baseId);
      if (initialValues.baseId) {
        loadPonds(initialValues.baseId);
      }
    } else if (visible) {
      form.resetFields();
      setPlanType('');
      setTargetType('');
      setBaseId(undefined);
      setTargetPonds([]);
    }
  }, [visible, initialValues, form]);

  const loadPonds = useCallback(async (bId: number) => {
    try {
      const options = await getPondOptions(bId);
      setTargetPonds(options);
    } catch (error) {
      console.error('获取塘口列表失败:', error);
    }
  }, []);

  const handleBaseChange = (value: number) => {
    setBaseId(value);
    form.setFieldValue('targetId', undefined);
    loadPonds(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const [startTime, endTime] = values.timeRange || [];

      const submitData: Partial<ProductionPlan> = {
        baseId: values.baseId,
        planType: values.planType,
        targetType: values.targetType,
        targetId: values.targetId,
        title: values.title,
        contentDesc: values.contentDesc,
        startTime: startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        cycleRule: values.cycleRule,
        assigneeGroupId: values.assigneeGroupId,
        feedVariety: values.feedVariety,
        feedAmount: values.feedAmount ? Number(values.feedAmount) : undefined,
        drugName: values.drugName,
        dosage: values.dosage,
        withdrawalDays: values.withdrawalDays ? Number(values.withdrawalDays) : undefined,
        weatherReq: values.weatherReq,
        estYield: values.estYield ? Number(values.estYield) : undefined,
      };

      if (isEdit && initialValues?.id) {
        await updatePlan(initialValues.id, submitData);
        message.success('计划更新成功');
      } else {
        await createPlan(submitData as any);
        message.success('计划创建成功');
      }

      onOk(submitData);
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑计划' : '新建计划'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Divider orientation="left">基本信息</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="baseId"
              label="所属基地"
              rules={[{ required: true, message: '请选择所属基地' }]}
            >
              <Select
                placeholder="请选择基地"
                onChange={handleBaseChange}
              >
                {bases.map(base => (
                  <Select.Option key={base.value} value={base.value}>
                    {base.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="planType"
              label="计划类型"
              rules={[{ required: true, message: '请选择计划类型' }]}
            >
              <Select
                placeholder="请选择"
                onChange={(value) => setPlanType(value)}
              >
                {PLAN_TYPES.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="title"
          label="计划标题"
          rules={[{ required: true, message: '请输入计划标题' }]}
        >
          <Input placeholder="请输入计划标题" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="targetType"
              label="目标类型"
              rules={[{ required: true, message: '请选择目标类型' }]}
            >
              <Select
                placeholder="请选择"
                onChange={(value) => setTargetType(value)}
              >
                {TARGET_TYPES.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="targetId"
              label="目标"
              rules={[{ required: true, message: '请选择目标' }]}
            >
              <Select
                placeholder="请先选择基地"
                disabled={!baseId}
              >
                {targetPonds.map(pond => (
                  <Select.Option key={pond.value} value={pond.value}>
                    {pond.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="cycleRule"
              label="循环规则"
            >
              <Input placeholder="如: Every Monday" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="timeRange"
          label="计划时间"
          rules={[{ required: true, message: '请选择计划时间' }]}
        >
          <RangePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="contentDesc"
          label="详细描述/操作指南"
        >
          <TextArea rows={3} placeholder="请输入计划详细描述和操作指南" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="assigneeGroupId"
              label="指派班组"
            >
              <Input placeholder="请输入指派的班组ID" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">计划详情</Divider>

        {(planType === 'feeding' || planType === 'seeding') && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="feedAmount" label="计划投喂量(kg)">
                <Input type="number" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="feedVariety" label="饲料品种">
                <Input placeholder="请输入饲料品种" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {planType === 'medication' && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="drugName" label="药品名称">
                <Input placeholder="请输入药品名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dosage" label="用量">
                <Input placeholder="请输入用量" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="withdrawalDays" label="休药期天数">
                <Input type="number" placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {planType === 'harvest' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="estYield" label="预计产量">
                <Input type="number" placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default PlanForm;
