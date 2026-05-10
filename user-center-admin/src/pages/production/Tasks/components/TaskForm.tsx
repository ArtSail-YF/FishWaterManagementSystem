import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;
const { TextArea } = Input;

const TARGET_TYPE_OPTIONS = [
  { value: 'pond', label: '塘口' },
  { value: 'cage', label: '网箱' },
  { value: 'vsl', label: '工船' },
];

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
  initialValues?: any;
  isEdit?: boolean;
  bases: Array<{ label: string; value: number }>;
  ponds: Array<{ label: string; value: number }>;
  users: Array<{ label: string; value: number }>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  isEdit,
  bases,
  ponds,
  users,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        actionTime: initialValues.actionTime ? new Date(initialValues.actionTime) : null,
        deadlineTime: initialValues.deadlineTime ? new Date(initialValues.deadlineTime) : null,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        actionTime: values.actionTime ? values.actionTime.format('YYYY-MM-DD HH:mm:ss') : null,
        deadlineTime: values.deadlineTime ? values.deadlineTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      await onOk(formattedValues);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑任务' : '新建任务'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={700}
      destroyOnClose
      okText="确定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="任务标题"
              name="taskTitle"
              rules={[{ required: true, message: '请输入任务标题' }]}
            >
              <Input placeholder="请输入任务标题" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="所属基地"
              name="baseId"
              rules={[{ required: true, message: '请选择所属基地' }]}
            >
              <Select placeholder="请选择所属基地">
                {bases.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="来源计划ID"
              name="planId"
            >
              <Input type="number" placeholder="可选，关联的计划ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="目标类型"
              name="targetType"
              rules={[{ required: true, message: '请选择目标类型' }]}
            >
              <Select placeholder="请选择目标类型">
                {TARGET_TYPE_OPTIONS.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="目标ID"
              name="targetId"
              rules={[{ required: true, message: '请选择目标' }]}
            >
              <Select placeholder="请先选择基地" disabled={!form.getFieldValue('baseId')}>
                {ponds.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="要求执行时间"
              name="actionTime"
              rules={[{ required: true, message: '请选择要求执行时间' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="请选择要求执行时间"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="最晚完成时间"
              name="deadlineTime"
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="请选择最晚完成时间"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="执行人"
              name="assigneeId"
              rules={[{ required: true, message: '请选择执行人' }]}
            >
              <Select placeholder="请选择执行人">
                {users.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="取消/跳过原因"
              name="cancelReason"
            >
              <TextArea
                rows={3}
                placeholder="请输入取消或跳过原因（选填）"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TaskForm;
