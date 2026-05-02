import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Space,
} from 'antd';

const { TextArea } = Input;

const { Option } = Select;
const { RangePicker } = DatePicker;

// 计划类型选项
const planTypes = [
  '放苗计划',
  '投喂计划',
  '用药计划',
  '换水/增氧计划',
  '收获计划',
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

interface BatchPlanModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const BatchPlanModal: React.FC<BatchPlanModalProps> = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="批量创建计划"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="planType"
          label="计划类型"
          rules={[{ required: true, message: '请选择计划类型' }]}
        >
          <Select
            placeholder="请选择计划类型"
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
          label="选择塘口"
          rules={[{ required: true, message: '请选择塘口' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择塘口"
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

export default BatchPlanModal;