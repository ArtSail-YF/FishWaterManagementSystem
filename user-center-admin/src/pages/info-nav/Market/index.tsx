import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, Space, Tag, Typography, List, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import React from 'react';
import ReactECharts from 'echarts-for-react';

const { Text, Title } = Typography;

interface MarketPriceItem {
  id: string;
  species: string;
  region: string;
  price: number;
  change: number;
  unit: string;
  updateTime: string;
}

const MarketInfo: React.FC = () => {
  // 模拟行情走势数据
  const getTrendOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      textStyle: { color: '#fff' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['03-22', '03-23', '03-24', '03-25', '03-26', '03-27', '03-28'],
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
      axisLabel: { color: '#999' },
    },
    series: [
      {
        name: '南美白对虾 (40头)',
        type: 'line',
        smooth: true,
        data: [32.5, 33.0, 32.8, 34.2, 35.0, 34.5, 36.2],
        itemStyle: { color: '#cf1322' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(207, 19, 34, 0.2)' },
              { offset: 1, color: 'rgba(207, 19, 34, 0)' }
            ]
          }
        }
      }
    ]
  });

  const columns: ProColumns<MarketPriceItem>[] = [
    {
      title: '品种',
      dataIndex: 'species',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '区域',
      dataIndex: 'region',
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      render: (dom, record) => (
        <Space>
          <span className="fin-number" style={{ fontSize: '16px', fontWeight: 600 }}>{dom}</span>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.unit}</Text>
        </Space>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'change',
      render: (val: any) => {
        const isUp = val > 0;
        return (
          <Space size={4}>
            {isUp ? <ArrowUpOutlined style={{ color: '#cf1322' }} /> : <ArrowDownOutlined style={{ color: '#52c41a' }} />}
            <span className="fin-number" style={{ color: isUp ? '#cf1322' : '#52c41a', fontWeight: 600 }}>
              {Math.abs(val)}%
            </span>
          </Space>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      render: (dom) => <span className="fin-number" style={{ color: '#999', fontSize: '12px' }}>{dom}</span>,
    },
  ];

  const mockPrices: MarketPriceItem[] = [
    { id: '1', species: '南美白对虾 (40头)', region: '浙江嘉兴', price: 36.2, change: 4.5, unit: '元/斤', updateTime: '2026-03-28 10:00:00' },
    { id: '2', species: '南美白对虾 (40头)', region: '广东湛江', price: 34.5, change: -1.2, unit: '元/斤', updateTime: '2026-03-28 09:30:00' },
    { id: '3', species: '大黄鱼 (500g+)', region: '福建宁德', price: 28.8, change: 0.5, unit: '元/斤', updateTime: '2026-03-28 09:00:00' },
    { id: '4', species: '加州鲈鱼', region: '江苏吴江', price: 16.5, change: 2.1, unit: '元/斤', updateTime: '2026-03-28 08:45:00' },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        {/* 顶部行情速递 */}
        <Col span={24}>
          <Card variant="borderless" className="fin-card" styles={{ body: { padding: '16px' } }}>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '32px', paddingBottom: '8px' }}>
              {[
                { title: '南美白对虾 (40头)', price: '36.20', change: '+4.5%' },
                { title: '大黄鱼 (500g+)', price: '28.80', change: '+0.5%' },
                { title: '加州鲈鱼 (1斤上)', price: '16.50', change: '+2.1%' },
                { title: '草鱼 (2-3斤)', price: '7.80', change: '-1.5%' },
                { title: '鲫鱼 (8两上)', price: '12.50', change: '+0.8%' },
              ].map((item, idx) => (
                <div key={idx} style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{item.title}</div>
                  <Space align="baseline">
                    <span className="fin-number" style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.price}</span>
                    <span className="fin-number" style={{ fontSize: '12px', color: item.change.startsWith('+') ? '#cf1322' : '#52c41a' }}>
                      {item.change}
                    </span>
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 左侧价格走势 */}
        <Col span={16}>
          <Card 
            title={
              <Space>
                <LineChartOutlined />
                <span>价格走势分析 / PRICE TREND</span>
              </Space>
            }
            variant="borderless"
            className="fin-card"
            extra={<Tag color="red">浙江嘉兴</Tag>}
          >
            <ReactECharts option={getTrendOption()} style={{ height: '350px' }} />
          </Card>

          <div style={{ marginTop: '16px' }}>
            <ProTable<MarketPriceItem>
              headerTitle="全国各地区行情对比"
              columns={columns}
              dataSource={mockPrices}
              rowKey="id"
              search={false}
              pagination={false}
              size="small"
              bordered
            />
          </div>
        </Col>

        {/* 右侧市场资讯 */}
        <Col span={8}>
          <Card 
            title="行业资讯 / MARKET NEWS" 
            variant="borderless" 
            className="fin-card"
            extra={<a href="#">更多</a>}
          >
            <List
              itemLayout="vertical"
              dataSource={[
                { date: '03-28', title: '【深度】清明节将至，多地对虾价格出现回升迹象', tag: '行情' },
                { date: '03-27', title: '受冷空气影响，华东地区特种水产流通量小幅下降', tag: '天气' },
                { date: '03-26', title: '广东湛江对虾出口量创历史新高，利好后市价格', tag: '出口' },
                { date: '03-25', title: '新一轮饲料涨价潮来袭，养殖成本压力增大', tag: '成本' },
                { date: '03-24', title: '加州鲈鱼存栏量调研：预计4月价格保持坚挺', tag: '预测' },
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tag color="blue" style={{ borderRadius: '2px', fontSize: '10px' }}>{item.tag}</Tag>
                      <Text type="secondary" className="fin-number" style={{ fontSize: '12px' }}>{item.date}</Text>
                    </div>
                    <Text strong ellipsis style={{ fontSize: '14px', display: 'block' }}>{item.title}</Text>
                  </Space>
                </List.Item>
              )}
            />
            <Divider dashed />
            <Title level={5} style={{ fontSize: '14px' }}>本周市场点评</Title>
            <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.6' }}>
              本周全国水产品价格呈现稳中有升态势。南美白对虾受节日拉动明显，大规格虾供不应求。淡水鱼类受存栏量影响，价格保持震荡。建议养殖户关注清明节前行情，适时出塘。
            </Text>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default MarketInfo;
