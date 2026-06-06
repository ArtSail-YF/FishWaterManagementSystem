import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Space, Modal, message, Typography, Input, Select } from 'antd';
import { PlusOutlined, AppstoreOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import PondTable from '@/pages/production/PondManagement/components/PondTable';
import PondModal from '@/pages/production/PondManagement/components/PondModal';
import DeviceHubDrawer from '@/pages/production/PondManagement/components/DeviceHubDrawer';
import { createPond, updatePond, deletePond } from '@/services/api/pond';
import { createCage, updateCage, deleteCage } from '@/services/api/cage';
import { createVsl, updateVsl, deleteVsl } from '@/services/api/vsl';
import { mapCreateUpdateParamsByCategory } from '@/services/api/utils/apiParamMapper';

const { Text } = Typography;

interface Base {
  id: number;
  baseName?: string;
  name?: string;
  baseCode?: string;
  [key: string]: any;
}

interface ResourcePondPanelProps {
  base: Base;
}

const ResourcePondPanel: React.FC<ResourcePondPanelProps> = ({ base }) => {
  const baseId = base.id;
  const baseName = base.baseName || base.name || '未知基地';

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16 }}>{baseName}</Text>
        {base.baseCode && (
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{base.baseCode}</Text>
        )}
      </div>
      <PondContent baseId={baseId} />
    </div>
  );
};

const PondContent: React.FC<{ baseId: number }> = ({ baseId }) => {
  const [deviceDrawerVisible, setDeviceDrawerVisible] = useState(false);
  const [pondModalVisible, setPondModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'pond' | 'cage' | 'workboat'>('pond');
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const actionRef = useRef<any>();

  useEffect(() => {
    actionRef.current?.reload();
  }, [baseId]);

  const handleBatchDelete = (selectedRows: any[]) => {
    const categoryText: string[] = [];
    const pondCount = selectedRows.filter((r: any) => r.category === 'pond').length;
    const cageCount = selectedRows.filter((r: any) => r.category === 'cage').length;
    const boatCount = selectedRows.filter((r: any) => r.category === 'workboat').length;
    if (pondCount > 0) categoryText.push(pondCount + '个塘口');
    if (cageCount > 0) categoryText.push(cageCount + '个网箱');
    if (boatCount > 0) categoryText.push(boatCount + '个工船');

    Modal.confirm({
      title: '批量删除确认',
      content: '确定要删除选中的' + categoryText.join('、') + '吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          for (const row of selectedRows) {
            const fn = row.category === 'pond' ? deletePond
              : row.category === 'cage' ? deleteCage : deleteVsl;
            await fn(row.id);
          }
          message.success('已成功删除 ' + selectedRows.length + ' 个资产');
          setSelectedRows([]);
          actionRef.current?.reload();
        } catch { message.error('删除失败'); }
        finally { setLoading(false); }
      },
    });
  };

  const handleDelete = async (record: any) => {
    const typeLabel = record.category === 'pond' ? '塘口' : record.category === 'cage' ? '网箱' : '工船';
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除' + typeLabel + ' ' + record.name + ' 及其所有关联资产吗？',
      onOk: async () => {
        try {
          setLoading(true);
          const fn = record.category === 'pond' ? deletePond
            : record.category === 'cage' ? deleteCage : deleteVsl;
          const res = await fn(record.id);
          if (res.code === 200) {
            message.success('删除成功');
            actionRef.current?.reload();
          } else { message.error(res.message || '删除失败'); }
        } catch { message.error('删除失败'); }
        finally { setLoading(false); }
      },
    });
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setPondModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setPondModalVisible(true);
  };

  const handlePondSuccess = async (values: any) => {
    try {
      setLoading(true);
      const requestData = mapCreateUpdateParamsByCategory(selectedCategory, {
        ...values,
        baseId,
      });

      if (editingRecord) {
        const fn = selectedCategory === 'pond' ? updatePond
          : selectedCategory === 'cage' ? updateCage : updateVsl;
        const res = await fn(editingRecord.id, requestData);
        if (res.code === 200) { message.success('更新成功'); }
        else { message.error(res.message || '更新失败'); return; }
      } else {
        const fn = selectedCategory === 'pond' ? createPond
          : selectedCategory === 'cage' ? createCage : createVsl;
        const res = await fn(requestData);
        if (res.code === 200) { message.success('添加成功'); }
        else { message.error(res.message || '添加失败'); return; }
      }

      setPondModalVisible(false);
      actionRef.current?.reload();
    } catch { message.error('操作失败'); }
    finally { setLoading(false); }
  };

  const handleDeviceHub = (record: any) => {
    setCurrentRow(record);
    setDeviceDrawerVisible(true);
  };

  const handleVideoMonitor = (record: any) => {
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

  const handleSelectedRowsChange = (rows: any[]) => setSelectedRows(rows);
  const handleDataChange = (data: any[]) => setTableData(data);

  return (
    <>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>管理设施总数</Text>}
              value={tableData.length}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>养殖中</Text>}
              value={tableData.filter((d: any) => d.status === 'ENABLED').length}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>空闲</Text>}
              value={tableData.filter((d: any) => d.status === 'DISABLED').length}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '12px' }}>维修中</Text>}
              value={tableData.filter((d: any) => d.status === 'MAINTENANCE').length}
              valueStyle={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'AlibabaSans', color: '#262626' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索名称"
          allowClear
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          onSearch={() => actionRef.current?.reload()}
          style={{ width: 240 }}
        />
        <Select
          placeholder="全部状态"
          allowClear
          style={{ width: 140 }}
          value={filterStatus || undefined}
          onChange={(val) => { setFilterStatus(val || ''); setTimeout(() => actionRef.current?.reload(), 0) }}
        >
          <Select.Option value="ENABLED">养殖中</Select.Option>
          <Select.Option value="DISABLED">空闲</Select.Option>
          <Select.Option value="MAINTENANCE">维修中</Select.Option>
        </Select>
        <Button onClick={() => { setFilterName(''); setFilterStatus(''); setTimeout(() => actionRef.current?.reload(), 0) }}>
          重置
        </Button>
      </div>

      <PondTable
        actionRef={actionRef}
        baseId={baseId}
        loading={loading}
        selectedCategory={selectedCategory}
        selectedRows={selectedRowsState}
        filterName={filterName}
        filterStatus={filterStatus}
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
    </>
  );
};

export default ResourcePondPanel;
