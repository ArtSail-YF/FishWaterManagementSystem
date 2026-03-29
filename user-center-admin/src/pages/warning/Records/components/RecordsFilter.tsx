import { Card, Col, DatePicker, Input, Row, Select, Space } from 'antd';
import React from 'react';

const { RangePicker } = DatePicker;

interface RecordsFilterProps {
  onSearch: (values: any) => void;
}

const RecordsFilter: React.FC<RecordsFilterProps> = ({ onSearch }) => {
  return (
    <Card className="fin-card" styles={{ body: { padding: '12px 16px' } }} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 8]} align="middle">
        <Col xs={24} lg={6}>
          <div className="fin-ticker-label">时间范围 / TIME RANGE</div>
          <RangePicker size="small" style={{ width: '100%' }} />
        </Col>
        <Col xs={24} lg={4}>
          <div className="fin-ticker-label">预警级别 / LEVEL</div>
          <Select 
            size="small" 
            placeholder="全部级别" 
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: 'P0 紧急', value: 'P0' },
              { label: 'P1 预警', value: 'P1' },
              { label: 'P2 提示', value: 'P2' },
            ]}
          />
        </Col>
        <Col xs={24} lg={4}>
          <div className="fin-ticker-label">处理状态 / STATUS</div>
          <Select 
            size="small" 
            placeholder="全部状态" 
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: '已解决', value: 'resolved' },
              { label: '处理中', value: 'processing' },
              { label: '待处理', value: 'pending' },
              { label: '误报', value: 'ignored' },
            ]}
          />
        </Col>
        <Col xs={24} lg={6}>
          <div className="fin-ticker-label">关键词搜索 / SEARCH</div>
          <Input.Search size="small" placeholder="搜索描述、基地、处理人..." onSearch={onSearch} />
        </Col>
      </Row>
    </Card>
  );
};

export default RecordsFilter;
