import { SearchOutlined, AppstoreOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, Space, Radio, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface PondFilterBarProps {
  onSearch: (values: any) => void;
  viewMode: 'production' | 'device';
  onViewModeChange: (mode: 'production' | 'device') => void;
  initialValues?: any;
}

const PondFilterBar: React.FC<PondFilterBarProps> = ({ 
  onSearch, 
  viewMode, 
  onViewModeChange,
  initialValues 
}) => {
  const [form] = Form.useForm();

  return (
    <Card variant="borderless" className="fin-card" styles={{ body: { padding: '12px 24px' } }}>
      <Row gutter={24} align="middle" justify="space-between">
        <Col flex="auto">
          <Form
            form={form}
            layout="inline"
            initialValues={initialValues}
            onValuesChange={(_, allValues) => onSearch(allValues)}
            style={{ rowGap: '8px' }}
          >
            <Form.Item name="baseId" label={<span style={{ fontSize: '12px' }}>所属基地</span>}>
              <Select
                placeholder="全部基地"
                style={{ width: '160px' }}
                allowClear
                options={[
                  { label: '海宁1号基地', value: 'B001' },
                  { label: '嘉兴南湖基地', value: 'B002' },
                  { label: '舟山定海基地', value: 'B003' },
                  { label: '温州苍南基地', value: 'B004' },
                ]}
              />
            </Form.Item>

            <Form.Item name="searchText">
              <Input
                placeholder="搜索池塘编号/名称..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: '220px', borderRadius: '2px' }}
                allowClear
              />
            </Form.Item>

            <Form.Item name="status" label={<span style={{ fontSize: '12px' }}>状态</span>}>
              <Select
                placeholder="全部状态"
                style={{ width: '120px' }}
                allowClear
                options={[
                  { label: '养殖中', value: 'breeding' },
                  { label: '空塘', value: 'empty' },
                  { label: '待出塘', value: 'ready' },
                  { label: '锁定', value: 'locked' },
                ]}
              />
            </Form.Item>

            <Form.Item name="species" label={<span style={{ fontSize: '12px' }}>品种</span>}>
              <Select
                placeholder="全部品种"
                style={{ width: '140px' }}
                allowClear
                options={[
                  { label: '南美白对虾', value: '南美白对虾' },
                  { label: '大黄鱼', value: '大黄鱼' },
                  { label: '鲍鱼', value: '鲍鱼' },
                ]}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col>
          <Space size={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>视图切换:</Text>
              <Radio.Group 
                value={viewMode} 
                onChange={(e) => onViewModeChange(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="production">
                  <Space size={4}><AppstoreOutlined />生产指标</Space>
                </Radio.Button>
                <Radio.Button value="device">
                  <Space size={4}><VideoCameraOutlined />监控画面</Space>
                </Radio.Button>
              </Radio.Group>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default PondFilterBar;
