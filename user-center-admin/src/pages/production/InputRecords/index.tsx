import { PlusOutlined, DeleteOutlined, ExportOutlined, CheckCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, InboxOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Badge, Tooltip, Row, Col, Card, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import {
  searchStockRecords,
  deleteStockRecord,
  type StkRecordDTO
} from '@/services/api/production/stock';

const InputRecords: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<StkRecordDTO | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<StkRecordDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StkRecordDTO[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const res = await searchStockRecords({
        ...params,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (res.success) {
        setData(res.data || []);
        setPagination({
          current: res.current || 1,
          pageSize: res.pageSize || 10,
          total: res.total || 0,
        });
      }
    } catch (error) {
      console.error('获取库存记录失败:', error);
      message.error('获取库存记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBatchApprove = (selectedRows: StkRecordDTO[]) => {
    Modal.confirm({
      title: '批量审核确认',
      content: `确定要审核通过选中的 ${selectedRows.length} 条记录吗？`,
      onOk: () => {
        message.success(`已成功审核通过 ${selectedRows.length} 条记录`);
        setSelectedRows([]);
      },
    });
  };

  const handleBatchDelete = (selectedRows: StkRecordDTO[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条记录吗？此操作不可撤销。`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            await deleteStockRecord(row.id);
          }
          message.success(`已成功删除 ${selectedRows.length} 条记录`);
          setSelectedRows([]);
          fetchData();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  const handleExport = (data: StkRecordDTO[], fileName: string = '投入记录报表') => {
    if (data.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }

    const hide = message.loading(`正在准备 ${fileName}...`, 0);

    setTimeout(() => {
      hide();
      Modal.success({
        title: '导出成功',
        content: (
          <div>
            <p>已成功生成 <b>{fileName}.xlsx</b></p>
            <p>包含记录: <span className="fin-number">{data.length}</span> 条</p>
          </div>
        ),
        okText: '好的',
      });
    }, 1500);
  };

  const columns: ProColumns<StkRecordDTO>[] = [
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
      render: (type: string) => (
        <Tag color={type === 'in' ? 'green' : 'orange'} style={{ borderRadius: '2px' }}>
          {type === 'in' ? '入库' : '出库'}
        </Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '记录编号',
      dataIndex: 'recordNo',
      width: 140,
      ellipsis: true,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      width: 120,
      search: false,
    },
    {
      title: '变动数量',
      dataIndex: 'changeQty',
      width: 120,
      search: false,
      render: (qty: number, record: StkRecordDTO) => (
        <span className="fin-number" style={{ color: record.type === 'in' ? '#3f8600' : '#cf1322' }}>
          {record.type === 'in' ? '+' : '-'}{qty}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      search: false,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}>编辑</a>,
        <a
          key="delete"
          style={{ color: '#ef4444' }}
          onClick={async () => {
            try {
              await deleteStockRecord(record.id);
              message.success('删除成功');
              fetchData();
            } catch (error) {
              console.error('删除失败:', error);
              message.error('删除失败');
            }
          }}
        >
          删除
        </a>,
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
              valueStyle={{ color: '#9ca3af', fontFamily: 'AlibabaSans' }}
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
              valueStyle={{ color: '#1f2937', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              年度预算执行率: <span className="fin-number">65%</span>
            </div>
          </Card>
        </Col>
      </Row>

      <ProTable<StkRecordDTO>
        headerTitle="投入记录清单"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
            fetchData({ current: page, pageSize: pageSize || 10 });
          },
        }}
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
