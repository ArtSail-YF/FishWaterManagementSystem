import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, InputNumber, Divider, Switch } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface BaseInfo {
  id: number;
  baseCode: string;
  baseName: string;
  breederId: number;
  deptId: number;
  address: string;
  longitude: number;
  latitude: number;
  totalArea: number;
  waterArea: number;
  waterSource: string;
  waterQualityGrade: string;
  soilType: string;
  phValue: number;
  powerSupply: string;
  transformerCapacity: number;
  roadCondition: string;
  drainageSystem: string;
  isPollutionFree: number;
  taiwanCooperation: number;
  greenCertification: string;
  certificationImg: string;
  deepSeaCertified: number;
  seaAreaLicense: string;
  environmentalAssessment: string;
  remark: string;
  status: number;
}

interface BaseFormProps {
  visible: boolean;
  editingBase?: any;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const BaseForm: React.FC<BaseFormProps> = ({
  visible,
  editingBase,
  loading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (editingBase) {
        // 处理映射
        const formattedValues = {
          ...editingBase,
          status: editingBase.status === 'active' ? 1 : editingBase.status === 'inactive' ? 0 : editingBase.status,
          isPollutionFree: editingBase.isPollutionFree === 1,
          taiwanCooperation: editingBase.taiwanCooperation === 1,
          deepSeaCertified: editingBase.deepSeaCertified === 1,
        };
        form.setFieldsValue(formattedValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingBase, form]);

  const handleSubmit = (values: any) => {
    // 转换回数值
    const submitValues = {
      ...values,
      isPollutionFree: values.isPollutionFree ? 1 : 0,
      taiwanCooperation: values.taiwanCooperation ? 1 : 0,
      deepSeaCertified: values.deepSeaCertified ? 1 : 0,
    };
    onSubmit(submitValues);
  };

  return (
    <Modal
      title={editingBase ? '编辑基地档案' : '新建基地档案'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 1 }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 16, borderLeft: '4px solid #1f2937', paddingLeft: 8 }}>
          基础身份信息
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="baseName" label="基地名称" rules={[{ required: true }]}>
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="baseCode" label="基地编号" rules={[{ required: true }]}>
              <Input placeholder="请输入编号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="运营状态" rules={[{ required: true }]}>
              <Select>
                <Option value={1}>运营中</Option>
                <Option value={0}>停用</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1f2937', paddingLeft: 8 }}>
          地理位置
        </div>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="address" label="详细地址" rules={[{ required: true }]}>
              <Input placeholder="请输入详细地址" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="longitude" label="经度">
              <InputNumber style={{ width: '100%' }} step={0.000001} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="latitude" label="纬度">
              <InputNumber style={{ width: '100%' }} step={0.000001} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1f2937', paddingLeft: 8 }}>
          环境与水质
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="totalArea" label="总面积(亩)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="waterArea" label="水面面积(亩)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="waterSource" label="水源">
              <Input placeholder="如：水库、地下水" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="waterQualityGrade" label="水质等级">
              <Select placeholder="请选择">
                <Option value="I类">I类</Option>
                <Option value="II类">II类</Option>
                <Option value="III类">III类</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phValue" label="PH值">
              <InputNumber style={{ width: '100%' }} step={0.1} min={0} max={14} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="soilType" label="底质类型">
              <Input placeholder="如：粘土、沙质" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1f2937', paddingLeft: 8 }}>
          基础设施
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="powerSupply" label="供电情况">
              <Input placeholder="如：双路供电" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="transformerCapacity" label="变压器容量(kVA)">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="roadCondition" label="路况条件">
              <Input placeholder="如：水泥路直达" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1f2937', paddingLeft: 8 }}>
          认证与许可
        </div>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="isPollutionFree" label="无公害认证" valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="taiwanCooperation" label="闽台合作" valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="deepSeaCertified" label="深远海认证" valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="greenCertification" label="绿色认证等级">
              <Input placeholder="如：A级" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="seaAreaLicense" label="海域使用证">
              <Input placeholder="证号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="environmentalAssessment" label="环评批复">
              <Input placeholder="文号" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        
        <Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确定保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseForm;