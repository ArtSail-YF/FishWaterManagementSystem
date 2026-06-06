import React, { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Typography, List, Modal, message, Form, InputNumber, Select, Descriptions, Space } from 'antd';
import {
  createBase,
  updateBase,
  deleteBase,
} from '@/services/api/base';

const { Text } = Typography;

interface Base {
  id: number;
  baseName?: string;
  name?: string;
  baseCode?: string;
  code?: string;
  address?: string;
  totalArea?: number;
  waterArea?: number;
  status?: number | string;
  [key: string]: any;
}

interface BaseSidebarProps {
  bases: Base[];
  selectedId: number | null;
  onSelect: (base: Base) => void;
  onChanged: () => void;
}

const BaseSidebar: React.FC<BaseSidebarProps> = ({ bases, selectedId, onSelect, onChanged }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [viewBase, setViewBase] = useState<Base | null>(null);
  const [viewVisible, setViewVisible] = useState(false);

  const getDisplayName = (b: Base) => b.baseName || b.name || '未命名基地';
  const getDisplayCode = (b: Base) => b.baseCode || b.code || '';

  const handleCreate = () => {
    if (!newName.trim()) {
      message.warning('请输入基地名称');
      return;
    }
    Modal.confirm({
      title: '新建基地',
      content: `基地名称：${newName.trim()}`,
      onOk: async () => {
        try {
          const res = await createBase({ baseName: newName.trim(), address: '', status: 1 });
          if (res.code === 200) {
            message.success('基地已创建');
            setNewName('');
            setAddingNew(false);
            onChanged();
          } else {
            message.error(res.message || '创建失败');
          }
        } catch {
          message.error('创建失败');
        }
      },
    });
  };

  const handleDelete = (id: number, name: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除基地"${name}"吗？该基地下的塘口将失去关联。`,
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBase(id);
          message.success('已删除');
          onChanged();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleEdit = (record: Base) => {
    Modal.confirm({
      title: '编辑基地',
      width: 500,
      content: <BaseEditForm record={record} onSaved={onChanged} onCancel={() => { Modal.destroyAll(); }} />,
      footer: null,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 14 }}>基地列表</Text>
        <Button type="primary" size="small" icon={<PlusOutlined />}
          onClick={() => setAddingNew(!addingNew)}>
          新增
        </Button>
      </div>

      {addingNew && (
        <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
          <Input
            size="small"
            placeholder="输入基地名称"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onPressEnter={handleCreate}
          />
          <Button size="small" type="primary" onClick={handleCreate}>确定</Button>
        </Space.Compact>
      )}

      <List
        dataSource={bases}
        locale={{ emptyText: '暂无基地' }}
        renderItem={item => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderRadius: 8,
              marginBottom: 4,
              background: selectedId === item.id ? '#f5f5f5' : 'transparent',
              border: selectedId === item.id ? '1px solid #d9d9d9' : '1px solid transparent',
            }}
          >
            <Text strong style={{ fontSize: 14, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDisplayName(item)}</Text>
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: 4 }}>
              <Button type="link" size="small"
                onClick={e => { e.stopPropagation(); setViewBase(item); setViewVisible(true); }}>
                查看
              </Button>
              <Button type="text" size="small" icon={<EditOutlined />}
                onClick={e => { e.stopPropagation(); handleEdit(item); }}
                style={{ color: '#8c8c8c' }}
              />
              <Button type="text" size="small" icon={<DeleteOutlined />} danger
                onClick={e => { e.stopPropagation(); handleDelete(item.id, getDisplayName(item)); }}
              />
            </div>
          </div>
        )}
        style={{ overflow: 'auto', maxHeight: 'calc(100vh - 320px)' }}
      />

      <Modal
        title={`基地详情 - ${viewBase ? getDisplayName(viewBase) : ''}`}
        open={viewVisible}
        onCancel={() => { setViewVisible(false); setViewBase(null); }}
        footer={<Button onClick={() => { setViewVisible(false); setViewBase(null); }}>关闭</Button>}
        width={480}
      >
        {viewBase && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 8 }}>
            <Descriptions.Item label="基地名称">{getDisplayName(viewBase)}</Descriptions.Item>
            <Descriptions.Item label="基地编码">{getDisplayCode(viewBase) || '-'}</Descriptions.Item>
            <Descriptions.Item label="地址">{viewBase.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="总面积(亩)">{viewBase.totalArea ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="水域面积(亩)">{viewBase.waterArea ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {viewBase.status === 1 || viewBase.status === '1' || viewBase.status === 'active' ? '启用' : '停用'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

/** 编辑基地弹窗内嵌表单 */
const BaseEditForm: React.FC<{
  record: Base;
  onSaved: () => void;
  onCancel: () => void;
}> = ({ record, onSaved, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue({
      baseName: record.baseName || record.name,
      baseCode: record.baseCode || record.code,
      address: record.address,
      totalArea: record.totalArea,
      waterArea: record.waterArea,
      status: record.status === 1 || record.status === '1' || record.status === 'active' ? 1 : 0,
    });
  }, [record]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await updateBase(record.id, values);
      if (res.code === 200) {
        message.success('已更新');
        onSaved();
        onCancel();
      } else {
        message.error(res.message || '更新失败');
      }
    } catch { /* validation failed */ }
    finally { setLoading(false); }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="baseName" label="基地名称" rules={[{ required: true, message: '请输入基地名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="baseCode" label="基地编码">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="地址">
        <Input />
      </Form.Item>
      <Form.Item name="totalArea" label="总面积(亩)">
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>
      <Form.Item name="waterArea" label="水域面积(亩)">
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>
      <Form.Item name="status" label="状态" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>停用</Select.Option>
        </Select>
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>取消</Button>
        <Button type="primary" loading={loading} onClick={handleOk}>保存</Button>
      </div>
    </Form>
  );
};

export default BaseSidebar;
