import React from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface MedicineFormProps {
  form: FormInstance;
  type: 'pond' | 'cage' | 'workboat';
  initialValues?: any;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ 
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
            label="用药时间"
            rules={[{ required: true, message: '请选择用药时间' }]}
          >
            <DatePicker 
              showTime 
              style={{ width: '100%' }}
              placeholder="请选择用药时间"
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
            name="medicineType"
            label="药品类型"
            rules={[{ required: true, message: '请选择药品类型' }]}
          >
            <Select placeholder="请选择药品类型">
              <Option value="消毒剂">消毒剂</Option>
              <Option value="抗生素">抗生素</Option>
              <Option value="疫苗">疫苗</Option>
              <Option value="营养剂">营养剂</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="medicineName"
            label="药品名称"
            rules={[{ required: true, message: '请输入药品名称' }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dosage"
            label="用药剂量"
            rules={[{ required: true, message: '请输入用药剂量' }]}
          >
            <InputNumber 
              placeholder="请输入用药剂量" 
              min={0} 
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="unit"
            label="剂量单位"
            rules={[{ required: true, message: '请选择剂量单位' }]}
          >
            <Select placeholder="请选择剂量单位">
              <Option value="ml">毫升(ml)</Option>
              <Option value="g">克(g)</Option>
              <Option value="kg">千克(kg)</Option>
              <Option value="L">升(L)</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="method"
            label="用药方式"
            rules={[{ required: true, message: '请选择用药方式' }]}
          >
            <Select placeholder="请选择用药方式">
              <Option value="泼洒">泼洒</Option>
              <Option value="拌料">拌料</Option>
              <Option value="注射">注射</Option>
              <Option value="浸泡">浸泡</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="用药状态"
            rules={[{ required: true, message: '请选择用药状态' }]}
          >
            <Select placeholder="请选择用药状态">
              <Option value="normal">正常</Option>
              <Option value="warning">预警</Option>
              <Option value="abnormal">异常</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="reason"
        label="用药原因"
        rules={[{ required: true, message: '请输入用药原因' }]}
      >
        <Input placeholder="请输入用药原因" />
      </Form.Item>

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

export default MedicineForm;