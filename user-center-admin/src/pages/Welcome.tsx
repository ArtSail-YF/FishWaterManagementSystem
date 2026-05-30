import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Tag, Badge, List, Timeline, Table, Row, Col, Progress, Button, Popover, Space, Divider, Typography, Carousel } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ArrowRightOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, SettingOutlined, LineChartOutlined, SearchOutlined, AlertOutlined, LoadingOutlined, MessageOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import React, { useState, useEffect } from 'react';

const { Text, Title, Paragraph } = Typography;

// 风险塘口数据
const riskPonds = [
  {
    id: 'ZJ-HZ-003',
    name: '富阳3号塘',
    indicator: '溶氧',
    value: 2.1,
    unit: 'mg/L',
    status: 'error',
    statusText: '危急',
    trend: 'up',
    trendValue: 0.7,
    trendTime: '过去1h',
  },
  {
    id: 'ZJ-HZ-005',
    name: '余杭2号塘',
    indicator: 'pH值',
    value: 8.5,
    unit: '',
    status: 'warning',
    statusText: '预警',
    trend: 'stable',
    trendValue: 0,
    trendTime: '过去1h',
  },
  {
    id: 'ZJ-HZ-012',
    name: '桐庐4号塘',
    indicator: '任务',
    value: 0,
    unit: '',
    status: 'warning',
    statusText: '逾期',
    trend: 'stable',
    trendValue: 0,
    trendTime: '过去1h',
    task: '换水',
  },
];

// 今日关键行动流数据
const actionItems = [
  {
    time: '08:00',
    pond: '萧山1号塘',
    task: '投喂20kg颗粒料',
    status: 'completed',
    statusText: '已完成',
    doChange: '+0.3',
    doValue: 5.4,
    responsible: '张三',
  },
  {
    time: '10:00',
    pond: '余杭2号塘',
    task: '全塘用药防疫',
    status: 'pending',
    statusText: '待确认',
    phValue: 8.5,
    phTarget: 8.0,
    responsible: '李四',
    suggestion: '建议：补加0.5L醋酸，15分钟后复测',
  },
  {
    time: '14:30',
    pond: '富阳3号塘',
    task: '换水30%',
    status: 'inProgress',
    statusText: '进行中',
    additionalInfo: '已启动增氧机',
    estimatedCompletion: '预计15:00完成',
    doChange: '+1.7',
    doStart: 2.1,
    doCurrent: 3.8,
  },
];

// 经营影响快照数据
const businessData = {
  riskIntervention: {
    potentialLossAvoided: 2100,
    productionEfficiencyIncrease: 3.2,
  },
  keyMetrics: [
    {
      name: '平均溶氧',
      today: 5.1,
      yesterday: 4.6,
      change: 10.9,
      trend: 'up',
    },
    {
      name: '任务完成率',
      today: 92,
      yesterday: 85,
      change: 7,
      trend: 'up',
    },
    {
      name: '单塘收益比',
      today: 1.45,
      yesterday: 1.38,
      change: 5.1,
      trend: 'up',
    },
  ],
};

// 高风险塘口卡片数据
const highRiskPonds = [
  {
    id: 'ZJ-HZ-003',
    name: '富阳3号塘',
    status: 'error',
    statusText: '危急',
    taskStatus: 'inProgress',
    taskText: '换水进行中',
    responsible: '王五',
    eventChain: [
      '10:20 溶氧告警',
      '10:22 自动启增氧',
      '10:30 人工介入',
    ],
    trend: {
      do: {
        start: 2.1,
        end: 4.8,
        change: 133,
      },
      survivalRate: {
        start: 98.7,
        end: 99.2,
      },
    },
    deviceStatus: 'normal',
    waterStatus: 'error',
    notes: [
      { time: '10:25', person: '张三', content: '已补0.5L醋，复测pH=8.2' },
      { time: '10:30', person: '李四', content: '增氧机声音异响，已报修' },
      { time: '10:35', person: '王五', content: '换水已开始，预计15:00完成' },
    ],
  },
  {
    id: 'ZJ-HZ-005',
    name: '余杭2号塘',
    status: 'warning',
    statusText: '预警',
    taskStatus: 'pending',
    taskText: '用药待确认',
    responsible: '李四',
    suggestion: '建议动作: 补酸 0.5L → 预期pH降至8.0',
    deviceStatus: 'normal',
    waterStatus: 'warning',
    notes: [
      { time: '09:15', person: '李四', content: 'pH值偏高，需要处理' },
      { time: '09:30', person: '张三', content: '已准备醋酸，随时可以添加' },
    ],
  },
  {
    id: 'ZJ-HZ-012',
    name: '桐庐4号塘',
    status: 'warning',
    statusText: '预警',
    taskStatus: 'overdue',
    taskText: '任务逾期',
    responsible: '赵六',
    deviceStatus: 'weak',
    waterStatus: 'normal',
    notes: [
      { time: '08:00', person: '赵六', content: '今天需要换水，设备已检查' },
      { time: '09:00', person: '赵六', content: '设备出现故障，正在联系维修' },
    ],
  },
  {
    id: 'ZJ-HZ-007',
    name: '临安1号塘',
    status: 'warning',
    statusText: '预警',
    taskStatus: 'completed',
    taskText: '已完成',
    responsible: '孙七',
    deviceStatus: 'normal',
    waterStatus: 'warning',
    notes: [
      { time: '07:30', person: '孙七', content: '已完成投喂，水质正常' },
      { time: '08:00', person: '孙七', content: '检查增氧机，运行正常' },
    ],
  },
  {
    id: 'ZJ-HZ-009',
    name: '建德2号塘',
    status: 'error',
    statusText: '危急',
    taskStatus: 'inProgress',
    taskText: '增氧进行中',
    responsible: '周八',
    deviceStatus: 'normal',
    waterStatus: 'error',
    notes: [
      { time: '10:00', person: '周八', content: '溶氧值偏低，启动增氧机' },
      { time: '10:10', person: '周八', content: '溶氧值开始回升' },
    ],
  },
  {
    id: 'ZJ-HZ-015',
    name: '淳安3号塘',
    status: 'warning',
    statusText: '预警',
    taskStatus: 'pending',
    taskText: '待确认',
    responsible: '吴九',
    deviceStatus: 'offline',
    waterStatus: 'warning',
    notes: [
      { time: '09:45', person: '吴九', content: '设备离线，正在检查网络' },
      { time: '10:00', person: '吴九', content: '网络已恢复，设备重新连接' },
    ],
  },
];

// 行动流执行人语气
const actionTones = [
  { status: 'completed', tone: '完成！溶氧拉上来了～' },
  { status: 'pending', tone: '药还没到，先开增氧顶着' },
  { status: 'inProgress', tone: '正在换水，溶氧值慢慢回升' },
];

// 场长语录
const managerQuotes = [
  '宁可多换一次水，不冒一次翻塘险',
  'pH比温度难搞，得靠经验调',
  '增氧机是塘口的生命线，要定期检查',
  '防患于未然，定期检测水质是关键',
];

// 状态标签组件
const StatusTag: React.FC<{ status: string; text: string }> = ({ status, text }) => {
  let color = 'default';
  if (status === 'error') color = 'error';
  if (status === 'warning') color = 'warning';
  if (status === 'success') color = 'success';
  if (status === 'info') color = 'info';

  return (
    <Tag color={color} style={{ marginRight: 8 }}>
      {text}
    </Tag>
  );
};

// 趋势图标组件
const TrendIcon: React.FC<{ trend: string }> = ({ trend }) => {
  if (trend === 'up') {
    return <ArrowUpOutlined style={{ color: '#6b7280' }} />;
  }
  if (trend === 'down') {
    return <ArrowDownOutlined style={{ color: '#ef4444' }} />;
  }
  return <ArrowRightOutlined style={{ color: '#1f2937' }} />;
};

// 设备状态图标组件
const DeviceStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'normal') {
    return <Badge status="success" text="运行中" />;
  }
  if (status === 'weak') {
    return <Badge status="warning" text="信号弱" />;
  }
  return <Badge status="error" text="离线" />;
};

// 水质状态图标组件
const WaterStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'error') {
    return <Badge status="error" text="危急" />;
  }
  if (status === 'warning') {
    return <Badge status="warning" text="预警" />;
  }
  return <Badge status="success" text="正常" />;
};

// 任务状态图标组件
const TaskStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'inProgress') {
    return <Badge status="default" text="进行中" />;
  }
  if (status === 'completed') {
    return <Badge status="success" text="已完成" />;
  }
  if (status === 'overdue') {
    return <Badge status="error" text="逾期" />;
  }
  return <Badge status="warning" text="待确认" />;
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [customizeVisible, setCustomizeVisible] = useState(false);

  return (
    <PageContainer>
      <div style={{ padding: '0 16px', marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<SettingOutlined />} onClick={() => setCustomizeVisible(true)}>自定义首页</Button>
      </div>
      <div style={{ padding: '0 16px' }}>
        {/* 区域1：风险热力图（顶部横幅） */}
        <Card
          style={{
            borderRadius: 8,
            marginBottom: 16,
            borderLeft: '4px solid #ef4444',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Carousel autoplay effect="fade" style={{ marginBottom: 16 }}>
              {managerQuotes.map((quote, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '8px 0' }}>
                  <Text style={{ fontSize: '14px', color: '#1f2937' }}>🔹 “{quote}”</Text>
                </div>
              ))}
            </Carousel>
            <Space size="large">
              <Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
                ⚠️ 高风险塘口 3个
              </Tag>
              <Tag color="warning" style={{ fontSize: '14px', padding: '4px 12px' }}>
                🟡 预警塘口 4个
              </Tag>
              <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                🟢 正常塘口 11个
              </Tag>
            </Space>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <List
            dataSource={riskPonds}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tag
                      color={item.status === 'error' ? 'error' : 'warning'}
                      style={{
                        marginRight: 12,
                        boxShadow: item.status === 'error' ? '0 0 8px rgba(255, 77, 79, 0.5)' : 'none',
                        animation: item.status === 'error' ? 'blink 1s infinite' : 'none',
                      }}
                    >
                      {item.id}
                    </Tag>
                    <div style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8, fontSize: '18px' }}>
                        {item.status === 'error' ? '🔴' : item.status === 'warning' ? '🟡' : '🟢'}
                      </span>
                      <Text>{item.name}</Text>
                    </div>
                    <Text>
                      {item.indicator} {item.value} {item.unit} ({item.statusText})
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Popover content={`${item.trendTime} ${item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} ${item.indicator} ${item.trendValue}`}>
                      <Text style={{ color: token.colorTextSecondary }}>
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {item.indicator} {item.trendValue}
                      </Text>
                    </Popover>
                    <Space size="small">
                      <Button size="small" icon={<SettingOutlined />} title="处置建议" />
                      <Button size="small" icon={<LineChartOutlined />} title="查看历史" />
                    </Space>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          {/* 区域2：今日关键行动流（中部左，时间轴式） */}
          <Col span={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined />
                  <span>今日关键行动流</span>
                </div>
              }
              style={{ borderRadius: 8 }}
            >
              <Timeline
                items={actionItems.map((item, index) => ({
                  color: item.status === 'completed' ? 'green' : item.status === 'pending' ? 'orange' : 'blue',
                  children: (
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div>
                          <Text strong>{item.time} [ {item.pond} ] {item.task}</Text>
                          <Text style={{ fontFamily: 'cursive', fontSize: '12px', marginLeft: 8, color: '#666' }}>
                            {actionTones.find(tone => tone.status === item.status)?.tone}
                          </Text>
                        </div>
                        {item.status === 'completed' && (
                          <StatusTag status="success" text={`${item.statusText}｜DO ${item.doChange} → ${item.doValue}｜责任人：${item.responsible}`} />
                        )}
                        {item.status === 'pending' && (
                          <StatusTag status="warning" text={`${item.statusText}｜pH ${item.phValue}（目标≤${item.phTarget}）｜责任人：${item.responsible}`} />
                        )}
                        {item.status === 'inProgress' && (
                          <StatusTag status="info" text={`${item.statusText}｜${item.additionalInfo}｜${item.estimatedCompletion}`} />
                        )}
                      </div>
                      {item.suggestion && (
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                          → {item.suggestion}
                        </Text>
                      )}
                      {item.status === 'inProgress' && item.doStart && item.doCurrent && (
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                          📈 实时反馈：DO {item.doStart} → {item.doCurrent} ({item.doChange})
                        </Text>
                      )}
                      <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
                        <Button size="small" icon={<SearchOutlined />}>查看关联水质曲线</Button>
                        {(item.task.includes('换水') || item.task.includes('用药')) && (
                          <Button size="small" type="primary" danger>确认执行</Button>
                        )}
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>

          {/* 区域3：经营影响快照（中部右，老板视角） */}
          <Col span={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined />
                  <span>经营影响快照</span>
                </div>
              }
              style={{ borderRadius: 8 }}
            >
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>💰 今日风险干预成效：</Title>
                <List
                  dataSource={[
                    `避免潜在损失：¥${businessData.riskIntervention.potentialLossAvoided}（富阳3号塘溶氧危机）`,
                    `提升单产效率：+${businessData.riskIntervention.productionEfficiencyIncrease}%（因及时换水+投喂优化）`,
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5}>📈 关键指标对比（vs 昨日）：</Title>
                <Table
                  dataSource={businessData.keyMetrics}
                  columns={[
                    { title: '指标', dataIndex: 'name', key: 'name' },
                    { title: '今日', dataIndex: 'today', key: 'today' },
                    { title: '昨日', dataIndex: 'yesterday', key: 'yesterday' },
                    {
                      title: 'Δ',
                      dataIndex: 'change',
                      key: 'change',
                      render: (change: number, record: any) => (
                        <Text style={{ color: record.trend === 'up' ? '#6b7280' : '#ef4444' }}>
                          {record.trend === 'up' ? '↑' : '↓'}{change}%
                        </Text>
                      ),
                    },
                  ]}
                  pagination={false}
                  size="small"
                />
              </div>

              <div>
                <Title level={5}>💡 数据来源：</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  损失估算 = 存塘价值 × 预估死亡率模型（DO&lt;3时死亡率=1.2%/小时）
                </Paragraph>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  ROI = 利润 / (饲料+人工+水电)，按塘口聚合
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 区域4：高风险塘口轻量卡片（底部网格，3列×2行） */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertOutlined />
              <span>高风险塘口轻量卡片</span>
            </div>
          }
          style={{ borderRadius: 8 }}
        >
          <Row gutter={[16, 16]}>
            {highRiskPonds.map((pond) => (
              <Col span={8} key={pond.id}>
                <Card
                  style={{
                    borderRadius: 8,
                    borderLeft: `4px solid ${pond.status === 'error' ? '#ef4444' : '#9ca3af'}`,
                  }}
                >
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, fontSize: '18px' }}>
                      {pond.status === 'error' ? '🔴' : pond.status === 'warning' ? '🟡' : '🟢'}
                    </span>
                    <Text strong>[ {pond.id} ] {pond.name}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Space size="small">
                      <StatusTag status={pond.status} text={pond.statusText} />
                      <StatusTag status="info" text={pond.taskText} />
                      <Text>责任人：{pond.responsible}</Text>
                    </Space>
                  </div>
                  {pond.eventChain && (
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">⏱️ 事件链: {pond.eventChain.join(' → ')}</Text>
                    </div>
                  )}
                  {pond.trend && (
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">
                        📉 24h趋势: DO {pond.trend.do.start} → {pond.trend.do.end}（↑{pond.trend.do.change}%）｜
                        存活率预估：{pond.trend.survivalRate.start}% → {pond.trend.survivalRate.end}%
                      </Text>
                    </div>
                  )}
                  {pond.suggestion && (
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">💡 {pond.suggestion}</Text>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <DeviceStatusIcon status={pond.deviceStatus} />
                      <WaterStatusIcon status={pond.waterStatus} />
                      <TaskStatusIcon status={pond.taskStatus} />
                    </div>
                    <Popover
                      content={
                        <List
                          dataSource={pond.notes || []}
                          renderItem={(note) => (
                            <List.Item>
                              <Text>[{note.time} {note.person}] {note.content}</Text>
                            </List.Item>
                          )}
                        />
                      }
                      title="最近人工备注"
                    >
                      <Button size="small" icon={<MessageOutlined />} title="查看人工备注" />
                    </Popover>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Welcome;