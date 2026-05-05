import React from 'react';
import { Button, Tag, message, Card, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { searchBases } from '@/services/api/base';

interface BaseInfo {
  id: number;
  baseCode: string;
  baseName: string;
  name: string; // 统一显示名称
  code: string; // 统一显示编码
  breederId: number;
  deptId: number;
  address: string;
  longitude: number;
  latitude: number;
  totalArea: number;
  waterArea: number;
  waterSource: string;
  waterQualityGrade: string;
  soilType: string;
  phValue: number;
  powerSupply: string;
  transformerCapacity: number;
  roadCondition: string;
  drainageSystem: string;
  isPollutionFree: number;
  taiwanCooperation: number;
  greenCertification: string;
  certificationImg: string;
  deepSeaCertified: number;
  seaAreaLicense: string;
  environmentalAssessment: string;
  remark: string;
  status: number | string;
  createTime: string;
  fullData?: any;
}

interface BaseTableProps {
  actionRef: React.RefObject<ActionType>;
  loading: boolean;
  onAdd: () => void;
  onEdit: (record: BaseInfo) => void;
  onDelete: (record: BaseInfo) => void;
  onDataChange: (data: BaseInfo[]) => void;
}

const BaseTable: React.FC<BaseTableProps> = ({
  actionRef,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onDataChange
}) => {
  const columns: ProColumns<BaseInfo>[] = [
    {
      title: '基地编号',
      dataIndex: 'baseCode',
      key: 'baseCode',
      width: 120,
    },
    {
      title: '基地名称',
      dataIndex: 'baseName',
      key: 'baseName',
      width: 180,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: '总面积(亩)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 100,
      search: false,
      sorter: (a, b) => a.totalArea - b.totalArea,
    },
    {
      title: '水面面积(亩)',
      dataIndex: 'waterArea',
      key: 'waterArea',
      width: 100,
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueEnum: {
        1: { text: '运营中', status: 'Success' },
        0: { text: '停用', status: 'Error' },
      },
      render: (status) => {
        const isOnline = status === 1 || status === '1' || status === 'active';
        return <Tag color={isOnline ? 'green' : 'red'}>{isOnline ? '运营中' : '停用'}</Tag>;
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
              <div>水质等级: {record.waterQualityGrade}</div>
              <div>PH值: {record.phValue}</div>
              <div>底质类型: {record.soilType}</div>
              <div>水源: {record.waterSource}</div>
              <hr style={{ margin: '4px 0' }} />
              <div>变压器容量: {record.transformerCapacity}kVA</div>
              <div>路况: {record.roadCondition}</div>
              <div>无公害认证: {record.isPollutionFree ? '是' : '否'}</div>
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
    <ProTable<BaseInfo>
      headerTitle="高级表格"
      columns={columns}
      actionRef={actionRef}
      cardBordered={{
        search: true,
        table: true,
      }}
      request={async (params) => {
        try {
          // 构建与后端对齐的查询参数
          const queryParams = {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            baseCode: params.baseCode,
            baseName: params.baseName,
            address: params.address,
            breederId: params.breederId,
            deptId: params.deptId,
            status: params.status,
          };
          
          // 过滤掉undefined和空值参数
          const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => 
              value !== undefined && value !== '' && value !== null
            )
          );
          
          const response = await searchBases(filteredParams);
          
          // 获取记录列表，支持嵌套的 records 结构或直接的数组结构
          const records = response.data?.records || response.data || [];
          
          const data = records.map((item: any) => ({
            id: item.id,
            baseCode: item.baseCode,
            baseName: item.baseName,
            name: item.baseName,
            code: item.baseCode,
            address: item.address,
            totalArea: item.totalArea,
            waterArea: item.waterArea,
            waterQualityGrade: item.waterQualityGrade,
            phValue: item.phValue,
            soilType: item.soilType,
            waterSource: item.waterSource,
            transformerCapacity: item.transformerCapacity,
            roadCondition: item.roadCondition,
            isPollutionFree: item.isPollutionFree,
            status: item.status,
            createTime: item.createTime,
            fullData: item
          })) || [];
          
          // 通知父组件数据变化
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
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={onAdd}
          loading={loading}
        >
          新建基地
        </Button>,
      ]}
    />
  );
};

export default BaseTable;