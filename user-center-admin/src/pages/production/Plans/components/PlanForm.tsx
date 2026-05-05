import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  InputNumber,
  Row,
  Col,
  Divider,
} from 'antd';
import { getBaseOptions } from '@/services/api/base';

const { TextArea } = Input;

const { Option } = Select;
const { RangePicker } = DatePicker;

const PLAN_TYPES = [
  { value: 'seeding', label: '放苗计划' },
  { value: 'feeding', label: '投喂计划' },
  { value: 'medication', label: '用药计划' },
  { value: 'water_change', label: '换水/增氧计划' },
  { value: 'harvest', label: '收获计划' },
  { value: 'maintenance', label: '维护计划' },
];

const TARGET_TYPES = [
  { value: 'pond', label: '塘口' },
  { value: 'cage', label: '网箱' },
  { value: 'vsl', label: '工船' },
];

interface PlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
  isEdit?: boolean;
  bases?: Array<{ label: string; value: number }>;
}

const PlanForm: React.FC<PlanFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  isEdit = false,
  bases = [],
}) => {
  const [form] = Form.useForm();
  const [planType, setPlanType] = useState<string>('');

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setPlanType(initialValues.planType);
    } else if (visible) {
      form.resetFields();
      setPlanType('');
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const [startTime, endTime] = values.timeRange || [];
      
      const submitData = {
        ...values,
        startTime: startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      
      delete submitData.timeRange;
      onOk(submitData);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  return (
    <Modal
      title={isEdit ? '编辑计划' : '新建计划'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={900}
      destroyOnClose
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
              <Select placeholder="请选择基地">
                {bases.map(base => (
                  <Option key={base.value} value={base.value}>
                    {base.label}
                  </Option>
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
                placeholder="请选择计划类型"
                onChange={(value) => setPlanType(value)}
              >
                {PLAN_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
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
              <Select placeholder="请选择">
                {TARGET_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="targetId"
              label="目标实体ID"
              rules={[{ required: true, message: '请输入目标实体ID' }]}
            >
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="cycleRule"
              label="循环规则"
            >
              <Input placeholder="如: Every Monday，为空则为一次性计划" />
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
              name="ownerId"
              label="制定人ID"
            >
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="assigneeGroupId"
              label="指派班组/角色ID"
            >
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">计划详情</Divider>

        {(planType === 'feeding' || planType === 'seeding') && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="feedAmount"
                label="计划投喂量(kg)"
              >
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="feedVariety"
                label="饲料品种"
              >
                <Input placeholder="请输入饲料品种" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {planType === 'medication' && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="drugName"
                label="药品名称"
              >
                <Input placeholder="请输入药品名称" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="dosage"
                label="用量"
              >
                <Input placeholder="请输入用量" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="withdrawalDays"
                label="休药期天数"
              >
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {planType === 'harvest' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="estYield"
                label="预计产量"
              >
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="longitude"
              label="作业海域经度"
            >
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="latitude"
              label="作业海域纬度"
            >
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="weatherReq"
              label="气象要求"
            >
              <Input placeholder="如: 风力<5级" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PlanForm;