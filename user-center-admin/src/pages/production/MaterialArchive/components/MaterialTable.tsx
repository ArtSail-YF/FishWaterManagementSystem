import React from 'react';
import { Button, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchMaterials } from '@/services/api/material/info';
import type { MatCategory } from '@/services/api/material/category';

interface MaterialInfo {
  id: number;
  matCode: string;
  matName: string;
  catId: number;
  catName: string;
  spec: string;
  unit: string;
  supplierId: number;
  minStock: number;
  maxStock: number;
  status: number;
  withdrawalDays: number;
  unitPrice: number;
  approvalCode: string;
  manufacturer: string;
  createTime: string;
  fullData?: any;
}

interface MaterialTableProps {
  actionRef: React.RefObject<ActionType>;
  loading: boolean;
  categories: MatCategory[];
  onAdd: () => void;
  onEdit: (record: MaterialInfo) => void;
  onDelete: (record: MaterialInfo) => void;
  onDataChange: (data: MaterialInfo[]) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  actionRef,
  loading,
  categories,
  onAdd,
  onEdit,
  onDelete,
  onDataChange
}) => {
  console.log('MaterialTable 收到的分类数据:', categories);

  const getCategoryName = (catId?: number | string) => {
    if (!catId) return '-';
    const cat = categories.find(c => Number(c.id) === Number(catId));
    return cat?.catName || '-';
  };

  const getCategoryCode = (catId?: number | string) => {
    if (!catId) return undefined;
    const cat = categories.find(c => Number(c.id) === Number(catId));
    return cat?.catCode;
  };

  const renderType = (catCode?: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      feed: { color: 'blue', text: '饲料' },
      drug: { color: 'purple', text: '渔药' },
      disinfectant: { color: 'green', text: '消毒剂' },
      tool: { color: 'cyan', text: '工具设备' },
      other: { color: 'default', text: '其他' },
    };
    const config = typeMap[catCode || 'other'] || typeMap.other;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ProColumns<MaterialInfo>[] = [
    {
      title: '物资编码',
      dataIndex: 'matCode',
      key: 'matCode',
      width: 130,
      copyable: true,
    },
    {
      title: '物资名称',
      dataIndex: 'matName',
      key: 'matName',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: '物资类型',
      dataIndex: 'catId',
      key: 'catId',
      width: 120,
      valueType: 'select',
      valueEnum: categories.reduce((acc, cat) => {
        acc[cat.id!] = { text: cat.catName };
        return acc;
      }, {} as Record<number, { text: string }>),
      render: (_, record) => {
        const typeMap: Record<string, { color: string }> = {
          feed: { color: 'blue' },
          drug: { color: 'purple' },
          disinfectant: { color: 'green' },
          tool: { color: 'cyan' },
        };
        const cat = categories.find(c => Number(c.id) === Number(record.catId));
        const color = cat?.catCode ? typeMap[cat.catCode]?.color : 'default';
        return <Tag color={color}>{record.catName || '-'}</Tag>;
      },
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      width: 120,
      search: false,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      search: false,
    },
    {
      title: '参考单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      search: false,
      render: (text) => text ? `¥${text}` : '-',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '批准文号',
      dataIndex: 'approvalCode',
      key: 'approvalCode',
      width: 130,
      ellipsis: true,
      search: false,
    },
    {
      title: '休药期(天)',
      dataIndex: 'withdrawalDays',
      key: 'withdrawalDays',
      width: 100,
      search: false,
    },
    {
      title: '库存范围',
      dataIndex: 'minStock',
      key: 'minStock',
      width: 120,
      search: false,
      render: (_, record) => {
        if (!record.minStock && !record.maxStock) return '-';
        return `${record.minStock || '0'} ~ ${record.maxStock || '∞'}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '停用', status: 'Default' },
      },
      render: (status) => {
        const isEnabled = status === 1 || status === '1';
        return <Tag color={isEnabled ? 'green' : 'red'}>{isEnabled ? '启用' : '停用'}</Tag>;
      },
    },
    {
      title: '详情',
      key: 'details',
      width: 80,
      search: false,
      render: (_, record) => (
        <Tooltip 
          title={
            <div>
              <div>物资编码: {record.matCode}</div>
              <div>规格: {record.spec || '-'}</div>
              <div>单位: {record.unit || '-'}</div>
              <div>生产厂家: {record.manufacturer || '-'}</div>
              <div>批准文号: {record.approvalCode || '-'}</div>
              <hr style={{ margin: '4px 0' }} />
              <div>最低库存: {record.minStock || '-'}</div>
              <div>最高库存: {record.maxStock || '-'}</div>
              <div>休药期: {record.withdrawalDays ? `${record.withdrawalDays}天` : '-'}</div>
            </div>
          }
        >
          <a style={{ fontSize: '12px' }}>查看档案</a>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      search: false,
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProTable<MaterialInfo>
      headerTitle="物资档案清单"
      columns={columns}
      actionRef={actionRef}
      cardBordered={{
        search: true,
        table: true,
      }}
      request={async (params) => {
        try {
          const queryParams = {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            matCode: params.matCode,
            matName: params.matName,
            catId: params.catId,
            status: params.status,
          };

          const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => 
              value !== undefined && value !== '' && value !== null
            )
          );

          const response = await searchMaterials(filteredParams);

          const records = response.data?.records || response.data || [];

          const data = records.map((item: any) => ({
            id: item.id,
            matCode: item.matCode,
            matName: item.matName,
            catId: item.catId,
            catName: item.catName,
            spec: item.spec,
            unit: item.unit,
            supplierId: item.supplierId,
            minStock: item.minStock,
            maxStock: item.maxStock,
            status: item.status,
            withdrawalDays: item.withdrawalDays,
            unitPrice: item.unitPrice,
            approvalCode: item.approvalCode,
            manufacturer: item.manufacturer,
            createTime: item.createTime,
            fullData: item
          })) || [];

          onDataChange(data);

          return {
            data,
            success: true,
            total: response.data?.total || response.total || records.length || 0,
          };
        } catch (error) {
          message.error('获取数据失败');
          return {
            data: [],
            success: false,
            total: 0,
          };
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      expandable={{
        expandIcon: ({ expanded, onExpand, record }) => (
          <FileTextOutlined
            onClick={(e) => onExpand(record, e)}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#1f2937',
            }}
          />
        ),
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={onAdd}
          loading={loading}
        >
          新建物资
        </Button>,
      ]}
    />
  );
};

export default MaterialTable;
