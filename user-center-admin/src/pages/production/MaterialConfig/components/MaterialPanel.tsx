import React, { useState, useRef, useEffect } from 'react';
import { Button, Tag, Modal, message, Form, Input, InputNumber, Select, Typography, Space, Descriptions, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/services/api/material/info';
import type { MatCategory } from '@/services/api/material/category';
import type { MatInfo } from '@/services/api/material/info';

const { Text } = Typography;

interface MaterialPanelProps {
  category: MatCategory;
  categories: MatCategory[];
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({ category, categories }) => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MatInfo | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [viewMaterial, setViewMaterial] = useState<MatInfo | null>(null);
  const [viewVisible, setViewVisible] = useState(false);

  const nonNullCategories = categories.filter(c => c.id !== undefined);

  const getCatName = (catId?: number) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.catName || '-';
  };

  const columns: ProColumns<MatInfo>[] = [
    {
      title: '物资名称',
      dataIndex: 'matName',
      key: 'matName',
      width: 150,
      render: (text: any) => <Text strong>{text}</Text>,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      width: 120,
      search: false,
    },
    {
      title: '休药期(天)',
      dataIndex: 'withdrawalDays',
      key: 'withdrawalDays',
      width: 100,
      search: false,
      render: (text: any) => (text ? `${text}天` : '-'),
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
      render: (status: any) => {
        const isEnabled = status === 1 || status === '1';
        return <Tag>{isEnabled ? '启用' : '停用'}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      search: false,
      render: (_: any, record: MatInfo) => (
        <Space size={0}>
          <Button type="link" size="small" icon={<EyeOutlined />}
            onClick={() => { setViewMaterial(record); setViewVisible(true); }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingMaterial(null);
    setModalVisible(true);
  };

  const handleEdit = (record: MatInfo) => {
    setEditingMaterial(record);
    setModalVisible(true);
  };

  const handleDelete = (record: MatInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除物料"${record.matName}"吗？`,
      onOk: async () => {
        try {
          const res = await deleteMaterial(record.id!);
          if (res.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
          } else {
            message.error(res.message || '删除失败');
          }
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setModalLoading(true);
      const submitData = {
        ...values,
        catId: category.id,
        status: typeof values.status === 'number' ? values.status : (values.status === '1' ? 1 : 0),
      };

      if (editingMaterial) {
        const res = await updateMaterial(editingMaterial.id!, submitData);
        if (res.code === 200) {
          message.success('更新成功');
        } else {
          message.error(res.message || '更新失败');
          return;
        }
      } else {
        const res = await createMaterial(submitData);
        if (res.code === 200) {
          message.success('添加成功');
        } else {
          message.error(res.message || '添加失败');
          return;
        }
      }

      setModalVisible(false);
      actionRef.current?.reload();
    } catch {
      message.error('操作失败');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16 }}>{category.catName}</Text>
        {category.catCode && (
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{category.catCode}</Text>
        )}
      </div>

      <ProTable<MatInfo>
        headerTitle={`物料清单（${category.catName}）`}
        columns={columns}
        actionRef={actionRef}
        cardBordered={{ search: true, table: true }}
        request={async (params) => {
          try {
            const queryParams = {
              current: params.current || 1,
              pageSize: params.pageSize || 10,
              matCode: params.matCode,
              matName: params.matName,
              catId: category.id,
              status: params.status,
            };
            const filteredParams = Object.fromEntries(
              Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
            );
            const response = await searchMaterials(filteredParams);
            const records = response.data?.records || response.data || [];
            return {
              data: records,
              success: true,
              total: response.data?.total || response.total || records.length || 0,
            };
          } catch {
            message.error('获取数据失败');
            return { data: [], success: false, total: 0 };
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button key="add" icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
            新建物料
          </Button>,
        ]}
      />

      <MaterialFormModal
        visible={modalVisible}
        editingMaterial={editingMaterial}
        categories={nonNullCategories}
        catId={category.id}
        loading={modalLoading}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />

      <MaterialDetailModal
        material={viewMaterial}
        visible={viewVisible}
        catName={getCatName(viewMaterial?.catId)}
        onClose={() => { setViewVisible(false); setViewMaterial(null); }}
      />
    </div>
  );
};

/** 物料详情弹窗 */
const MaterialDetailModal: React.FC<{
  material: MatInfo | null;
  visible: boolean;
  catName: string;
  onClose: () => void;
}> = ({ material, visible, catName, onClose }) => {
  if (!material) return null;
  const items = [
    { label: '物资编码', children: material.matCode },
    { label: '物资名称', children: material.matName },
    { label: '分类', children: catName },
    { label: '规格', children: material.spec || '-' },
    { label: '单位', children: material.unit || '-' },
    { label: '参考单价', children: material.unitPrice ? `¥${material.unitPrice}` : '-' },
    { label: '生产厂家', children: material.manufacturer || '-' },
    { label: '批准文号', children: material.approvalCode || '-' },
    { label: '休药期(天)', children: material.withdrawalDays ? `${material.withdrawalDays}天` : '-' },
    {
      label: '库存范围',
      children: (material.minStock || material.maxStock)
        ? `${material.minStock || '0'} ~ ${material.maxStock || '∞'}`
        : '-',
    },
    {
      label: '状态',
      children: material.status === 1 ? '启用' : '停用',
    },
  ];

  return (
    <Modal
      title={`物料详情 - ${material.matName}`}
      open={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={560}
    >
      <Descriptions column={2} bordered size="small" style={{ marginTop: 8 }}>
        {items.map((item, idx) => (
          <Descriptions.Item key={idx} label={item.label}>
            {item.children}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  );
};

/** 物料表单弹窗 */
const MaterialFormModal: React.FC<{
  visible: boolean;
  editingMaterial: MatInfo | null;
  categories: MatCategory[];
  catId?: number;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}> = ({ visible, editingMaterial, categories, catId, loading, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingMaterial) {
        form.setFieldsValue(editingMaterial);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1, catId });
      }
    }
  }, [visible, editingMaterial, form, catId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      message.error('表单验证失败');
    }
  };

  return (
    <Modal
      title={editingMaterial ? '编辑物料' : '新建物料'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="matCode" label="物资编码" rules={[{ required: true, message: '请输入物资编码' }]}>
              <Input placeholder="请输入物资编码" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="matName" label="物资名称" rules={[{ required: true, message: '请输入物资名称' }]}>
              <Input placeholder="请输入物资名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="catId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
              <Select placeholder="请选择分类">
                {categories.filter(c => c.id !== undefined).map(cat => (
                  <Select.Option key={cat.id} value={cat.id}>{cat.catName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="spec" label="规格">
              <Input placeholder="请输入规格" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="unit" label="单位">
              <Input placeholder="请输入单位" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="unitPrice" label="参考单价">
              <InputNumber style={{ width: '100%' }} placeholder="请输入参考单价" min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="manufacturer" label="生产厂家">
              <Input placeholder="请输入生产厂家" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="approvalCode" label="批准文号">
              <Input placeholder="请输入批准文号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="withdrawalDays" label="休药期(天)">
              <InputNumber style={{ width: '100%' }} placeholder="请输入休药期" min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="minStock" label="最低库存">
              <InputNumber style={{ width: '100%' }} placeholder="请输入最低库存" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxStock" label="最高库存">
              <InputNumber style={{ width: '100%' }} placeholder="请输入最高库存" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>停用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MaterialPanel;
