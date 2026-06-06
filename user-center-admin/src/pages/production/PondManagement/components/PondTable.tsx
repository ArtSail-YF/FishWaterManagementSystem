import React, { useState } from 'react';
import { Button, Tag, Space, message, Modal, Descriptions } from 'antd';
import { PlusOutlined, VideoCameraOutlined, ApiOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchPonds } from '@/services/api/pond';
import { searchCages } from '@/services/api/cage';
import { searchVsles } from '@/services/api/vsl';
import { mapQueryParamsByCategory } from '@/services/api/utils/apiParamMapper';

interface PondManagementItem {
  id: string | number;
  pondCode?: string;
  pondName?: string;
  cageCode?: string;
  cageName?: string;
  vslCode?: string;
  vslName?: string;
  name: string;
  baseId: string | number;
  area?: number;
  volume?: number;
  breedingVolume?: number;
  depthAvg?: number;
  depthMax?: number;
  waterDepth?: number;
  longitude?: number;
  latitude?: number;
  seaAreaName?: string;
  shapeType?: string;
  bottomType?: string;
  bottomSiltDepth?: number;
  perimeter?: number;
  netBagDepth?: number;
  windResistance?: number;
  mmsi?: string;
  lengthOverall?: number;
  width?: number;
  depth?: number;
  maxSpeed?: number;
  productionCapacity?: number;
  inletCount?: number;
  inletDiameter?: number;
  outletCount?: number;
  outletType?: string;
  aerationType?: string;
  aerationCount?: number;
  aerationPower?: number;
  hasCirculating?: boolean | number;
  hasMonitoring?: boolean | number;
  currentSpecies?: string;
  stockingDate?: string;
  estimatedOutput?: number;
  status: string | number;
  category: 'pond' | 'cage' | 'workboat';
  categoryName: string;
  videoStatus?: 'online' | 'offline' | 'error';
  sensorCount?: number;
  iotNodes?: string[];
  material?: string;
  shipNumber?: string;
  tonnage?: number;
  grossTonnage?: number;
  deadweight?: number;
}

interface PondTableProps {
  actionRef: React.RefObject<any>;
  loading: boolean;
  selectedCategory: 'pond' | 'cage' | 'workboat';
  selectedRows: PondManagementItem[];
  baseId?: number;
  filterName?: string;
  filterStatus?: string;
  onAdd: () => void;
  onEdit: (record: PondManagementItem) => void;
  onDelete: (record: PondManagementItem) => void;
  onBatchDelete: (rows: PondManagementItem[]) => void;
  onDeviceHub: (record: PondManagementItem) => void;
  onVideoMonitor: (record: PondManagementItem) => void;
  onSelectedRowsChange: (rows: PondManagementItem[]) => void;
  onCategoryChange: (category: 'pond' | 'cage' | 'workboat') => void;
  onDataChange: (data: PondManagementItem[]) => void;
}

const PondTable: React.FC<PondTableProps> = ({
  actionRef,
  loading,
  selectedCategory,
  selectedRows,
  baseId,
  filterName,
  filterStatus,
  onAdd,
  onEdit,
  onDelete,
  onBatchDelete,
  onDeviceHub,
  onVideoMonitor,
  onSelectedRowsChange,
  onCategoryChange,
  onDataChange
}) => {
  const [detailRecord, setDetailRecord] = useState<PondManagementItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const renderDetail = () => {
    if (!detailRecord) return null;
    const r = detailRecord;
    const items: { label: string; value: string }[] = [
      { label: '名称', value: r.name },
      { label: '编号', value: r.pondCode || r.cageCode || r.vslCode || '-' },
      { label: '类型', value: r.categoryName },
      { label: '当前品种', value: r.currentSpecies || '-' },
    ];
    if (r.category === 'pond') {
      items.push(
        { label: '面积', value: r.area ? r.area + ' 亩' : '-' },
        { label: '平均水深', value: r.depthAvg ? r.depthAvg + 'm' : '-' },
        { label: '最大水深', value: r.depthMax ? r.depthMax + 'm' : '-' },
        { label: '形状', value: r.shapeType || '-' },
        { label: '底质', value: r.bottomType || '-' },
        { label: '增氧类型', value: r.aerationType || '-' },
        { label: '投苗日期', value: r.stockingDate || '-' },
        { label: '预计产量', value: r.estimatedOutput ? r.estimatedOutput + 'kg' : '-' },
      );
    } else if (r.category === 'cage') {
      items.push(
        { label: '体积', value: r.volume ? r.volume + ' m3' : '-' },
        { label: '海域', value: r.seaAreaName || '-' },
        { label: '水深', value: r.waterDepth ? r.waterDepth + 'm' : '-' },
        { label: '材质', value: r.material || '-' },
        { label: '周长', value: r.perimeter ? r.perimeter + 'm' : '-' },
        { label: '投苗日期', value: r.stockingDate || '-' },
      );
    } else if (r.category === 'workboat') {
      items.push(
        { label: '养殖水体', value: r.breedingVolume ? r.breedingVolume + ' m3' : '-' },
        { label: 'MMSI', value: r.mmsi || '-' },
        { label: '总吨位', value: r.grossTonnage ? r.grossTonnage + 't' : '-' },
        { label: '最大航速', value: r.maxSpeed ? r.maxSpeed + 'kn' : '-' },
        { label: '加工能力', value: r.productionCapacity ? r.productionCapacity + 't/d' : '-' },
      );
    }
    items.push(
      { label: '状态', value: r.status === 'ENABLED' ? '养殖中' : r.status === 'DISABLED' ? '空闲' : '维修中' },
    );
    return (
      <Descriptions column={1} bordered size="small">
        {items.map((item, idx) => (
          <Descriptions.Item key={idx} label={item.label}>{item.value}</Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  const columns: ProColumns<PondManagementItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text, record) => (
        <Space>
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <Tag color={record.category === 'pond' ? 'blue' : record.category === 'cage' ? 'green' : 'orange'}>
            {record.categoryName}
          </Tag>
          {record.hasMonitoring ? <VideoCameraOutlined style={{ color: '#1f2937' }} /> : null}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueEnum: {
        'ENABLED': { text: '养殖中', status: 'Success' },
        'DISABLED': { text: '空闲', status: 'Default' },
        'MAINTENANCE': { text: '维修中', status: 'Error' },
      },
      render: (status: string) => {
        const statusMap = {
          'ENABLED': { color: 'green', text: '养殖中' },
          'DISABLED': { color: 'default', text: '空闲' },
          'MAINTENANCE': { color: 'red', text: '维修中' },
        };
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small"
            onClick={() => { setDetailRecord(record); setDetailVisible(true); }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<VideoCameraOutlined />}
            onClick={() => onVideoMonitor(record)}
            disabled={record.videoStatus !== 'online'}>
            视频
          </Button>
          <Button type="link" size="small" icon={<ApiOutlined />}
            onClick={() => onDeviceHub(record)}>
            物联
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = async (params: any) => {
    try {
      const mappedParams = {
        ...mapQueryParamsByCategory(selectedCategory, params),
        baseId,
        name: filterName || undefined,
        status: filterStatus || undefined,
      };
      let response;
      switch (selectedCategory) {
        case 'pond':
          response = await searchPonds(mappedParams);
          break;
        case 'cage':
          response = await searchCages(mappedParams);
          break;
        case 'workboat':
          response = await searchVsles(mappedParams);
          break;
        default:
          response = await searchPonds(mappedParams);
      }
      const data = (response.data?.records || response.data || [])?.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.pondName || item.cageName || item.vslName || item.name,
        category: item.category || selectedCategory,
        categoryName: item.categoryName
          || (item.category === 'pond' ? '塘口' : item.category === 'cage' ? '网箱' : '工船'),
      }));
      onDataChange(data);
      return { data, success: true, total: response.data?.total || response.total || data.length || 0 };
    } catch {
      message.error('获取数据失败');
      return { data: [], success: false, total: 0 };
    }
  };

  const categoryLabel = selectedCategory === 'pond' ? '塘口' : selectedCategory === 'cage' ? '网箱' : '工船';

  return (
    <>
      <ProTable<PondManagementItem>
        headerTitle={categoryLabel + '管理'}
        columns={columns}
        actionRef={actionRef}
        request={handleSearch}
        rowSelection={{
          selectedRowKeys: selectedRows.map(row => row.id),
          onChange: (_, selectedRows) => onSelectedRowsChange(selectedRows),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={16}>
            <span>已选 {selectedRowKeys.length} 项</span>
            <Button type="link" danger onClick={() => onBatchDelete(selectedRows)}>批量删除</Button>
            <Button type="link" onClick={onCleanSelected}>取消选择</Button>
          </Space>
        )}
        toolBarRender={() => [
          <Space key="toggle">
            <Button type={selectedCategory === 'pond' ? 'primary' : 'default'} size="small"
              onClick={() => onCategoryChange('pond')}>塘口</Button>
            <Button type={selectedCategory === 'cage' ? 'primary' : 'default'} size="small"
              onClick={() => onCategoryChange('cage')}>网箱</Button>
            <Button type={selectedCategory === 'workboat' ? 'primary' : 'default'} size="small"
              onClick={() => onCategoryChange('workboat')}>工船</Button>
          </Space>,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新建</Button>,
        ]}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        open={detailVisible}
        onCancel={() => { setDetailVisible(false); setDetailRecord(null); }}
        footer={<Button onClick={() => { setDetailVisible(false); setDetailRecord(null); }}>关闭</Button>}
        width={520}
      >
        {renderDetail()}
      </Modal>
    </>
  );
};

export default PondTable;
