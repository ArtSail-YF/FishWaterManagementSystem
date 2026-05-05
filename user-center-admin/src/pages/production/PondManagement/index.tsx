import { Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useState, useRef } from 'react';
import DeviceHubDrawer from './components/DeviceHubDrawer';
import PondManagementStats from './components/PondManagementStats';
import PondModal from './components/PondModal';
import PondTable from './components/PondTable';
import { createPond, updatePond, deletePond } from '@/services/api/pond';
import { createCage, updateCage, deleteCage } from '@/services/api/cage';
import { createVsl, updateVsl, deleteVsl } from '@/services/api/vsl';
import { mapCreateUpdateParamsByCategory } from '@/services/api/utils/apiParamMapper';

export interface PondManagementItem {
  id: string | number;
  pondCode: string;
  pondName: string;
  name: string;
  type: string;
  area: number;
  depthAvg: number;
  depthMax: number;
  depth: number;
  shapeType: string;
  bottomType: string;
  aerationType: string;
  aerationCount: number;
  aerationPower: number;
  hasCirculating: boolean;
  hasMonitoring: boolean;
  currentSpecies: string;
  stockingDate: string;
  estimatedOutput: number;
  videoStatus: 'online' | 'offline' | 'error';
  videoUrl?: string;
  sensorCount: number;
  iotNodes: string[];
  status: string;
  category: 'pond' | 'cage' | 'workboat';
  categoryName: string;
  cageNumber?: string;
  compartment?: string;
  tonnage?: number;
  capacity?: number;
  material?: string;
  shipNumber?: string;
}

const PondManagement: React.FC = () => {
  const [deviceDrawerVisible, setDeviceDrawerVisible] = useState(false);
  const [pondModalVisible, setPondModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<PondManagementItem | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<PondManagementItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'pond' | 'cage' | 'workboat'>('pond');
  const [editingRecord, setEditingRecord] = useState<PondManagementItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<PondManagementItem[]>([]);
  const actionRef = useRef<any>();

  /**
   * 批量删除
   */
  const handleBatchDelete = (selectedRows: PondManagementItem[]) => {
    const categoryCounts = {
      pond: selectedRows.filter(row => row.category === 'pond').length,
      cage: selectedRows.filter(row => row.category === 'cage').length,
      workboat: selectedRows.filter(row => row.category === 'workboat').length,
    };
    
    const categoryText = [];
    if (categoryCounts.pond > 0) categoryText.push(`${categoryCounts.pond}个塘口`);
    if (categoryCounts.cage > 0) categoryText.push(`${categoryCounts.cage}个网箱`);
    if (categoryCounts.workboat > 0) categoryText.push(`${categoryCounts.workboat}个工船`);
    
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${categoryText.join('、')} 吗？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          for (const row of selectedRows) {
            switch (row.category) {
              case 'pond':
                await deletePond(row.id);
                break;
              case 'cage':
                await deleteCage(row.id);
                break;
              case 'workboat':
                await deleteVsl(row.id);
                break;
              default:
                await deletePond(row.id);
            }
          }
          message.success(`已成功删除 ${selectedRows.length} 个资产`);
          setSelectedRows([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  /**
   * 批量导出
   */
  const handleBatchExport = (selectedRows: PondManagementItem[]) => {
    message.loading('正在生成导出文件...');
    setTimeout(() => {
      message.success(`已成功导出 ${selectedRows.length} 条塘口数据 (Excel格式)`);
    }, 1000);
  };

  /**
   * 单个删除
   */
  const handleDelete = async (record: PondManagementItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除${record.category === 'pond' ? '塘口' : record.category === 'cage' ? '网箱' : '工船'} ${record.name} 及其所有关联资产吗？`,
      onOk: async () => {
        try {
          setLoading(true);
          let response;
          switch (record.category) {
            case 'pond':
              response = await deletePond(record.id);
              break;
            case 'cage':
              response = await deleteCage(record.id);
              break;
            case 'workboat':
              response = await deleteVsl(record.id);
              break;
            default:
              response = await deletePond(record.id);
          }
          if (response.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setPondModalVisible(true);
  };

  const handleEdit = (record: PondManagementItem) => {
    setEditingRecord(record);
    setPondModalVisible(true);
  };

  const handlePondSuccess = async (values: any) => {
    try {
      setLoading(true);
      
      const requestData = mapCreateUpdateParamsByCategory(selectedCategory, {
        pondName: values.pondName,
        pondCode: values.pondCode,
        baseId: values.baseId,
        area: values.area,
        depthAvg: values.depthAvg,
        depthMax: values.depthMax,
        stockingDate: values.stockingDate,
        estimatedOutput: values.estimatedOutput,
        waterQuality: values.waterQuality,
        capacity: values.capacity,
        tonnage: values.tonnage,
        material: values.material,
        compartment: values.compartment,
        shipNumber: values.shipNumber,
        status: values.status,
        type: values.type,
      });
      
      if (editingRecord) {
        let response;
        switch (selectedCategory) {
          case 'pond':
            response = await updatePond(editingRecord.id, requestData);
            break;
          case 'cage':
            response = await updateCage(editingRecord.id, requestData);
            break;
          case 'workboat':
            response = await updateVsl(editingRecord.id, requestData);
            break;
          default:
            response = await updatePond(editingRecord.id, requestData);
        }
        
        if (response.code === 200) {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        let response;
        switch (selectedCategory) {
          case 'pond':
            response = await createPond(requestData);
            break;
          case 'cage':
            response = await createCage(requestData);
            break;
          case 'workboat':
            response = await createVsl(requestData);
            break;
          default:
            response = await createPond(requestData);
        }
        
        if (response.code === 200) {
          message.success('添加成功');
        } else {
          message.error(response.message || '添加失败');
          return;
        }
      }
      
      setPondModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceHub = (record: PondManagementItem) => {
    setCurrentRow(record);
    setDeviceDrawerVisible(true);
  };

  const handleVideoMonitor = (record: PondManagementItem) => {
    if (record.videoStatus === 'online' && record.videoUrl) {
      window.open(record.videoUrl, '_blank');
    } else {
      message.warning('该塘口视频监控暂不可用');
    }
  };

  const handleCategoryChange = (category: 'pond' | 'cage' | 'workboat') => {
    setSelectedCategory(category);
    setSelectedRows([]);
    actionRef.current?.reload();
  };

  const handleSelectedRowsChange = (rows: PondManagementItem[]) => {
    setSelectedRows(rows);
  };

  const handleDataChange = (data: PondManagementItem[]) => {
    setTableData(data);
  };

  return (
    <PageContainer title={false}>
      <PondManagementStats data={tableData} />
      
      <PondTable
        actionRef={actionRef}
        loading={loading}
        selectedCategory={selectedCategory}
        selectedRows={selectedRowsState}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBatchDelete={handleBatchDelete}
        onDeviceHub={handleDeviceHub}
        onVideoMonitor={handleVideoMonitor}
        onSelectedRowsChange={handleSelectedRowsChange}
        onCategoryChange={handleCategoryChange}
        onDataChange={handleDataChange}
      />

      <PondModal
        visible={pondModalVisible}
        editingRecord={editingRecord}
        selectedCategory={selectedCategory}
        onCancel={() => setPondModalVisible(false)}
        onSuccess={handlePondSuccess}
      />

      <DeviceHubDrawer
        visible={deviceDrawerVisible}
        currentRow={currentRow}
        onClose={() => setDeviceDrawerVisible(false)}
      />
    </PageContainer>
  );
};

export default PondManagement;