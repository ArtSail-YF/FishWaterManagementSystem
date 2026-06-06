import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Input, Layout, Typography, List, Empty } from 'antd';
import {
  getDeviceTypeList,
  createDeviceType,
  deleteDeviceType,
  type IoTDeviceType,
} from '@/services/api/iot-device-type';
import DeviceTypeInfo from './components/DeviceTypeInfo';

const { Sider, Content } = Layout;
const { Text } = Typography;

const IoTConfig = () => {
  const [allTypes, setAllTypes] = useState<IoTDeviceType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<IoTDeviceType[]>([]);
  const [selectedType, setSelectedType] = useState<IoTDeviceType | null>(null);
  const [searchText, setSearchText] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const loadTypes = async () => {
    try {
      const res = await getDeviceTypeList();
      if (res.code === 200) {
        const list = res.data || [];
        setAllTypes(list);
        setFilteredTypes(
          list.filter(dt =>
            dt.typeName?.includes(searchText) || dt.typeCode?.includes(searchText)
          )
        );
        if (selectedType && !list.some(dt => dt.id === selectedType.id)) {
          setSelectedType(null);
        }
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    setFilteredTypes(
      allTypes.filter(dt =>
        dt.typeName?.includes(searchText) || dt.typeCode?.includes(searchText)
      )
    );
  }, [searchText, allTypes]);

  const handleCreate = () => {
    if (!newTypeName.trim()) {
      message.warning('请输入品种名称');
      return;
    }
    Modal.confirm({
      title: '新建设备品种',
      content: `品种名称：${newTypeName.trim()}（编码、协议等可在右侧基本信息中补充）`,
      onOk: async () => {
        try {
          const res = await createDeviceType({ typeName: newTypeName.trim(), typeCode: '', status: 1 });
          if (res.code === 200) {
            message.success('品种已创建');
            setNewTypeName('');
            setAddingNew(false);
            await loadTypes();
          } else {
            message.error(res.message || '创建失败');
          }
        } catch {
          message.error('创建失败');
        }
      },
    });
  };

  const handleDeleteType = (id: number) => {
    Modal.confirm({
      title: '确认删除品种',
      content: '删除后该类型下的协议映射和指令配置也会失去关联，确认删除？',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteDeviceType(id);
          message.success('已删除');
          await loadTypes();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleTypeUpdated = () => {
    loadTypes();
  };

  return (
    <PageContainer>
      <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 180px)' }}>
        <Sider
          width={280}
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 12,
            marginRight: 16,
            border: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 14 }}>设备品种</Text>
            <Button type="primary" size="small" icon={<PlusOutlined />}
              onClick={() => setAddingNew(!addingNew)}>
              新增
            </Button>
          </div>

          {addingNew && (
            <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
              <Input
                size="small"
                placeholder="输入品种名称"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                onPressEnter={handleCreate}
              />
              <Button size="small" type="primary" onClick={handleCreate}>确定</Button>
            </Space.Compact>
          )}

          <Input.Search
            size="small"
            placeholder="搜索品种..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ marginBottom: 8 }}
          />

          <List
            dataSource={filteredTypes}
            locale={{ emptyText: '暂无设备品种' }}
            renderItem={item => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedType(item)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: 6,
                  marginBottom: 2,
                  background: selectedType?.id === item.id ? '#f5f5f5' : 'transparent',
                  border: selectedType?.id === item.id ? '1px solid #d9d9d9' : '1px solid transparent',
                }}
                actions={[
                  <Button key="del" type="link" size="small"
                    onClick={e => { e.stopPropagation(); handleDeleteType(item.id!); }}>
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space size={4}>
                      <Text strong style={{ fontSize: 13 }}>{item.typeName}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{item.typeCode}</Text>
                    </Space>
                  }
                  description={
                    item.protocolType ? (
                      <Tag style={{ fontSize: 11 }}>{item.protocolType}</Tag>
                    ) : null
                  }
                />
              </List.Item>
            )}
            style={{ overflow: 'auto', maxHeight: 'calc(100vh - 320px)' }}
          />
        </Sider>

        <Content style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #f0f0f0' }}>
          {selectedType ? (
            <DeviceTypeInfo
              key={selectedType.id}
              deviceType={selectedType}
              onUpdated={handleTypeUpdated}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300 }}>
              <Empty description="请从左侧选择一个设备品种" />
            </div>
          )}
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default IoTConfig;
