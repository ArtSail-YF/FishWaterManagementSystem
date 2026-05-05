import React, { useState, useEffect } from 'react';
import { Button, Tag, Space, Badge, message, Card, Tooltip } from 'antd';
import { PlusOutlined, VideoCameraOutlined, ApiOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchPonds } from '@/services/api/pond';
import { searchCages } from '@/services/api/cage';
import { searchVsles } from '@/services/api/vsl';
import { mapQueryParamsByCategory } from '@/services/api/utils/apiParamMapper';

interface PondManagementItem {
  id: string | number;
  // 基础身份信息
  pondCode?: string;
  pondName?: string;
  cageCode?: string;
  cageName?: string;
  vslCode?: string;
  vslName?: string;
  name: string; // 统一显示名称
  baseId: string | number;
  
  // 物理规格与环境
  area?: number; // 塘口面积
  volume?: number; // 网箱容积
  breedingVolume?: number; // 工船养殖水体
  depthAvg?: number;
  depthMax?: number;
  waterDepth?: number; // 海域水深
  longitude?: number;
  latitude?: number;
  seaAreaName?: string;
  shapeType?: string;
  bottomType?: string;
  bottomSiltDepth?: number;
  perimeter?: number;
  netBagDepth?: number;
  windResistance?: number;
  
  // 船舶参数
  mmsi?: string;
  lengthOverall?: number;
  width?: number;
  depth?: number;
  maxSpeed?: number;
  productionCapacity?: number;
  
  // 进排水与增氧设备
  inletCount?: number;
  inletDiameter?: number;
  outletCount?: number;
  outletType?: string;
  aerationType?: string;
  aerationCount?: number;
  aerationPower?: number;
  
  // 智能化与状态
  hasCirculating?: boolean | number;
  hasMonitoring?: boolean | number;
  currentSpecies?: string;
  stockingDate?: string;
  estimatedOutput?: number;
  status: string | number;
  
  // UI 辅助字段
  category: 'pond' | 'cage' | 'workboat';
  categoryName: string;
  videoStatus?: 'online' | 'offline' | 'error';
  sensorCount?: number;
  iotNodes?: string[];
  
  // 其他特定字段
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
  const columns: ProColumns<PondManagementItem>[] = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      search: false,
      render: (_, record) => record.pondCode || record.cageCode || record.vslCode,
    },
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
          {record.hasMonitoring ? <VideoCameraOutlined style={{ color: '#1890ff' }} /> : null}
        </Space>
      ),
    },
    {
      title: '所属基地',
      dataIndex: 'baseName',
      key: 'baseName',
      width: 150,
      render: (_, record) => record.baseName || '-',
    },
    {
      title: '当前品种',
      dataIndex: 'currentSpecies',
      key: 'currentSpecies',
      width: 120,
      valueEnum: {
        '南美白对虾': { text: '南美白对虾' },
        '大黄鱼': { text: '大黄鱼' },
        '金鲳鱼': { text: '金鲳鱼' },
        '黑鮶': { text: '黑鮶' },
        '皱纹盘鲍': { text: '皱纹盘鲍' },
        '东星斑': { text: '东星斑' },
        '螠蛏': { text: '螠蛏' },
      },
    },
    {
      title: '规模',
      dataIndex: 'area',
      key: 'scale',
      width: 120,
      search: false,
      render: (_, record) => {
        if (record.category === 'pond') return `${record.area} 亩`;
        if (record.category === 'cage') return `${record.volume} m³`;
        if (record.category === 'workboat') return `${record.breedingVolume} m³`;
        return '-';
      },
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
      title: '投苗日期',
      dataIndex: 'stockingDate',
      key: 'stockingDate',
      width: 120,
      valueType: 'date',
      search: false,
    },
    {
      title: '详情',
      key: 'details',
      width: 80,
      search: false,
      render: (_, record) => {
        const renderTooltipContent = () => {
          if (record.category === 'pond') {
            return (
              <div>
                <div>平均水深: {record.depthAvg}m</div>
                <div>最大水深: {record.depthMax}m</div>
                <div>形状: {record.shapeType}</div>
                <div>底质: {record.bottomType}</div>
                <div>底泥深度: {record.bottomSiltDepth}m</div>
                <hr style={{ margin: '4px 0' }} />
                <div>增氧类型: {record.aerationType}</div>
                <div>增氧功率: {record.aerationPower}kW</div>
              </div>
            );
          }
          if (record.category === 'cage') {
            return (
              <div>
                <div>海域: {record.seaAreaName}</div>
                <div>水深: {record.waterDepth}m</div>
                <div>抗风等级: {record.windResistance}级</div>
                <div>材质: {record.material}</div>
                <hr style={{ margin: '4px 0' }} />
                <div>周长: {record.perimeter}m</div>
                <div>网囊深度: {record.netBagDepth}m</div>
                <div>坐标: {record.longitude?.toFixed(4)}, {record.latitude?.toFixed(4)}</div>
              </div>
            );
          }
          if (record.category === 'workboat') {
            return (
              <div>
                <div>MMSI: {record.mmsi}</div>
                <div>主尺度: {record.lengthOverall}m x {record.width}m x {record.depth}m</div>
                <div>总吨位: {record.grossTonnage}t</div>
                <div>载重吨: {record.deadweight}t</div>
                <hr style={{ margin: '4px 0' }} />
                <div>最大航速: {record.maxSpeed}kn</div>
                <div>加工能力: {record.productionCapacity}t/d</div>
              </div>
            );
          }
          return null;
        };

        return (
          <Tooltip title={renderTooltipContent()}>
            <a style={{ fontSize: '12px' }}>查看档案</a>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<VideoCameraOutlined />}
            onClick={() => onVideoMonitor(record)}
            disabled={record.videoStatus !== 'online'}
          >
            视频
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ApiOutlined />}
            onClick={() => onDeviceHub(record)}
          >
            物联
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = async (params: any) => {
    try {
      // 打印调试信息
      console.log('原始筛选参数:', params);
      
      // 映射查询参数
      const mappedParams = mapQueryParamsByCategory(selectedCategory, params);
      
      // 打印调试信息
      console.log('映射后的参数:', mappedParams);
      
      // 根据选择的类别调用不同的API
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
      
      // 转换数据格式
      const data = (response.data?.records || response.data || [])?.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.pondName || item.cageName || item.vslName || item.name,
        category: selectedCategory,
        categoryName: selectedCategory === 'pond' ? '塘口' : selectedCategory === 'cage' ? '网箱' : '工船',
        // 确保布尔值/TinyInt转换正确
        hasMonitoring: item.hasMonitoring === 1 || item.hasMonitoring === true,
        hasCirculating: item.hasCirculating === 1 || item.hasCirculating === true,
      })) || [];
      
      // 通知父组件数据变化
      onDataChange(data);
      
      return {
        data,
        success: true,
        total: response.data?.total || response.total || 0,
      };
    } catch (error) {
      message.error('获取数据失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <ProTable<PondManagementItem>
      headerTitle="高级表格"
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      cardBordered={{
        search: true,
        table: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      request={handleSearch}
      rowSelection={{
        selectedRowKeys: selectedRows.map(row => row.id),
        onChange: (_, selectedRows) => onSelectedRowsChange(selectedRows),
      }}
      tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
        <Space size={16}>
          <span>已选 {selectedRowKeys.length} 项</span>
          <Button
            type="link"
            danger
            onClick={() => onBatchDelete(selectedRows)}
          >
            批量删除
          </Button>
          <Button type="link" onClick={onCleanSelected}>
            取消选择
          </Button>
        </Space>
      )}
      toolBarRender={() => [
        <Button
          key="category"
          type={selectedCategory === 'pond' ? 'primary' : 'default'}
          onClick={() => onCategoryChange('pond')}
        >
          塘口
        </Button>,
        <Button
          key="cage"
          type={selectedCategory === 'cage' ? 'primary' : 'default'}
          onClick={() => onCategoryChange('cage')}
        >
          网箱
        </Button>,
        <Button
          key="workboat"
          type={selectedCategory === 'workboat' ? 'primary' : 'default'}
          onClick={() => onCategoryChange('workboat')}
        >
          工船
        </Button>,
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={onAdd}
          loading={loading}
        >
          新建{selectedCategory === 'pond' ? '塘口' : selectedCategory === 'cage' ? '网箱' : '工船'}
        </Button>,
      ]}
    />
  );
};

export default PondTable;