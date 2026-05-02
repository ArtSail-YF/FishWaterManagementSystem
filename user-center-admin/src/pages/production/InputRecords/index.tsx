import { PlusOutlined, DeleteOutlined, ExportOutlined, CheckCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, InboxOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Badge, Tooltip, Row, Col, Card, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import { getInputRecords, deleteInputRecord, type InputRecordItem } from '@/services/api/input';
import { MOCK_INPUT_RECORDS } from '@/services/api/mock';

const InputRecords: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<InputRecordItem | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<InputRecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InputRecordItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInputRecords();
      setData(res.data || []);
    } catch (error) {
      console.error('获取投入记录失败，使用降级数据:', error);
      setData(MOCK_INPUT_RECORDS as any);
      message.warning('投入记录已降级为离线模式');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBatchApprove = (selectedRows: InputRecordItem[]) => {
    Modal.confirm({
      title: '批量审核确认',
      content: `确定要审核通过选中的 ${selectedRows.length} 条记录吗？`,
      onOk: () => {
        message.success(`已成功审核通过 ${selectedRows.length} 条记录`);
        setSelectedRows([]);
      },
    });
  };

  const handleBatchDelete = (selectedRows: InputRecordItem[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条记录吗？此操作不可撤销。`,
      okType: 'danger',
      onOk: () => {
        message.success(`已成功删除 ${selectedRows.length} 条记录`);
        setSelectedRows([]);
      },
    });
  };

  /**
   * 模拟数据导出逻辑
   * @param data 要导出的数据
   * @param fileName 导出的文件名
   */
  const handleExport = (data: InputRecordItem[], fileName: string = '投入记录报表') => {
    if (data.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    
    const hide = message.loading(`正在准备 ${fileName}...`, 0);
    
    // 模拟导出过程
    setTimeout(() => {
      hide();
      Modal.success({
        title: '导出成功',
        content: (
          <div>
            <p>已成功生成 <b>{fileName}.xlsx</b></p>
            <p>包含记录: <span className="fin-number">{data.length}</span> 条</p>
            <p>涉及总金额: <span className="fin-number" style={{ color: '#cf1322', fontWeight: 600 }}>
              ¥{data.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
            </span></p>
          </div>
        ),
        okText: '好的',
      });
    }, 1500);
  };

  const columns: ProColumns<InputRecordItem>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      fixed: 'left',
      valueType: 'select',
      valueEnum: {
        in: { text: '采购入库', status: 'Success' },
        out: { text: '领用出库', status: 'Warning' },
      },
      render: (dom, record) => (
        <Tag color={record.type === 'in' ? 'green' : 'orange'} style={{ borderRadius: '2px' }}>
          {record.type === 'in' ? '入库' : '出库'}
        </Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      valueType: 'date',
      width: 100,
    },
    {
      title: '物资名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        feed: { text: '饲料' },
        medicine: { text: '药品' },
        seed: { text: '苗种' },
        equipment: { text: '设备' },
        other: { text: '其他' },
      },
      render: (_, record) => {
        const categoryMap = {
          feed: { color: 'blue', text: '饲料' },
          medicine: { color: 'purple', text: '药品' },
          seed: { color: 'green', text: '苗种' },
          equipment: { color: 'cyan', text: '设备' },
          other: { color: 'default', text: '其他' },
        };
        const config = categoryMap[record.category];
        return <Tag color={config.color} variant="filled" style={{ borderRadius: '2px' }}>{config.text}</Tag>;
      },
    },
    {
      title: '规格',
      dataIndex: 'specification',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
      hideInSearch: true,
      render: (dom, record) => <span className="fin-number">{dom} {record.unit}</span>,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      hideInSearch: true,
      render: (dom) => <span className="fin-number">¥{dom}</span>,
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      width: 120,
      hideInSearch: true,
      render: (dom) => <span className="fin-number" style={{ fontWeight: 600 }}>¥{dom}</span>,
    },
    {
      title: '关联项',
      dataIndex: 'pondName',
      width: 150,
      render: (_, record) => (
        record.type === 'out' ? (
          <Space>
            <Badge status="processing" />
            <span>{record.pondName}</span>
          </Space>
        ) : (
          <Space>
            <Badge status="default" />
            <span style={{ color: '#999' }}>{record.supplier || '仓库入库'}</span>
          </Space>
        )
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待审核', status: 'Processing' },
        approved: { text: '已审核', status: 'Success' },
        rejected: { text: '已驳回', status: 'Error' },
      },
    },
    {
      title: '经办人',
      dataIndex: 'operator',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}>编辑</a>,
        <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => message.info('执行删除')}>删除</a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="当前饲料库存"
              value={4250}
              suffix="kg"
              valueStyle={{ color: '#cf1322', fontFamily: 'AlibabaSans' }}
              prefix={<InboxOutlined />}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              较上月 <ArrowUpOutlined style={{ color: '#cf1322' }} /> 12%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="当前药品库存"
              value={128}
              suffix="瓶"
              valueStyle={{ color: '#3f8600', fontFamily: 'AlibabaSans' }}
              prefix={<InboxOutlined />}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              较上月 <ArrowDownOutlined style={{ color: '#3f8600' }} /> 5%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="待审核投入"
              value={8}
              suffix="笔"
              valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              涉及金额: <span className="fin-number">¥12,450.00</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="本月投入总额"
              value={85600.00}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              年度预算执行率: <span className="fin-number">65%</span>
            </div>
          </Card>
        </Col>
      </Row>

      <ProTable<InputRecordItem>
        headerTitle="投入记录清单"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>已选 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleBatchApprove(selectedRowsState)}
            >
              批量审核
            </Button>
            <Button 
              type="link" 
              icon={<ExportOutlined />} 
              onClick={() => handleExport(selectedRowsState, `批量导出_${dayjs().format('YYYYMMDD')}`)}
            >
              导出报表
            </Button>
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleBatchDelete(selectedRowsState)}
            >
              批量删除
            </Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button 
            key="export" 
            icon={<ExportOutlined />} 
            onClick={() => handleExport(data, `全量投入记录_${dayjs().format('YYYYMMDD')}`)}
          >
            导出全部
          </Button>,
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setCurrentRow(null); setModalVisible(true); }}
          >
            新增记录
          </Button>,
        ]}
        size="small"
        bordered
      />

      <InputForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialValues={currentRow}
      />
    </PageContainer>
  );
};

export default InputRecords;
