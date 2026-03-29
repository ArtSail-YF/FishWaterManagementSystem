import { Button, Card, DatePicker, Form, Select, Space, Tag } from 'antd';
import React from 'react';

const { RangePicker } = DatePicker;

const WeatherHistoryFilter: React.FC = () => {
  const [form] = Form.useForm();

  const presets = [
    { label: '2025年台风季', value: 'typhoon_2025' },
    { label: '2026年倒春寒', value: 'cold_2026' },
    { label: '梅雨季节', value: 'plum_rain' },
  ];

  return (
    <Card variant="borderless" className="fin-card" styles={{ body: { padding: '12px 24px' } }}>
      <Form
        form={form}
        layout="inline"
        initialValues={{ bases: ['hz'], metrics: ['temp', 'wind'] }}
        style={{ rowGap: '12px' }}
      >
        <Form.Item name="bases" label={<span style={{ fontSize: '12px' }}>监测基地</span>}>
          <Select
            mode="multiple"
            style={{ minWidth: '200px' }}
            placeholder="选择基地"
            maxTagCount="responsive"
            options={[
              { label: '杭州基地', value: 'hz' },
              { label: '舟山基地', value: 'zs' },
              { label: '宁波基地', value: 'nb' },
              { label: '温州基地', value: 'wz' },
            ]}
          />
        </Form.Item>

        <Form.Item name="range" label={<span style={{ fontSize: '12px' }}>查询时段</span>}>
          <RangePicker style={{ width: '280px' }} />
        </Form.Item>

        <Form.Item name="metrics" label={<span style={{ fontSize: '12px' }}>对比指标</span>}>
          <Select
            mode="multiple"
            style={{ minWidth: '180px' }}
            placeholder="选择指标"
            options={[
              { label: '气温', value: 'temp' },
              { label: '风力', value: 'wind' },
              { label: '降雨', value: 'rain' },
              { label: '气压', value: 'pressure' },
              { label: '潮位', value: 'tide' },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" style={{ borderRadius: '2px' }}>执行查询</Button>
            <Button style={{ borderRadius: '2px' }}>重置</Button>
          </Space>
        </Form.Item>

        <div style={{ width: '100%', borderTop: '1px dashed #f0f0f0', marginTop: '8px', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>快捷预设:</span>
          <Space size={8}>
            {presets.map(p => (
              <Tag 
                key={p.value} 
                className="fin-tag" 
                style={{ cursor: 'pointer', borderRadius: '2px', margin: 0 }}
                onClick={() => {}}
              >
                {p.label}
              </Tag>
            ))}
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default WeatherHistoryFilter;
