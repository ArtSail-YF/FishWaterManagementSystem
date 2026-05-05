import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag, Space, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import type { SysDictData } from '@/types';
import { getSysDictDataList, deleteSysDictData, toggleSysDictData, getSysDictTypeList } from '@/services/api/dict';
import DictDataModal from './components/DictDataModal';

const { Option } = Select;

const DictDataManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SysDictData | undefined>();
  const [actionType, setActionType] = useState<'create' | 'edit'>('create');
  const [dictTypes, setDictTypes] = useState<{ dictType: string; dictName: string }[]>([]);

  // 加载字典类型列表
  useEffect(() => {
    const loadDictTypes = async () => {
      try {
        const response = await getSysDictTypeList({ status: 1 });
        if (response.data?.list) {
          setDictTypes(response.data.list.map(item => ({
            dictType: item.dictType,
            dictName: item.dictName
          })));
        }
      } catch (error) {
        console.error('加载字典类型失败:', error);
      }
    };
    loadDictTypes();
  }, []);

  // 表格列定义
  const columns: ProColumns<SysDictData>[] = [
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      width: 120,
      render: (dictType: string) => {
        const dictTypeInfo = dictTypes.find(item => item.dictType === dictType);
        return dictTypeInfo ? `${dictTypeInfo.dictName}(${dictType})` : dictType;
      },
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      key: 'dictLabel',
      width: 120,
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
      key: 'dictValue',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
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
            title="确定删除这个字典数据吗？"
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
  const handleEdit = (record: SysDictData) => {
    setCurrentRecord(record);
    setActionType('edit');
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      await deleteSysDictData(id);
      message.success('删除成功');
      // 刷新表格
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理启用/停用
  const handleToggleStatus = async (record: SysDictData) => {
    try {
      await toggleSysDictData({
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
      <ProTable<SysDictData>
        headerTitle="字典数据管理"
        rowKey="id"
        columns={columns}
        request={async (params) => {
          return await getSysDictDataList(params);
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建字典数据
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
          optionRender: (searchConfig, formProps, dom) => [
            ...dom,
            <Select
              key="dictType"
              placeholder="选择字典类型"
              style={{ width: 200, marginLeft: 8 }}
              onChange={(value) => {
                formProps.form?.setFieldsValue({ dictType: value });
              }}
              allowClear
            >
              {dictTypes.map(item => (
                <Option key={item.dictType} value={item.dictType}>
                  {item.dictName}
                </Option>
              ))}
            </Select>,
          ],
        }}
      />

      <DictDataModal
        visible={modalVisible}
        actionType={actionType}
        record={currentRecord}
        dictTypes={dictTypes}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          // 刷新表格
        }}
      />
    </PageContainer>
  );
};

export default DictDataManagement;