import React from 'react';
import { Button, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchCategories } from '@/services/api/material/category';
import type { MatCategory } from '@/services/api/material/category';

interface CategoryTableProps {
  actionRef: React.RefObject<ActionType>;
  loading: boolean;
  categories: MatCategory[];
  onAdd: () => void;
  onEdit: (record: MatCategory) => void;
  onDelete: (record: MatCategory) => void;
  onDataChange: (data: MatCategory[]) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  actionRef,
  loading,
  categories,
  onAdd,
  onEdit,
  onDelete,
  onDataChange
}) => {
  const columns: ProColumns<MatCategory>[] = [
    {
      title: '分类编码',
      dataIndex: 'catCode',
      key: 'catCode',
      width: 120,
      copyable: true,
    },
    {
      title: '分类名称',
      dataIndex: 'catName',
      key: 'catName',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: '父级分类',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 120,
      render: (parentId) => {
        if (!parentId) return <Tag color="blue">顶级分类</Tag>;
        const parent = categories.find(c => c.id === parentId);
        return parent?.catName || '-';
      },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '停用', status: 'Default' },
      },
      render: (_, record) => {
        const isEnabled = record.status === 1 || record.status === '1';
        return <Tag color={isEnabled ? 'green' : 'red'}>{isEnabled ? '启用' : '停用'}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      search: false,
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProTable<MatCategory>
      headerTitle="物资分类管理"
      columns={columns}
      actionRef={actionRef}
      cardBordered={{
        search: true,
        table: true,
      }}
      request={async (params) => {
        try {
          const queryParams = {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            catCode: params.catCode,
            catName: params.catName,
            status: params.status,
          };

          const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => 
              value !== undefined && value !== '' && value !== null
            )
          );

          const response = await searchCategories(filteredParams);

          const records = response.data?.records || response.data || [];

          const data = records.map((item: any) => ({
            id: item.id,
            catCode: item.catCode,
            catName: item.catName,
            parentId: item.parentId,
            sortOrder: item.sortOrder,
            status: item.status,
            createTime: item.createTime,
            fullData: item
          })) || [];

          onDataChange(data);

          return {
            data,
            success: true,
            total: response.data?.total || response.total || records.length || 0,
          };
        } catch (error) {
          message.error('获取数据失败');
          return {
            data: [],
            success: false,
            total: 0,
          };
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={onAdd}
          loading={loading}
        >
          新建分类
        </Button>,
      ]}
    />
  );
};

export default CategoryTable;
