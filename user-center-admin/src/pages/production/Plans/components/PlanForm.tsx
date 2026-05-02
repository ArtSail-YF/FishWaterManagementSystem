import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Space,
  message,
} from 'antd';

const { TextArea } = Input;
import type { FormInstance } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 计划类型选项
const planTypes = [
  '放苗计划',
  '投喂计划',
  '用药计划',
  '换水/增氧计划',
  '收获计划',
  '深远海 – 工船作业计划',
  '深远海 – 网箱维护计划',
  '深远海 – 捕捞计划',
];

// 模拟塘口数据
const ponds = [
  { id: '1', name: '1号塘' },
  { id: '2', name: '2号塘' },
  { id: '3', name: '3号塘' },
  { id: '4', name: '4号塘' },
  { id: '5', name: '5号塘' },
  { id: '6', name: '6号塘' },
];

interface PlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
  isEdit?: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  isEdit = false,
}) => {
  const [form] = Form.useForm();

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 处理塘口数据
      const selectedPonds = values.ponds || [];
      const pondIds = selectedPonds.map((p: any) => p.id).join(',');
      const pondNames = selectedPonds.map((p: any) => p.name).join(', ');

      // 处理时间范围
      const [startTime, endTime] = values.timeRange || [];

      // 构建提交数据
      const submitData = {
        ...values,
        pondId: pondIds,
        pondNames: pondNames,
        startTime: startTime ? startTime.format('YYYY-MM-DD') : '',
        endTime: endTime ? endTime.format('YYYY-MM-DD') : '',
      };

      // 移除不需要的字段
      delete submitData.ponds;
      delete submitData.timeRange;

      onOk(submitData);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 处理计划类型变化
  const handlePlanTypeChange = (value: string) => {
    form.setFieldsValue({ content: '' });
  };

  return (
    <Modal
      title={isEdit ? '编辑计划' : '新建计划'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="planType"
          label="计划类型"
          rules={[{ required: true, message: '请选择计划类型' }]}
        >
          <Select
            placeholder="请选择计划类型"
            onChange={handlePlanTypeChange}
            style={{ width: '100%' }}
          >
            {planTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="planName"
          label="计划名称"
          rules={[{ required: true, message: '请输入计划名称' }]}
        >
          <Input placeholder="请输入计划名称" />
        </Form.Item>

        <Form.Item
          name="ponds"
          label="关联塘口"
          rules={[{ required: true, message: '请选择关联塘口' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择关联塘口"
            style={{ width: '100%' }}
            optionLabelProp="label"
          >
            {ponds.map(pond => (
              <Option key={pond.id} value={pond} label={pond.name}>
                {pond.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="timeRange"
          label="计划时间"
          rules={[{ required: true, message: '请选择计划时间' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="content"
          label="计划内容"
          rules={[{ required: true, message: '请输入计划内容' }]}
        >
          <TextArea
            rows={4}
            placeholder="请输入计划详细内容"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="备注"
        >
          <TextArea
            rows={2}
            placeholder="请输入备注信息"
          />
        </Form.Item>

        <Form.Item
          name="needApproval"
          valuePropName="checked"
        >
          <Checkbox>需要审批</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanForm;