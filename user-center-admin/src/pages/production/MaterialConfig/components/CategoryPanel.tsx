import React, { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Input, Typography, List, Modal, message, Form, InputNumber, Select, Descriptions } from 'antd';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type MatCategory,
} from '@/services/api/material/category';

const { Text } = Typography;

interface CategoryPanelProps {
  categories: MatCategory[];
  selectedId: number | null;
  onSelect: (cat: MatCategory) => void;
  onChanged: () => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ categories, selectedId, onSelect, onChanged }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [viewCat, setViewCat] = useState<MatCategory | null>(null);
  const [viewVisible, setViewVisible] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) {
      message.warning('请输入分类名称');
      return;
    }
    Modal.confirm({
      title: '新建物料分类',
      content: `分类名称：${newName.trim()}`,
      onOk: async () => {
        try {
          const res = await createCategory({ catName: newName.trim(), catCode: '', status: 1 });
          if (res.code === 200) {
            message.success('分类已创建');
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
      content: `确定要删除分类"${name}"吗？该分类下的物料不会自动删除，但将失去分类关联。`,
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success('已删除');
          onChanged();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleEdit = (record: MatCategory) => {
    Modal.confirm({
      title: '编辑分类',
      width: 480,
      content: <CategoryEditForm record={record} onSaved={onChanged} onCancel={() => { Modal.destroyAll(); }} />,
      footer: null,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 15 }}>物料分类</Text>
        <Button type="primary" size="small" icon={<PlusOutlined />}
          onClick={() => setAddingNew(!addingNew)}>
          新增
        </Button>
      </div>

      {addingNew && (
        <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
          <Input
            size="small"
            placeholder="输入分类名称"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onPressEnter={handleCreate}
          />
          <Button size="small" type="primary" onClick={handleCreate}>确定</Button>
        </Space.Compact>
      )}

      <List
        dataSource={categories}
        locale={{ emptyText: '暂无物料分类' }}
        renderItem={item => (
          <List.Item
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              cursor: 'pointer',
              padding: '16px 20px',
              borderRadius: 8,
              marginBottom: 8,
              background: selectedId === item.id ? '#f5f5f5' : 'transparent',
              border: selectedId === item.id ? '1px solid #d9d9d9' : '1px solid transparent',
              lineHeight: 1.6,
            }}
            actions={[
              <Button key="view" type="link" size="small"
                onClick={e => { e.stopPropagation(); setViewCat(item); setViewVisible(true); }}>
                查看
              </Button>,
              <Button key="edit" type="text" size="small" icon={<EditOutlined />}
                onClick={e => { e.stopPropagation(); handleEdit(item); }}
                style={{ color: '#8c8c8c' }}
              />,
              <Button key="del" type="text" size="small" icon={<DeleteOutlined />} danger
                onClick={e => { e.stopPropagation(); handleDelete(item.id!, item.catName); }}
              />,
            ]}
          >
            <List.Item.Meta
              title={<Text strong style={{ fontSize: 15 }}>{item.catName}</Text>}
            />
          </List.Item>
        )}
        style={{ overflow: 'auto', maxHeight: 'calc(100vh - 320px)' }}
      />

      <Modal
        title={`分类详情 - ${viewCat?.catName}`}
        open={viewVisible}
        onCancel={() => { setViewVisible(false); setViewCat(null); }}
        footer={<Button onClick={() => { setViewVisible(false); setViewCat(null); }}>关闭</Button>}
        width={420}
      >
        {viewCat && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 8 }}>
            <Descriptions.Item label="分类名称">{viewCat.catName}</Descriptions.Item>
            <Descriptions.Item label="分类编码">{viewCat.catCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="父级分类">
              {viewCat.parentId
                ? (categories.find(c => c.id === viewCat.parentId)?.catName || '未知')
                : '顶级分类'}
            </Descriptions.Item>
            <Descriptions.Item label="排序">{viewCat.sortOrder ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{viewCat.status === 1 ? '启用' : '停用'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

/** 内嵌在弹窗中的编辑表单 */
const CategoryEditForm: React.FC<{
  record: MatCategory;
  onSaved: () => void;
  onCancel: () => void;
}> = ({ record, onSaved, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue(record);
  }, [record]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await updateCategory(record.id!, values);
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="catName" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="catCode" label="分类编码">
            <Input placeholder="例：feed, drug" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="sortOrder" label="排序">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>停用</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>取消</Button>
        <Button type="primary" loading={loading} onClick={handleOk}>保存</Button>
      </div>
    </Form>
  );
};

export default CategoryPanel;
