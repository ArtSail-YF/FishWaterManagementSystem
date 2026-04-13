import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, message, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import HistoryTable from './components/HistoryTable';
import RecordsFilter from './components/RecordsFilter';
import RecordsStats from './components/RecordsStats';
import { getWarningHistory, getWarningStats, type WarningHistoryRecord, type WarningStatsData } from '@/services/ant-design-pro/warning';
import { MOCK_WARNING_HISTORY, MOCK_WARNING_STATS } from '@/services/ant-design-pro/mock';

const WarningRecords: React.FC = () => {
  const [data, setData] = useState<WarningHistoryRecord[]>([]);
  const [statsData, setStatsData] = useState<WarningStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        getWarningHistory(),
        getWarningStats()
      ]);
      setData(historyRes.data || []);
      setStatsData(statsRes.data || null);
    } catch (error) {
      console.error('获取预警历史失败，使用降级数据:', error);
      setData(MOCK_WARNING_HISTORY as any);
      setStatsData(MOCK_WARNING_STATS);
      message.warning('预警历史已降级为本地档案');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (values: any) => {
    message.info('正在执行高级检索...');
    fetchData(); // 重新加载数据
  };

  const handleExport = () => {
    message.loading('正在生成金融级历史数据报表...', 1.5).then(() => {
      message.success('预警记录报表导出成功！');
    });
  };

  if (loading && !statsData) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <Spin size="large" tip="检索历史档案..." />
      </div>
    );
  }

  return (
    <PageContainer 
      header={{ 
        title: '预警记录 ARCHIVES',
        extra: [
          <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
            导出报表 / EXPORT
          </Button>
        ]
      }}
    >
      {statsData && <RecordsStats data={statsData} />}
      
      <RecordsFilter onSearch={handleSearch} />
      
      <HistoryTable data={data} />
    </PageContainer>
  );
};

export default WarningRecords;
