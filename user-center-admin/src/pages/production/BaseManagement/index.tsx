import React, { useState, useRef } from 'react';
import { Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { createBase, updateBase, deleteBase } from '@/services/api/base';
import BaseManagementStats from './components/BaseManagementStats';
import BaseTable from './components/BaseTable';
import BaseForm from './components/BaseForm';

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
  status: number | string;
  createTime: string;
  name?: string; // 兼容字段
  code?: string; // 兼容字段
}

const BaseManagement: React.FC = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBase, setEditingBase] = useState<BaseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<BaseInfo[]>([]);

  const handleAdd = () => {
    setEditingBase(null);
    setModalVisible(true);
  };

  const handleEdit = (record: BaseInfo) => {
    setEditingBase(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: BaseInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除基地"${record.name}"吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          const response = await deleteBase(record.id);
          if (response.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const submitData = {
        ...values,
        // 确保状态值为数字
        status: typeof values.status === 'number' ? values.status : (values.status === 'active' ? 1 : 0),
      };

      if (editingBase) {
        // 更新基地
        const response = await updateBase(editingBase.id, submitData);
        
        if (response.code === 200) {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        // 创建基地
        const response = await createBase(submitData);
        
        if (response.code === 200) {
          message.success('添加成功');
        } else {
          message.error(response.message || '添加失败');
          return;
        }
      }
      
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (data: BaseInfo[]) => {
    setTableData(data);
  };

  return (
    <PageContainer>
      <BaseManagementStats data={tableData} />
      
      <BaseTable
        actionRef={actionRef}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDataChange={handleDataChange}
      />

      <BaseForm
        visible={modalVisible}
        editingBase={editingBase}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default BaseManagement;