import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Card, Tag, Avatar, Descriptions, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
  searchBreeders,
  getBreederById,
  createBreeder,
  updateBreeder,
  deleteBreeder,
  saveBreederPonds,
} from '@/services/api/breeder';
import { getBaseOptions } from '@/services/api/base';
import { getPondOptions } from '@/services/api/pond';

const { Option } = Select;

const POSITION_OPTIONS = [
  { value: '养殖工', label: '养殖工' },
  { value: '技术员', label: '技术员' },
  { value: '管理员', label: '管理员' },
  { value: '船长', label: '船长' },
  { value: '质检员', label: '质检员' },
  { value: '投喂工', label: '投喂工' },
  { value: '机修工', label: '机修工' },
];

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  1: { label: '在职', color: 'green' },
  0: { label: '离职', color: 'red' },
};

const EmployeeManagement: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [bases, setBases] = useState<{ label: string; value: number }[]>([]);
  const [ponds, setPonds] = useState<{ label: string; value: number }[]>([]);
  const [selectedPonds, setSelectedPonds] = useState<number[]>([]);
  const [baseId, setBaseId] = useState<number | undefined>();

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    const options = await getBaseOptions();
    setBases(options);
  };

  const fetchPonds = async (bId?: number) => {
    if (!bId) { setPonds([]); return; }
    const options = await getPondOptions(bId);
    setPonds(options);
  };

  const handleBaseChange = (value: number) => {
    setBaseId(value);
    form.setFieldValue('baseId', value);
    fetchPonds(value);
    setSelectedPonds([]);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '员工信息',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={40} icon={<UserOutlined />} style={{ marginRight: 12, backgroundColor: '#B54E3C' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.breederName || '-'}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              <PhoneOutlined /> {record.phone || '-'}
            </div>
          </div>
        </div>
      ),
    },
    { title: '工号', dataIndex: 'breederCode', width: 110, ellipsis: true },
    {
      title: '岗位', dataIndex: 'position', width: 90,
      render: (v: string) => v ? <Tag color="#B54E3C">{v}</Tag> : '-',
    },
    { title: '联系电话', dataIndex: 'phone', width: 130 },
    { title: '所属基地', dataIndex: 'baseName', width: 160 },
    {
      title: '关联塘口', dataIndex: 'pondNames', width: 200, search: false,
      render: (_: any, record: any) =>
        record.pondNames?.split('||').filter(Boolean).length
          ? record.pondNames.split('||').filter(Boolean).map((n: string) => <Tag key={n}>{n}</Tag>)
          : '-',
    },
    {
      title: '入职日期', dataIndex: 'hireDate', width: 110, search: false,
      render: (v: string) => v || '-',
    },
    {
      title: '状态', dataIndex: 'status', width: 70,
      render: (_: any, record: any) => {
        const s = STATUS_MAP[record.status];
        return s ? <Tag color={s.color}>{s.label}</Tag> : '未知';
      },
    },
    {
      title: '操作', width: 200, key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#8c8c8c' }}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    setModalVisible(true);
    setSelectedPonds([]);
    setBaseId(undefined);
    form.resetFields();
  };

  const handleEdit = async (record: any) => {
    setEditingEmployee(record);
    setBaseId(record.baseId);
    setSelectedPonds((record.pondIds || '').split(',').filter(Boolean).map(Number));
    setModalVisible(true);
    form.setFieldsValue({
      ...record,
      hireDate: record.hireDate ? dayjs(record.hireDate) : undefined,
    });
    if (record.baseId) {
      const opts = await getPondOptions(record.baseId);
      setPonds(opts);
    }
  };

  const handleViewDetail = async (record: any) => {
    try {
      const res = await getBreederById(record.id);
      setCurrentEmployee(res.data || record);
      setDetailVisible(true);
    } catch {
      message.error('获取详情失败');
    }
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除员工「${record.breederName || ''}」吗？`,
      onOk: async () => {
        await deleteBreeder(record.id);
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        breederCode: values.breederCode,
        breederName: values.breederName,
        phone: values.phone,
        idCard: values.idCard,
        baseId: values.baseId,
        position: values.position,
        hireDate: values.hireDate ? values.hireDate.format('YYYY-MM-DD') : undefined,
        status: values.status ?? 1,
      };

      if (editingEmployee) {
        await updateBreeder(editingEmployee.id, submitData);
        await saveBreederPonds(editingEmployee.id, selectedPonds);
      } else {
        await createBreeder(submitData);
      }

      message.success(editingEmployee ? '更新成功' : '添加成功');
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <ProTable<any>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params) => {
            const result = await searchBreeders({
              current: params.current || 1,
              pageSize: params.pageSize || 10,
              breederName: params.breederName,
              phone: params.phone,
              status: params.status,
            });
            return { data: result.data, success: true, total: result.total };
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            defaultCollapsed: true,
          }}
          toolBarRender={() => [
            <Button key="add" icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              新增员工
            </Button>,
          ]}
        />

        <Modal
          title={editingEmployee ? '编辑员工' : '新增员工'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          width={650}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="breederCode" label="工号">
                  <Input placeholder="自动生成，可不填" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="breederName" label="员工姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                  <Input placeholder="请输入员工姓名" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="idCard" label="身份证号">
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="baseId" label="所属基地" rules={[{ required: true, message: '请选择基地' }]}>
                  <Select placeholder="请选择基地" onChange={handleBaseChange}>
                    {bases.map(b => <Option key={b.value} value={b.value}>{b.label}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="position" label="岗位" rules={[{ required: true, message: '请选择岗位' }]}>
                  <Select placeholder="请选择岗位">
                    {POSITION_OPTIONS.map(p => <Option key={p.value} value={p.value}>{p.label}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="关联塘口">
                  <Select
                    mode="multiple"
                    placeholder="请选择塘口（可多选）"
                    value={selectedPonds}
                    onChange={setSelectedPonds}
                    disabled={!baseId}
                  >
                    {ponds.map(p => <Option key={p.value} value={p.value}>{p.label}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="hireDate" label="入职日期">
                  <DatePicker style={{ width: '100%' }} placeholder="选择入职日期" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
              <Select placeholder="请选择状态">
                <Option value={1}>在职</Option>
                <Option value={0}>离职</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="员工详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={<Button onClick={() => setDetailVisible(false)}>关闭</Button>}
          width={600}
        >
          {currentEmployee && (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="工号">{currentEmployee.breederCode || '-'}</Descriptions.Item>
              <Descriptions.Item label="姓名">{currentEmployee.breederName || '-'}</Descriptions.Item>
              <Descriptions.Item label="岗位">
                {currentEmployee.position ? <Tag color="#B54E3C">{currentEmployee.position}</Tag> : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">{currentEmployee.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{currentEmployee.idCard || '-'}</Descriptions.Item>
              <Descriptions.Item label="入职日期">{currentEmployee.hireDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="所属基地">{currentEmployee.baseName || '-'}</Descriptions.Item>
              <Descriptions.Item label="关联塘口">
                {currentEmployee.pondNames?.split('||').filter(Boolean).length
                  ? currentEmployee.pondNames.split('||').filter(Boolean).map((n: string) => <Tag key={n}>{n}</Tag>)
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {STATUS_MAP[currentEmployee.status] ? (
                  <Tag color={STATUS_MAP[currentEmployee.status].color}>{STATUS_MAP[currentEmployee.status].label}</Tag>
                ) : '-'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default EmployeeManagement;
