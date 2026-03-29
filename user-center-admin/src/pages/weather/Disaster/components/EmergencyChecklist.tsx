import { Button, Card, Checkbox, Col, List, Row, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

const EmergencyChecklist: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: '加固深海渔排锚系', status: 'completed', level: 'P0' },
    { id: 2, text: '撤离海上作业人员（共45人）', status: 'pending', level: 'P0' },
    { id: 3, text: '降低池塘水位至安全线', status: 'in-progress', level: 'P1' },
    { id: 4, text: '检查备用柴油发电机组', status: 'completed', level: 'P1' },
    { id: 5, text: '备足7天应急投喂饲料', status: 'pending', level: 'P2' },
    { id: 6, text: '清理排水渠杂物，保持通畅', status: 'in-progress', level: 'P1' },
  ]);

  return (
    <Card 
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>🚨 应急响应标准操作清单 (SOP) / COMMAND</span>}
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
      extra={<Tag color="error">红色响应阶段</Tag>}
    >
      <Row gutter={24}>
        <Col span={16}>
          <List
            dataSource={tasks}
            renderItem={(item) => (
              <List.Item style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Checkbox checked={item.status === 'completed'} />
                  <div style={{ marginLeft: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Tag color={item.level === 'P0' ? 'error' : item.level === 'P1' ? 'warning' : 'blue'} style={{ borderRadius: '2px', fontSize: '10px', scale: '0.85', margin: 0 }}>
                        {item.level}
                      </Tag>
                      <Text style={{ 
                        fontSize: '13px', 
                        textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                        color: item.status === 'completed' ? '#bfbfbf' : '#262626'
                      }}>
                        {item.text}
                      </Text>
                    </div>
                  </div>
                  <Tag color={item.status === 'completed' ? 'success' : item.status === 'in-progress' ? 'processing' : 'default'} style={{ margin: 0, fontSize: '10px' }}>
                    {item.status === 'completed' ? '已落实' : item.status === 'in-progress' ? '执行中' : '待处理'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Col>

        <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '24px' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={20}>
            <div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>应急通信枢纽</div>
              <Space direction="vertical" style={{ width: '100%' }} size={10}>
                <Button block danger type="primary" style={{ borderRadius: '2px' }}>
                  一键推送红色强提醒 (短信)
                </Button>
                <Button block style={{ borderRadius: '2px' }}>
                  呼叫区域负责人
                </Button>
                <Button block style={{ borderRadius: '2px' }}>
                  查看最近避风港分布
                </Button>
              </Space>
            </div>
            
            <div style={{ backgroundColor: '#fffbe6', padding: '12px', borderRadius: '2px', border: '1px solid #ffe58f' }}>
              <div style={{ fontSize: '11px', color: '#856404', fontWeight: 'bold', marginBottom: '4px' }}>当前执行率：50%</div>
              <div style={{ fontSize: '10px', color: '#856404', lineHeight: '1.5' }}>
                仍有 3 项关键任务处于待处理或执行中，请密切关注 P0 级别任务的落实情况。
              </div>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default EmergencyChecklist;
