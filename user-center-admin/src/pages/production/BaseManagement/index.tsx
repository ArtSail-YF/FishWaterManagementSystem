import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Card, Row, Col, Tag } from 'antd';

const { Option } = Select;

interface BaseInfo {
  id: number;
  name: string;
  code: string;
  type: string;
  area: number;
  location: string;
  manager: string;
  phone: string;
  status: 'active' | 'inactive' | 'maintenance';
  createTime: string;
}

const BaseManagement: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBase, setEditingBase] = useState<BaseInfo | null>(null);

  // 模拟数据
  const mockData: BaseInfo[] = [
    {
      id: 1,
      name: '东海养殖基地',
      code: 'DH-001',
      type: '海水养殖',
      area: 500,
      location: '浙江省舟山市',
      manager: '张三',
      phone: '13800138000',
      status: 'active',
      createTime: '2024-01-15',
    },
    {
      id: 2,
      name: '西湖淡水基地',
      code: 'XH-002',
      type: '淡水养殖',
      area: 300,
      location: '浙江省杭州市',
      manager: '李四',
      phone: '13900139000',
      status: 'active',
      createTime: '2024-02-20',
    },
    {
      id: 3,
      name: '南山特种养殖基地',
      code: 'NS-003',
      type: '特种养殖',
      area: 200,
      location: '浙江省温州市',
      manager: '王五',
      phone: '13700137000',
      status: 'maintenance',
      createTime: '2024-03-10',
    },
  ];

  const columns: ProColumns<BaseInfo>[] = [
    {
      title: '基地编号',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: '基地名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '基地类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '面积(亩)',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: '所在地',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '运营中' },
          inactive: { color: 'red', text: '停用' },
          maintenance: { color: 'orange', text: '维护中' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingBase(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: BaseInfo) => {
    setEditingBase(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (record: BaseInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除基地"${record.name}"吗？`,
      onOk: () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBase) {
        message.success('更新成功');
      } else {
        message.success('添加成功');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <ProTable<BaseInfo>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params) => {
            // 模拟搜索
            let data = mockData;
            if (params.name) {
              data = data.filter(item => item.name.includes(params.name));
            }
            if (params.type) {
              data = data.filter(item => item.type === params.type);
            }
            if (params.status) {
              data = data.filter(item => item.status === params.status);
            }
            
            return {
              data,
              success: true,
              total: data.length,
            };
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
              onClick={handleAdd}
            >
              新建基地
            </Button>,
          ]}
        />

        <Modal
          title={editingBase ? '编辑基地' : '新建基地'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="基地名称"
                  rules={[{ required: true, message: '请输入基地名称' }]}
                >
                  <Input placeholder="请输入基地名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="基地编号"
                  rules={[{ required: true, message: '请输入基地编号' }]}
                >
                  <Input placeholder="请输入基地编号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="基地类型"
                  rules={[{ required: true, message: '请选择基地类型' }]}
                >
                  <Select placeholder="请选择基地类型">
                    <Option value="海水养殖">海水养殖</Option>
                    <Option value="淡水养殖">淡水养殖</Option>
                    <Option value="特种养殖">特种养殖</Option>
                    <Option value="综合养殖">综合养殖</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="area"
                  label="面积(亩)"
                  rules={[{ required: true, message: '请输入面积' }]}
                >
                  <Input type="number" placeholder="请输入面积" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="location"
              label="所在地"
              rules={[{ required: true, message: '请输入所在地' }]}
            >
              <Input placeholder="请输入所在地" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="manager"
                  label="负责人"
                  rules={[{ required: true, message: '请输入负责人' }]}
                >
                  <Input placeholder="请输入负责人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">运营中</Option>
                <Option value="inactive">停用</Option>
                <Option value="maintenance">维护中</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingBase ? '更新' : '创建'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default BaseManagement;