import React from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface FeedingFormProps {
  form: FormInstance;
  type: 'pond' | 'cage' | 'workboat';
  initialValues?: any;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
}

const FeedingForm: React.FC<FeedingFormProps> = ({ 
  form, 
  type, 
  initialValues,
  onSubmit,
  onCancel 
}) => {
  
  // 根据类型显示不同的字段
  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'pond':
        return (
          <Form.Item
            name="area"
            label="面积(亩)"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber 
              placeholder="请输入面积" 
              min={0} 
              style={{ width: '100%' }}
            />
          </Form.Item>
        );
      
      case 'cage':
        return (
          <Form.Item
            name="cageNumber"
            label="网箱编号"
            rules={[{ required: true, message: '请输入网箱编号' }]}
          >
            <Input placeholder="请输入网箱编号" />
          </Form.Item>
        );
      
      case 'workboat':
        return (
          <>
            <Form.Item
              name="compartment"
              label="舱室"
              rules={[{ required: true, message: '请输入舱室' }]}
            >
              <Input placeholder="请输入舱室" />
            </Form.Item>
            <Form.Item
              name="tonnage"
              label="吨位(吨)"
              rules={[{ required: true, message: '请输入吨位' }]}
            >
              <InputNumber 
                placeholder="请输入吨位" 
                min={0} 
                style={{ width: '100%' }}
              />
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  // 获取分类名称
  const getCategoryName = () => {
    const categoryMap = {
      pond: '塘口',
      cage: '网箱', 
      workboat: '工船'
    };
    return categoryMap[type] || '塘口';
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        time: initialValues?.time ? dayjs(initialValues.time) : dayjs(),
      }}
      onFinish={onSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="time"
            label="投喂时间"
            rules={[{ required: true, message: '请选择投喂时间' }]}
          >
            <DatePicker 
              showTime 
              style={{ width: '100%' }}
              placeholder="请选择投喂时间"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label={`${getCategoryName()}编号`}
            rules={[{ required: true, message: `请输入${getCategoryName()}编号` }]}
          >
            <Input placeholder={`请输入${getCategoryName()}编号`} />
          </Form.Item>
        </Col>
      </Row>

      {/* 类型特定的字段 */}
      {renderTypeSpecificFields()}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="feedType"
            label="饲料类型"
            rules={[{ required: true, message: '请选择饲料类型' }]}
          >
            <Select placeholder="请选择饲料类型">
              <Option value="颗粒饲料">颗粒饲料</Option>
              <Option value="粉状饲料">粉状饲料</Option>
              <Option value="鲜活饵料">鲜活饵料</Option>
              <Option value="配合饲料">配合饲料</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="amount"
            label="投喂量(kg)"
            rules={[{ required: true, message: '请输入投喂量' }]}
          >
            <InputNumber 
              placeholder="请输入投喂量" 
              min={0} 
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="method"
            label="投喂方式"
            rules={[{ required: true, message: '请选择投喂方式' }]}
          >
            <Select placeholder="请选择投喂方式">
              <Option value="auto">智能投喂</Option>
              <Option value="manual">人工投喂</Option>
              <Option value="boat">船载投喂</Option>
              <Option value="other">其他方式</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="投喂状态"
            rules={[{ required: true, message: '请选择投喂状态' }]}
          >
            <Select placeholder="请选择投喂状态">
              <Option value="normal">正常</Option>
              <Option value="low">偏低</Option>
              <Option value="high">偏高</Option>
              <Option value="abnormal">异常</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="operator"
        label="操作人"
        rules={[{ required: true, message: '请输入操作人' }]}
      >
        <Input placeholder="请输入操作人" />
      </Form.Item>

      <Form.Item
        name="remarks"
        label="备注"
      >
        <TextArea 
          rows={3} 
          placeholder="请输入备注信息（可选）"
        />
      </Form.Item>
    </Form>
  );
};

export default FeedingForm;