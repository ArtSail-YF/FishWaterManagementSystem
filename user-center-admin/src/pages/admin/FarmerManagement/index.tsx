import React, { useState, useRef } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Card, Row, Col, Tag, Avatar, Descriptions } from 'antd';

const { Option } = Select;

interface FarmerInfo {
  id: number;
  name: string;
  phone: string;
  idCard: string;
  gender: 'male' | 'female';
  age: number;
  address: string;
  baseName: string;
  pondCount: number;
  experience: number;
  status: 'active' | 'inactive' | 'pending';
  registerTime: string;
  lastLogin: string;
}

const FarmerManagement: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<FarmerInfo | null>(null);
  const [currentFarmer, setCurrentFarmer] = useState<FarmerInfo | null>(null);

  // 模拟数据
  const mockData: FarmerInfo[] = [
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      idCard: '330102198501010101',
      gender: 'male',
      age: 38,
      address: '浙江省杭州市西湖区',
      baseName: '西湖淡水基地',
      pondCount: 15,
      experience: 12,
      status: 'active',
      registerTime: '2023-05-10',
      lastLogin: '2024-04-18',
    },
    {
      id: 2,
      name: '李四',
      phone: '13900139000',
      idCard: '330103198602020202',
      gender: 'male',
      age: 35,
      address: '浙江省宁波市鄞州区',
      baseName: '东海养殖基地',
      pondCount: 25,
      experience: 8,
      status: 'active',
      registerTime: '2023-07-15',
      lastLogin: '2024-04-17',
    },
    {
      id: 3,
      name: '王五',
      phone: '13700137000',
      idCard: '330104198703030303',
      gender: 'male',
      age: 42,
      address: '浙江省温州市鹿城区',
      baseName: '南山特种养殖基地',
      pondCount: 8,
      experience: 15,
      status: 'inactive',
      registerTime: '2023-09-20',
      lastLogin: '2024-03-10',
    },
    {
      id: 4,
      name: '赵六',
      phone: '13600136000',
      idCard: '330105198804040404',
      gender: 'female',
      age: 33,
      address: '浙江省嘉兴市南湖区',
      baseName: '西湖淡水基地',
      pondCount: 12,
      experience: 6,
      status: 'pending',
      registerTime: '2024-01-05',
      lastLogin: '2024-04-15',
    },
  ];

  const columns: ProColumns<FarmerInfo>[] = [
    {
      title: '养殖户信息',
      dataIndex: 'name',
      key: 'farmer',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={40} icon={<UserOutlined />} style={{ marginRight: 12 }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => gender === 'male' ? '男' : '女',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '所属基地',
      dataIndex: 'baseName',
      key: 'baseName',
      width: 120,
    },
    {
      title: '塘口数量',
      dataIndex: 'pondCount',
      key: 'pondCount',
      width: 100,
      sorter: (a, b) => a.pondCount - b.pondCount,
    },
    {
      title: '养殖经验(年)',
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      sorter: (a, b) => a.experience - b.experience,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '正常' },
          inactive: { color: 'red', text: '停用' },
          pending: { color: 'orange', text: '待审核' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
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
    setEditingFarmer(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: FarmerInfo) => {
    setEditingFarmer(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleViewDetail = (record: FarmerInfo) => {
    setCurrentFarmer(record);
    setDetailVisible(true);
  };

  const handleDelete = (record: FarmerInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除养殖户"${record.name}"吗？`,
      onOk: () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFarmer) {
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
        <ProTable<FarmerInfo>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params) => {
            // 模拟搜索
            let data = mockData;
            if (params.name) {
              data = data.filter(item => item.name.includes(params.name));
            }
            if (params.phone) {
              data = data.filter(item => item.phone.includes(params.phone));
            }
            if (params.status) {
              data = data.filter(item => item.status === params.status);
            }
            if (params.baseName) {
              data = data.filter(item => item.baseName.includes(params.baseName));
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
              新增养殖户
            </Button>,
          ]}
        />

        {/* 新增/编辑模态框 */}
        <Modal
          title={editingFarmer ? '编辑养殖户' : '新增养殖户'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={700}
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
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="idCard"
                  label="身份证号"
                  rules={[
                    { required: true, message: '请输入身份证号' },
                    { pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号' }
                  ]}
                >
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select placeholder="请选择性别">
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="年龄"
                  rules={[{ required: true, message: '请输入年龄' }]}
                >
                  <Input type="number" placeholder="请输入年龄" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="experience"
                  label="养殖经验(年)"
                  rules={[{ required: true, message: '请输入养殖经验' }]}
                >
                  <Input type="number" placeholder="请输入养殖经验" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="address"
              label="地址"
              rules={[{ required: true, message: '请输入地址' }]}
            >
              <Input placeholder="请输入详细地址" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="baseName"
                  label="所属基地"
                  rules={[{ required: true, message: '请输入所属基地' }]}
                >
                  <Input placeholder="请输入所属基地" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="pondCount"
                  label="塘口数量"
                  rules={[{ required: true, message: '请输入塘口数量' }]}
                >
                  <Input type="number" placeholder="请输入塘口数量" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">正常</Option>
                <Option value="inactive">停用</Option>
                <Option value="pending">待审核</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingFarmer ? '更新' : '创建'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 详情模态框 */}
        <Modal
          title="养殖户详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              关闭
            </Button>
          ]}
          width={600}
        >
          {currentFarmer && (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="姓名">{currentFarmer.name}</Descriptions.Item>
              <Descriptions.Item label="手机号">{currentFarmer.phone}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{currentFarmer.idCard}</Descriptions.Item>
              <Descriptions.Item label="性别">{currentFarmer.gender === 'male' ? '男' : '女'}</Descriptions.Item>
              <Descriptions.Item label="年龄">{currentFarmer.age}岁</Descriptions.Item>
              <Descriptions.Item label="养殖经验">{currentFarmer.experience}年</Descriptions.Item>
              <Descriptions.Item label="地址" span={2}>{currentFarmer.address}</Descriptions.Item>
              <Descriptions.Item label="所属基地">{currentFarmer.baseName}</Descriptions.Item>
              <Descriptions.Item label="塘口数量">{currentFarmer.pondCount}个</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={currentFarmer.status === 'active' ? 'green' : currentFarmer.status === 'inactive' ? 'red' : 'orange'}>
                  {currentFarmer.status === 'active' ? '正常' : currentFarmer.status === 'inactive' ? '停用' : '待审核'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{currentFarmer.registerTime}</Descriptions.Item>
              <Descriptions.Item label="最后登录">{currentFarmer.lastLogin}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default FarmerManagement;