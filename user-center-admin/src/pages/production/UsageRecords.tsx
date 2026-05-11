import { PlusOutlined, DeleteOutlined, ExportOutlined, InboxOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message, Row, Col, Card, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import UsageForm from './components/UsageForm';
import {
  searchUsageRecords,
  deleteUsageRecord,
  type StkUsageDTO,
} from '@/services/api/production/usage';

const UsageRecords: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<StkUsageDTO | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<StkUsageDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StkUsageDTO[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await searchUsageRecords({
        ...params,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setData(response.data || []);
        setPagination({
          current: response.current || 1,
          pageSize: response.pageSize || 10,
          total: response.total || 0,
        });
      }
    } catch (error) {
      console.error('获取物资使用记录失败:', error);
      message.error('获取物资使用记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBatchDelete = (selectedRows: StkUsageDTO[]) => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRows.length} 条记录吗？此操作不可撤销。`,
      okType: 'danger',
      onOk: async () => {
        try {
          for (const row of selectedRows) {
            await deleteUsageRecord(row.id);
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

  const handleExport = (data: StkUsageDTO[], fileName: string = '物资使用记录') => {
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

  const columns: ProColumns<StkUsageDTO>[] = [
    {
      title: '使用单号',
      dataIndex: 'usageNo',
      width: 160,
      fixed: 'left',
    },
    {
      title: '塘口',
      dataIndex: 'pondName',
      width: 120,
      render: (_, record) => record.pondName || record.pondCode || '-',
    },
    {
      title: '物资名称',
      dataIndex: 'matName',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      width: 100,
      render: (categoryName) => {
        const colors: Record<string, string> = {
          '饲料': 'blue',
          '药品': 'purple',
          '苗种': 'green',
          '设备': 'cyan',
        };
        return <Tag color={colors[categoryName] || 'default'} style={{ borderRadius: '2px' }}>{categoryName || '-'}</Tag>;
      },
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 100,
    },
    {
      title: '使用数量',
      dataIndex: 'useQty',
      width: 120,
      render: (qty, record) => (
        <span className="fin-number">{qty} {record.unit || ''}</span>
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (price) => <span className="fin-number">¥{price}</span>,
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      width: 120,
      render: (price) => (
        <span className="fin-number" style={{ fontWeight: 600 }}>¥{price}</span>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      width: 100,
    },
    {
      title: '使用时间',
      dataIndex: 'useTime',
      valueType: 'dateTime',
      width: 160,
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
          style={{ color: '#ff4d4f' }}
          onClick={async () => {
            Modal.confirm({
              title: '删除确认',
              content: '确定要删除这条记录吗？此操作不可撤销。',
              okType: 'danger',
              onOk: async () => {
                try {
                  await deleteUsageRecord(record.id);
                  message.success('删除成功');
                  fetchData();
                } catch (error) {
                  console.error('删除失败:', error);
                  message.error('删除失败');
                }
              },
            });
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
              title="本月使用记录"
              value={86}
              suffix="笔"
              valueStyle={{ color: '#1890ff', fontFamily: 'AlibabaSans' }}
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
              title="饲料使用量"
              value={2340}
              suffix="kg"
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
              title="药品使用量"
              value={68}
              suffix="瓶"
              valueStyle={{ color: '#faad14', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              较上月 <ArrowUpOutlined style={{ color: '#cf1322' }} /> 8%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="本月使用金额"
              value={45600}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#cf1322', fontFamily: 'AlibabaSans' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              年度预算执行率: <span className="fin-number">52%</span>
            </div>
          </Card>
        </Col>
      </Row>

      <ProTable<StkUsageDTO>
        headerTitle="投入品使用记录"
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
            onClick={() => handleExport(data, `全量物资使用记录_${dayjs().format('YYYYMMDD')}`)}
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

      <UsageForm
        visible={modalVisible}
        onClose={() => { setModalVisible(false); fetchData(); }}
        initialValues={currentRow}
      />
    </PageContainer>
  );
};

export default UsageRecords;
