import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button, Space ,message as antdmsg} from 'antd';
import React, { useState, useEffect  } from 'react';


// 组件引用
import PondDetailDrawer from './components/PondDetailDrawer';
import PondGrid from './components/PondGrid';
import PondSummaryStats, { type PondSummaryStatsProps } from './components/PondSummaryStats'; 
import PondFilterBar from './components/PondFilterBar';

// 服务引用 
import { getPondListWithSummary, deletePond } from '@/services/api/pond';
import { MOCK_PONDS, MOCK_POND_STATS } from '@/services/api/mock';

const PondArchives: React.FC = () => {
   // 1. 路由参数处理
  const [searchParams] = useSearchParams();
  const initialBaseId = searchParams.get('baseId');

  // 2. 核心状态管理
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'production' | 'device'>('device');

   // 数据状态
  const [pondData, setPondData] = useState<Pond.PondItem[]>([]);
  const [summaryData, setSummaryData] = useState<Pond.PondSummaryStatsProps>({});
  const [selectedPondId, setSelectedPondId] = useState<string | null>(null);

  // 筛选状态
  const [filterValues, setFilterValues] = useState<any>({
    baseId: initialBaseId || undefined,
    pageNum: 1,
    pageSize: 10,
  });

  // 4. 数据加载
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await getPondListWithSummary(filterValues);
      if (response.data) {
        setPondData(response.data.list || []);
        setSummaryData(response.data.summary || {});
      }
    } catch (error) {
      console.error('获取聚合数据失败，使用降级数据:', error);
      // 组件层降级
      setPondData(MOCK_PONDS);
      setSummaryData(MOCK_POND_STATS);
      antdmsg.warning('当前处于离线/降级模式，加载的是模拟数据');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filterValues]);

  // 5. 事件处理
  const handlePondClick = (pond: Pond.PondItem) => {
    setSelectedPondId(pond.id);
    setDrawerVisible(true);
  };

  const handleSearch = (values: any) => {
    setFilterValues({ ...filterValues, ...values, pageNum: 1 }); 
  };

  const handleDeletePond = async (id: string) => {
    try {
      await deletePond(id);
      antdmsg.success('删除成功');
      fetchAllData();
    } catch (error) {
      antdmsg.error('删除失败');
    }
  };

  return (    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <PageContainer
        header={{ title: '塘口档案' }}
        title={false}
        breadcrumb={undefined}
        style={{ marginTop: '-24px' }}
        extra={[
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ borderRadius: '2px' }}>
            新增塘口档案
          </Button>
        ]}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          
          {/* 1. 顶部数据汇总卡片 */}
          <PondSummaryStats {...summaryData} />

          {/* 2. 搜索与视图切换栏 */}
          <PondFilterBar 
            onSearch={handleSearch} 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
            initialValues={filterValues}
          />


          {/* 3. 塘口矩阵监控网格 */}
          <PondGrid 
            ponds={pondData}        
            loading={loading}    
            onPondClick={handlePondClick} 
            viewMode={viewMode}
            filterValues={filterValues}
          />
        </Space>
      </PageContainer>

      {/* 4. 详情抽屉 */}
      <PondDetailDrawer
        visible={drawerVisible}
        pondId={selectedPondId}
        onClose={() => setDrawerVisible(false)}
        onDelete={handleDeletePond}
      />
    </div>
  );
};

export default PondArchives;
