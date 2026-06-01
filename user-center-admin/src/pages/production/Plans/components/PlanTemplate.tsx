import React, { useState, useEffect } from 'react';
import {
  Modal, Table, Button, Space, Input, Form, Select, message,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import {
  searchPlanTemplates, createPlanTemplate, updatePlanTemplate, deletePlanTemplate,
} from '@/services/api/production/plan-template';

const { TextArea } = Input;
const { Option } = Select;

const planTypes = [
  '放苗计划', '投喂计划', '用药计划', '换水/增氧计划', '收获计划',
];

interface PlanTemplateItem {
  id: number | string;
  name: string;
  planType: string;
  content: string;
  creator?: string;
  createTime?: string;
}

interface PlanTemplateProps {
  visible: boolean;
  onCancel: () => void;
}

const PlanTemplate: React.FC<PlanTemplateProps> = ({ visible, onCancel }) => {
  const [templates, setTemplates] = useState<PlanTemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PlanTemplateItem | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchTemplates = async (page = 1) => {
    setLoading(true);
    try {
      const res = await searchPlanTemplates({ current: page, pageSize: pagination.pageSize });
      setTemplates(res.data || []);
      setPagination(prev => ({ ...prev, current: page, total: res.total || 0 }));
    } catch {
      message.error('获取模板列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchTemplates();
    }
  }, [visible]);

  const handleCreateTemplate = async (values: any) => {
    setSubmitting(true);
    try {
      if (isEdit && editingTemplate) {
        await updatePlanTemplate(editingTemplate.id, values);
        message.success('模板编辑成功');
      } else {
        await createPlanTemplate(values);
        message.success('模板创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTemplate(null);
      setIsEdit(false);
      fetchTemplates(pagination.current);
    } catch {
      message.error('操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = (id: number | string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模板吗？',
      onOk: async () => {
        try {
          await deletePlanTemplate(id);
          message.success('模板删除成功');
          fetchTemplates(pagination.current);
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCopyTemplate = async (template: PlanTemplateItem) => {
    try {
      await createPlanTemplate({
        name: template.name + ' (副本)',
        planType: template.planType,
        content: template.content,
      });
      message.success('模板复制成功');
      fetchTemplates(pagination.current);
    } catch {
      message.error('复制失败');
    }
  };

  const columns: TableColumnsType<PlanTemplateItem> = [
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    { title: '计划类型', dataIndex: 'planType', key: 'planType' },
    { title: '模板内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />}
            onClick={() => {
              setEditingTemplate(record);
              setIsEdit(true);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}>编辑</Button>
          <Button type="text" icon={<CopyOutlined />}
            onClick={() => handleCopyTemplate(record)}>复制</Button>
          <Button type="text" danger icon={<DeleteOutlined />}
            onClick={() => handleDeleteTemplate(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal title="计划模板管理" open={visible} onCancel={onCancel} footer={null} width={1000} destroyOnClose>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => {
            setIsEdit(false);
            setEditingTemplate(null);
            form.resetFields();
            setModalVisible(true);
          }}>新建模板</Button>
      </div>

      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchTemplates(page),
          showSizeChanger: true,
        }}
      />

      <Modal
        title={isEdit ? '编辑模板' : '新建模板'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); setEditingTemplate(null); setIsEdit(false); }}
        onOk={() => form.validateFields().then(handleCreateTemplate)}
        confirmLoading={submitting}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="planType" label="计划类型" rules={[{ required: true, message: '请选择计划类型' }]}>
            <Select placeholder="请选择计划类型" style={{ width: '100%' }}>
              {planTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="模板内容" rules={[{ required: true, message: '请输入模板内容' }]}>
            <TextArea rows={4} placeholder="请输入模板详细内容" />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default PlanTemplate;