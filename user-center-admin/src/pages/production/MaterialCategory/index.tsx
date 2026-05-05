import React, { useState, useRef } from 'react';
import { Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { createCategory, updateCategory, deleteCategory } from '@/services/api/material/category';
import { getCategoryList, type MatCategory } from '@/services/api/material/category';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';

const MaterialCategory: React.FC = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MatCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<MatCategory[]>([]);
  const [categories, setCategories] = useState<MatCategory[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await getCategoryList({ status: 1 });
      const list = res.data?.records || res.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  const handleEdit = (record: MatCategory) => {
    setEditingCategory(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: MatCategory) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类"${record.catName}"吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          const response = await deleteCategory(record.id);
          if (response.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
            fetchCategories();
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

      if (editingCategory) {
        const response = await updateCategory(editingCategory.id, submitData);
        if (response.code === 200) {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createCategory(submitData);
        if (response.code === 200) {
          message.success('添加成功');
        } else {
          message.error(response.message || '添加失败');
          return;
        }
      }

      setModalVisible(false);
      actionRef.current?.reload();
      fetchCategories();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (data: MatCategory[]) => {
    setTableData(data);
  };

  return (
    <PageContainer>
      <CategoryTable
        actionRef={actionRef}
        loading={loading}
        categories={categories}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDataChange={handleDataChange}
      />

      <CategoryForm
        visible={modalVisible}
        editingCategory={editingCategory}
        categories={categories}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default MaterialCategory;
