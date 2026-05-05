import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import PondForm from './PondForm';

interface PondModalProps {
  visible: boolean;
  editingRecord?: any;
  selectedCategory: 'pond' | 'cage' | 'workboat';
  onCancel: () => void;
  onSuccess: (values: any) => void;
  title?: string;
}

const PondModal: React.FC<PondModalProps> = ({
  visible,
  editingRecord,
  selectedCategory,
  onCancel,
  onSuccess,
  title
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (editingRecord) {
        // 处理物联网节点数组转换为字符串，以及日期转换
        const formattedValues = {
          ...editingRecord,
          iotNodes: editingRecord.iotNodes ? editingRecord.iotNodes.join(', ') : '',
          stockingDate: editingRecord.stockingDate ? dayjs(editingRecord.stockingDate) : null,
        };
        form.setFieldsValue(formattedValues);
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 构建提交数据，包含所有数据库字段
      const submitData = {
        ...values,
        category: selectedCategory,
        // 日期处理
        stockingDate: values.stockingDate ? values.stockingDate.format('YYYY-MM-DD') : undefined,
        // 类别特定字段映射
        ...(selectedCategory === 'pond' && { 
          pondName: values.pondName,
          pondCode: values.pondCode,
          area: values.area,
          depthAvg: values.depthAvg,
          depthMax: values.depthMax,
          shapeType: values.shapeType,
          bottomType: values.bottomType,
          bottomSiltDepth: values.bottomSiltDepth,
          inletCount: values.inletCount,
          inletDiameter: values.inletDiameter,
          outletCount: values.outletCount,
          aerationType: values.aerationType,
          aerationPower: values.aerationPower,
          hasCirculating: values.hasCirculating,
          hasMonitoring: values.hasMonitoring,
          currentSpecies: values.currentSpecies,
          estimatedOutput: values.estimatedOutput,
        }),
        ...(selectedCategory === 'cage' && { 
          cageName: values.cageName,
          cageCode: values.cageCode,
          longitude: values.longitude,
          latitude: values.latitude,
          seaAreaName: values.seaAreaName,
          waterDepth: values.waterDepth,
          windResistance: values.windResistance,
          volume: values.volume,
          perimeter: values.perimeter,
          netBagDepth: values.netBagDepth,
          material: values.material,
        }),
        ...(selectedCategory === 'workboat' && { 
          vslName: values.vslName,
          vslCode: values.vslCode,
          mmsi: values.mmsi,
          lengthOverall: values.lengthOverall,
          width: values.width,
          depth: values.depth,
          grossTonnage: values.grossTonnage,
          deadweight: values.deadweight,
          maxSpeed: values.maxSpeed,
          breedingVolume: values.breedingVolume,
          productionCapacity: values.productionCapacity,
        }),
        status: values.status,
      };
      
      onSuccess(submitData);
      message.success(editingRecord ? '更新成功' : '添加成功');
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
      console.error('表单验证失败:', error);
    }
  };

  const getCategoryName = () => {
    const categoryMap = {
      pond: '塘口',
      cage: '网箱', 
      workboat: '工船'
    };
    return categoryMap[selectedCategory] || '塘口';
  };

  return (
    <Modal
      title={title || `${editingRecord ? '编辑' : '新增'}${getCategoryName()}信息`}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          {editingRecord ? '更新' : '创建'}
        </Button>,
      ]}
    >
      <PondForm
        form={form}
        selectedCategory={selectedCategory}
        editingRecord={editingRecord}
      />
    </Modal>
  );
};

export default PondModal;