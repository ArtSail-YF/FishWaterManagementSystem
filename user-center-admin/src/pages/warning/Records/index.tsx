import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import HistoryTable, { HistoryRecord } from './components/HistoryTable';
import RecordsFilter from './components/RecordsFilter';
import RecordsStats from './components/RecordsStats';

// 模拟历史数据
const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'AL-20260327-001',
    level: 'P0',
    startTime: '2026-03-27 02:15:12',
    endTime: '2026-03-27 02:45:00',
    duration: '29m 48s',
    source: '萧山基地 / 1号塘',
    description: '溶氧量 (DO) 骤降: 1.8 mg/L ↓',
    handler: '张三',
    status: 'resolved',
    comment: '手动开启 2 号增氧机，溶氧恢复正常。建议检查传感器探头是否挂草。',
  },
  {
    id: 'AL-20260326-045',
    level: 'P1',
    startTime: '2026-03-26 14:30:45',
    endTime: '2026-03-26 15:10:22',
    duration: '39m 37s',
    source: '余杭基地 / 2号塘',
    description: '水温异常上升: 29.2 ℃ ↑',
    handler: '李四',
    status: 'resolved',
    comment: '开启遮阳网，增加进水量。',
  },
  {
    id: 'AL-20260326-012',
    level: 'P2',
    startTime: '2026-03-26 09:15:00',
    endTime: '2026-03-26 09:20:00',
    duration: '5m',
    source: '富阳基地 / 3号塘',
    description: '投喂设备瞬时离线',
    handler: '系统自动',
    status: 'ignored',
    comment: '网络波动，5分钟后自动恢复。',
  },
  {
    id: 'AL-20260325-088',
    level: 'P0',
    startTime: '2026-03-25 22:10:00',
    endTime: '2026-03-25 23:30:00',
    duration: '1h 20m',
    source: '桐庐基地 / 4号塘',
    description: 'PH 值超标: 9.2 ↑',
    handler: '王五',
    status: 'resolved',
    comment: '使用有机酸调水，PH 降至 8.4。',
  },
];

const WarningRecords: React.FC = () => {
  const [data, setData] = useState<HistoryRecord[]>(MOCK_HISTORY);

  const statsData = {
    total: 1254,
    solveRate: 99.2,
    avgHandleTime: '8m 45s',
    trend: { value: 12.5, isUp: false },
  };

  const handleSearch = (values: any) => {
    message.info('正在执行高级检索...');
    // 实际业务中这里会调用后端 API
  };

  const handleExport = () => {
    message.loading('正在生成金融级历史数据报表...', 1.5).then(() => {
      message.success('预警记录报表导出成功！');
    });
  };

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
      <RecordsStats data={statsData} />
      
      <RecordsFilter onSearch={handleSearch} />
      
      <HistoryTable data={data} />
    </PageContainer>
  );
};

export default WarningRecords;
