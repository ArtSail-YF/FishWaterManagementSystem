import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import type { SysDictType } from '@/types';
import { getSysDictTypeList, deleteSysDictType, toggleSysDictType } from '@/services/api/dict';
import DictTypeModal from './components/DictTypeModal';

const DictTypeManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SysDictType | undefined>();
  const [actionType, setActionType] = useState<'create' | 'edit'>('create');

  // 表格列定义
  const columns: ProColumns<SysDictType>[] = [
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      width: 120,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 1 ? '停用' : '启用'}
          </Button>
          <Popconfirm
            title="确定删除这个字典类型吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: SysDictType) => {
    setCurrentRecord(record);
    setActionType('edit');
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      await deleteSysDictType(id);
      message.success('删除成功');
      // 刷新表格
      // 这里可以通过重新加载表格数据来实现刷新
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理启用/停用
  const handleToggleStatus = async (record: SysDictType) => {
    try {
      await toggleSysDictType({
        id: record.id!,
        status: record.status === 1 ? 0 : 1
      });
      message.success('操作成功');
      // 刷新表格
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理新建
  const handleCreate = () => {
    setCurrentRecord(undefined);
    setActionType('create');
    setModalVisible(true);
  };

  // 处理模态框关闭
  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentRecord(undefined);
  };

  return (
    <PageContainer>
      <ProTable<SysDictType>
        headerTitle="字典类型管理"
        rowKey="id"
        columns={columns}
        request={async (params) => {
          return await getSysDictTypeList(params);
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建字典类型
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
      />

      <DictTypeModal
        visible={modalVisible}
        actionType={actionType}
        record={currentRecord}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          // 刷新表格
        }}
      />
    </PageContainer>
  );
};

export default DictTypeManagement;