import React, { useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  Input,
  Form,
  Select,
  message,
} from 'antd';

const { TextArea } = Input;
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

const { Option } = Select;

// 模拟模板数据
const mockTemplates = [
  {
    id: '1',
    name: '南美白对虾标准投喂方案',
    planType: '投喂计划',
    content: '每日投喂3次，早中晚各一次，根据虾的大小调整投喂量',
    creator: '管理员',
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    name: '常规消毒用药方案',
    planType: '用药计划',
    content: '每15天消毒一次，使用二氧化氯，用量为每亩100g',
    creator: '技术员',
    createdAt: '2026-03-20',
  },
];

// 计划类型选项
const planTypes = [
  '放苗计划',
  '投喂计划',
  '用药计划',
  '换水/增氧计划',
  '收获计划',
];

interface PlanTemplateProps {
  visible: boolean;
  onCancel: () => void;
}

const PlanTemplate: React.FC<PlanTemplateProps> = ({ visible, onCancel }) => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);

  // 处理模板创建/编辑
  const handleCreateTemplate = (values: any) => {
    if (isEdit && editingTemplate) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id ? { ...template, ...values } : template
      ));
      message.success('模板编辑成功');
    } else {
      const newTemplate = {
        id: (templates.length + 1).toString(),
        ...values,
        creator: '当前用户',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTemplates([...templates, newTemplate]);
      message.success('模板创建成功');
    }
    setModalVisible(false);
    form.resetFields();
    setEditingTemplate(null);
    setIsEdit(false);
  };

  // 处理模板删除
  const handleDeleteTemplate = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模板吗？',
      onOk: () => {
        setTemplates(templates.filter(template => template.id !== id));
        message.success('模板删除成功');
      },
    });
  };

  // 处理模板编辑
  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setIsEdit(true);
    form.setFieldsValue(template);
    setModalVisible(true);
  };

  // 处理模板复制
  const handleCopyTemplate = (template: any) => {
    const newTemplate = {
      id: (templates.length + 1).toString(),
      ...template,
      name: `${template.name} (副本)`,
      creator: '当前用户',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, newTemplate]);
    message.success('模板复制成功');
  };

  // 表格列配置
  const columns: TableColumnsType<any> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      key: 'planType',
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTemplate(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopyTemplate(record)}
          >
            复制
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTemplate(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="计划模板管理"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEdit(false);
            setEditingTemplate(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          新建模板
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* 模板创建/编辑模态框 */}
      <Modal
        title={isEdit ? '编辑模板' : '新建模板'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.validateFields().then(handleCreateTemplate)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            name="planType"
            label="计划类型"
            rules={[{ required: true, message: '请选择计划类型' }]}
          >
            <Select
              placeholder="请选择计划类型"
              style={{ width: '100%' }}
            >
              {planTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入模板详细内容"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default PlanTemplate;