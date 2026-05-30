import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Space, Tag } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getBaseOptions } from '@/services/api/base';

const { RangePicker } = DatePicker;

export interface MedicineFilterValues {
  dateRange?: [string, string];
  baseId?: number;
  targetId?: number;
  source?: string;
  verifyStatus?: string;
}

interface MedicineFilterProps {
  onFilter: (values: MedicineFilterValues) => void;
  loading?: boolean;
}

const MedicineFilter: React.FC<MedicineFilterProps> = ({ onFilter, loading }) => {
  const [bases, setBases] = useState<Array<{ label: string; value: number }>>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs().startOf('month'), dayjs(),
  ]);
  const [baseId, setBaseId] = useState<number | undefined>();
  const [source, setSource] = useState<string | undefined>();
  const [verifyStatus, setVerifyStatus] = useState<string | undefined>();

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const options = await getBaseOptions();
      setBases(options);
    } catch { /* ignore */ }
  };

  const handleSearch = useCallback(() => {
    onFilter({
      dateRange: dateRange[0] && dateRange[1]
        ? [dateRange[0].format('YYYY-MM-DD 00:00:00'), dateRange[1].format('YYYY-MM-DD 23:59:59')]
        : undefined,
      baseId, source, verifyStatus,
    });
  }, [dateRange, baseId, source, verifyStatus, onFilter]);

  const handleReset = () => {
    setDateRange([dayjs().startOf('month'), dayjs()]);
    setBaseId(undefined); setSource(undefined); setVerifyStatus(undefined);
    onFilter({
      dateRange: [dayjs().startOf('month').format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')],
    });
  };

  return (
    <Card className="fin-card" variant="borderless" styles={{ body: { padding: '12px 16px' } }}>
      <Row gutter={[12, 12]} align="middle">
        <Col><RangePicker value={dateRange} onChange={(d) => setDateRange(d || [null, null])} allowClear style={{ width: 260 }} /></Col>
        <Col><Select placeholder="选择基地" value={baseId} onChange={setBaseId} allowClear style={{ width: 140 }} options={bases} /></Col>
        <Col>
          <Select placeholder="数据来源" value={source} onChange={setSource} allowClear style={{ width: 120 }}
            options={[
              { value: 'app', label: 'APP' },
              { value: 'admin', label: '文员代录' },
              { value: 'system', label: '自动' },
            ]}
          />
        </Col>
        <Col>
          <Select placeholder="审核状态" value={verifyStatus} onChange={setVerifyStatus} allowClear style={{ width: 130 }}
            options={[
              { value: 'auto', label: '自动通过' },
              { value: 'pending', label: '待审核' },
              { value: 'rejected', label: '已驳回' },
            ]}
          />
        </Col>
        <Col flex="auto">
          <Space>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch} loading={loading}>筛选</Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            {[baseId, source, verifyStatus].filter(Boolean).length > 0 && (
              <Tag color="blue">{[baseId, source, verifyStatus].filter(Boolean).length} 个筛选中</Tag>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default MedicineFilter;

