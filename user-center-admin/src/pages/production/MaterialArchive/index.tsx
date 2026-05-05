import React, { useState, useRef } from 'react';
import { Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { createMaterial, updateMaterial, deleteMaterial } from '@/services/api/material/info';
import { getCategoryList, type MatCategory } from '@/services/api/material/category';
import MaterialTable from './components/MaterialTable';
import MaterialForm from './components/MaterialForm';

interface MaterialInfo {
  id: number;
  matCode: string;
  matName: string;
  catId: number;
  spec: string;
  unit: string;
  supplierId: number;
  minStock: number;
  maxStock: number;
  status: number;
  withdrawalDays: number;
  unitPrice: number;
  approvalCode: string;
  manufacturer: string;
  createTime: string;
}

const MaterialArchive: React.FC = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<MaterialInfo[]>([]);
  const [categories, setCategories] = useState<MatCategory[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await getCategoryList();
      const list = res.data?.records || res.data || [];
      const cats = Array.isArray(list) ? list : [];
      console.log('分类数据:', cats);
      setCategories(cats);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingMaterial(null);
    setModalVisible(true);
  };

  const handleEdit = (record: MaterialInfo) => {
    setEditingMaterial(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: MaterialInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除物资"${record.matName}"吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          const response = await deleteMaterial(record.id);
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
        status: typeof values.status === 'number' ? values.status : (values.status === '1' ? 1 : 0),
      };

      if (editingMaterial) {
        const response = await updateMaterial(editingMaterial.id, submitData);
        if (response.code === 200) {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createMaterial(submitData);
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

  const handleDataChange = (data: MaterialInfo[]) => {
    setTableData(data);
  };

  return (
    <PageContainer>
      <MaterialTable
        actionRef={actionRef}
        loading={loading}
        categories={categories}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDataChange={handleDataChange}
      />

      <MaterialForm
        visible={modalVisible}
        editingMaterial={editingMaterial}
        categories={categories}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default MaterialArchive;
