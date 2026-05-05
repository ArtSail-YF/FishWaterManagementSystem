import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, DatePicker } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { getBaseOptions } from '@/services/api/base';

const { Option } = Select;
const { TextArea } = Input;

interface PondFormProps {
  form: FormInstance;
  selectedCategory: 'pond' | 'cage' | 'workboat';
  editingRecord?: any;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
}

const PondForm: React.FC<PondFormProps> = ({ 
  form, 
  selectedCategory, 
  editingRecord,
  onSubmit,
  onCancel 
}) => {
  const [bases, setBases] = useState<any[]>([]);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const baseOptions = await getBaseOptions();
        setBases(baseOptions);
      } catch (error) {
        console.error('获取基地列表失败:', error);
      }
    };
    fetchBases();
  }, []);
  
  const getCategoryName = () => {
    switch (selectedCategory) {
      case 'pond': return '塘口';
      case 'cage': return '网箱';
      case 'workboat': return '工船';
      default: return '塘口';
    }
  };

  const renderBaseOptions = () => {
    return bases.map(base => (
      <Option key={base.key} value={base.value}>
        {base.label}
      </Option>
    ));
  };

  const renderPondFields = () => (
    <>
      <div style={{ fontWeight: 'bold', marginBottom: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        基础身份信息
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="pondName" label="塘口名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="pondCode" label="塘口编号" rules={[{ required: true }]}>
            <Input placeholder="请输入编号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="baseId" label="所属基地" rules={[{ required: true }]}>
            <Select placeholder="请选择基地">
              {renderBaseOptions()}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        物理规格
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="area" label="水面面积(亩)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="depthAvg" label="平均水深(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="depthMax" label="最大水深(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="shapeType" label="形状类型">
            <Select placeholder="请选择形状">
              <Option value="圆形">圆形</Option>
              <Option value="矩形">矩形</Option>
              <Option value="不规则">不规则</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="bottomType" label="底质类型">
            <Input placeholder="如：泥底、沙底" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="bottomSiltDepth" label="底泥深度(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        设备与智能化
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="aerationType" label="增氧设备类型">
            <Select placeholder="请选择类型">
              <Option value="罗茨风机">罗茨风机</Option>
              <Option value="叶轮式">叶轮式</Option>
              <Option value="纳米管">纳米管</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="aerationPower" label="增氧总功率(kW)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="hasMonitoring" label="监控设备">
            <Select>
              <Option value={1}>有</Option>
              <Option value={0}>无</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="currentSpecies" label="当前品种">
            <Input placeholder="如：南美白对虾" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="ENABLED">养殖中</Option>
              <Option value="DISABLED">空闲</Option>
              <Option value="MAINTENANCE">清塘中</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderCageFields = () => (
    <>
      <div style={{ fontWeight: 'bold', marginBottom: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        基础身份信息
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="cageName" label="网箱名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="cageCode" label="网箱编号" rules={[{ required: true }]}>
            <Input placeholder="请输入编号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="baseId" label="所属基地" rules={[{ required: true }]}>
            <Select placeholder="请选择基地">
              {renderBaseOptions()}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        位置与环境
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="longitude" label="经度">
            <InputNumber style={{ width: '100%' }} step={0.000001} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="latitude" label="纬度">
            <InputNumber style={{ width: '100%' }} step={0.000001} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="seaAreaName" label="海域名称">
            <Input placeholder="请输入海域名称" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="waterDepth" label="海域水深(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="windResistance" label="抗风等级">
            <InputNumber style={{ width: '100%' }} min={0} max={16} />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        规格与材质
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="volume" label="有效容积(m³)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="perimeter" label="周长/边长(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="netBagDepth" label="网囊深度(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="material" label="框架材质">
            <Select placeholder="请选择材质">
              <Option value="HDPE">HDPE</Option>
              <Option value="钢制">钢制</Option>
              <Option value="木制">木制</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="ENABLED">养殖中</Option>
              <Option value="DISABLED">空闲</Option>
              <Option value="MAINTENANCE">维修中</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const renderWorkboatFields = () => (
    <>
      <div style={{ fontWeight: 'bold', marginBottom: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        基础身份信息
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="vslName" label="工船名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vslCode" label="工船编号" rules={[{ required: true }]}>
            <Input placeholder="请输入编号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="mmsi" label="MMSI码">
            <Input placeholder="请输入MMSI码" />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        船舶参数
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="lengthOverall" label="总长(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="width" label="型宽(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="depth" label="型深(m)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="grossTonnage" label="总吨位">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="deadweight" label="载重吨">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="maxSpeed" label="最大航速(kn)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderLeft: '4px solid #1890ff', paddingLeft: 8 }}>
        生产能力
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="breedingVolume" label="养殖水体(m³)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="productionCapacity" label="日加工量(t)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="ENABLED">作业中</Option>
              <Option value="DISABLED">停泊中</Option>
              <Option value="MAINTENANCE">维修中</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      {selectedCategory === 'pond' && renderPondFields()}
      {selectedCategory === 'cage' && renderCageFields()}
      {selectedCategory === 'workboat' && renderWorkboatFields()}
    </Form>
  );
};

export default PondForm;