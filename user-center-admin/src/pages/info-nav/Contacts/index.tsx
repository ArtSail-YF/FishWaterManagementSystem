import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Avatar, message, Card, Row, Col, Typography, Input } from 'antd';
import { PhoneOutlined, MailOutlined, UserOutlined, SearchOutlined, MessageOutlined } from '@ant-design/icons';
import React from 'react';

const { Text, Title } = Typography;

interface ContactItem {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department: 'management' | 'technical' | 'field' | 'external';
  phone: string;
  email: string;
  expertise?: string[];
  status: 'online' | 'offline';
}

const Contacts: React.FC = () => {
  const columns: ProColumns<ContactItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: record.department === 'technical' ? '#1890ff' : '#87d068' }}
          />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '角色/部门',
      dataIndex: 'role',
      render: (text, record) => {
        const deptMap = {
          management: { color: 'blue', label: '管理层' },
          technical: { color: 'purple', label: '技术部' },
          field: { color: 'green', label: '生产一线' },
          external: { color: 'orange', label: '外部专家' },
        };
        const config = deptMap[record.department] || { color: 'default', label: record.department };
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ fontSize: '13px' }}>{text}</Text>
            <Tag color={config.color} style={{ fontSize: '10px', lineHeight: '16px', margin: 0 }}>
              {config.label}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text className="fin-number" style={{ fontSize: '13px' }}>
            <PhoneOutlined /> {text}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <MailOutlined /> {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: '专业领域',
      dataIndex: 'expertise',
      render: (tags: any) => (
        <Space size={[0, 4]} wrap>
          {tags?.map((tag: string) => (
            <Tag key={tag} color="default" variant="borderless" style={{ fontSize: '11px' }}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        online: { text: '在线', status: 'Success' },
        offline: { text: '忙碌/离线', status: 'Default' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: () => [
        <Button key="call" type="link" size="small" icon={<PhoneOutlined />} onClick={() => message.info('正在拨号...')}>拨打</Button>,
        <Button key="msg" type="link" size="small" icon={<MessageOutlined />} onClick={() => message.success('已进入私聊')}>消息</Button>,
      ],
    },
  ];

  const mockContacts: ContactItem[] = [
    {
      id: 'C001',
      name: '王大伟',
      role: '基地总负责人',
      department: 'management',
      phone: '138-0000-1111',
      email: 'wang.dw@aquaculture.com',
      expertise: ['生产管理', '成本控制'],
      status: 'online',
    },
    {
      id: 'C002',
      name: '李工',
      role: '高级水产工程师',
      department: 'technical',
      phone: '135-2222-3333',
      email: 'li.eng@tech.com',
      expertise: ['病害防治', '水质改良'],
      status: 'online',
    },
    {
      id: 'C003',
      name: '张师傅',
      role: '1号基地班组长',
      department: 'field',
      phone: '139-4444-5555',
      email: 'zhang.field@prod.com',
      expertise: ['对虾养殖', '日常巡检'],
      status: 'offline',
    },
    {
      id: 'C004',
      name: '陈教授',
      role: '外部技术顾问',
      department: 'external',
      phone: '137-6666-7777',
      email: 'chen.prof@university.edu',
      expertise: ['营养饲料', '基因育种'],
      status: 'online',
    },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProTable<ContactItem>
            headerTitle="组织架构与通讯录"
            columns={columns}
            dataSource={mockContacts}
            rowKey="id"
            search={{ labelWidth: 'auto' }}
            pagination={{ pageSize: 10 }}
            size="small"
            bordered
            toolBarRender={() => [
              <Button key="invite" type="primary">
                邀请成员
              </Button>,
            ]}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Contacts;
