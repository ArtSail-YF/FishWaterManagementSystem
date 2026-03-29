import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Rate, Badge, Tooltip, message, Avatar } from 'antd';
import { ShopOutlined, PhoneOutlined, SafetyCertificateOutlined, StarOutlined } from '@ant-design/icons';
import React from 'react';

interface SupplierItem {
  id: string;
  name: string;
  category: 'feed' | 'medicine' | 'seed' | 'equipment';
  rating: number;
  contact: string;
  phone: string;
  mainProducts: string[];
  isCertified: boolean;
  region: string;
}

const Suppliers: React.FC = () => {
  const columns: ProColumns<SupplierItem>[] = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      copyable: true,
      render: (text, record) => (
        <Space>
          <Avatar 
            shape="square" 
            icon={<ShopOutlined />} 
            style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} 
          />
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            {record.isCertified && (
              <Tag color="gold" style={{ fontSize: '10px', scale: '0.85', margin: 0, transformOrigin: 'left center' }}>
                <SafetyCertificateOutlined /> 官方认证
              </Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: '物资分类',
      dataIndex: 'category',
      valueType: 'select',
      valueEnum: {
        feed: { text: '饲料供应商', status: 'Processing' },
        medicine: { text: '动保/药品', status: 'Warning' },
        seed: { text: '苗种场', status: 'Success' },
        equipment: { text: '智能设备', status: 'Default' },
      },
    },
    {
      title: '主营产品',
      dataIndex: 'mainProducts',
      render: (products: any) => (
        <Space size={[0, 4]} wrap>
          {products.map((p: string) => (
            <Tag key={p} style={{ fontSize: '11px' }}>{p}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'rating',
      width: 160,
      render: (val: any) => <Rate disabled defaultValue={val} style={{ fontSize: '14px' }} />,
    },
    {
      title: '联系信息',
      dataIndex: 'contact',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '13px' }}>{text}</Text>
          <Text type="secondary" className="fin-number" style={{ fontSize: '12px' }}>
            <PhoneOutlined /> {record.phone}
          </Text>
        </Space>
      ),
    },
    {
      title: '所在地区',
      dataIndex: 'region',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: () => [
        <a key="detail" onClick={() => message.info('查看供应商详情')}>详情</a>,
        <a key="contact" onClick={() => message.success('已发起即时通讯')}>咨询</a>,
      ],
    },
  ];

  const mockSuppliers: SupplierItem[] = [
    {
      id: 'S001',
      name: '海大集团 (嘉兴分公司)',
      category: 'feed',
      rating: 5,
      contact: '张经理',
      phone: '138-xxxx-8888',
      mainProducts: ['虾料1号', '高蛋白膨化料'],
      isCertified: true,
      region: '浙江嘉兴',
    },
    {
      id: 'S002',
      name: '农富康生物科技',
      category: 'medicine',
      rating: 4.5,
      contact: '李技术员',
      phone: '135-xxxx-9999',
      mainProducts: ['改底颗粒', '解毒超能液'],
      isCertified: true,
      region: '广东湛江',
    },
    {
      id: 'S003',
      name: '正大种苗中心',
      category: 'seed',
      rating: 5,
      contact: '王场长',
      phone: '139-xxxx-6666',
      mainProducts: ['一代苗 (P5)', '抗病苗'],
      isCertified: true,
      region: '海南文昌',
    },
    {
      id: 'S004',
      name: '恒盛智慧机电',
      category: 'equipment',
      rating: 4,
      contact: '陈工',
      phone: '137-xxxx-1234',
      mainProducts: ['变频增氧机', '在线水质监测仪'],
      isCertified: false,
      region: '江苏无锡',
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<SupplierItem>
        headerTitle="合格供应商名录"
        columns={columns}
        dataSource={mockSuppliers}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        size="small"
        bordered
        toolBarRender={() => [
          <Button key="apply" type="primary" icon={<PlusOutlined />}>
            申请入驻
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

import { Typography } from 'antd';
const { Text } = Typography;
import { PlusOutlined } from '@ant-design/icons';

export default Suppliers;
