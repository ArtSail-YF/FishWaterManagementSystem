import { Badge, Card, Col, Row, Space, Tag, Typography, Empty, Tooltip } from 'antd';
import { VideoCameraOutlined, ThunderboltOutlined, BulbOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import WaterQualitySparkline from './WaterQualitySparkline';

const { Text } = Typography;

export interface PondItem {
  id: string;
  name: string;
  baseId: string; // 关联基地 ID
  status: 'breeding' | 'empty' | 'locked' | 'ready';
  species: string;
  days: number;
  temp: number;
  do: number; // Dissolved Oxygen
  doTrend: number[];
  area: number;
  estWeight: number;
}

interface PondGridProps {
  onPondClick: (pond: PondItem) => void;
  viewMode: 'production' | 'device';
  filterValues: any;
}

const PondGrid: React.FC<PondGridProps> = ({ onPondClick, viewMode, filterValues }) => {
  const ponds: PondItem[] = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: `P${(i + 1).toString().padStart(3, '0')}`,
    name: `${i + 1}号池塘`,
    baseId: i < 5 ? 'B001' : i < 10 ? 'B002' : i < 15 ? 'B003' : 'B004', // 模拟分配到不同基地
    status: i === 4 ? 'locked' : i % 5 === 0 ? 'empty' : i % 7 === 0 ? 'ready' : 'breeding',
    species: i % 2 === 0 ? '南美白对虾' : '大黄鱼',
    days: 45 + i * 2,
    temp: 24.5 + Math.random() * 2,
    do: 5.2 + Math.random() * 1.5,
    doTrend: [4.2, 4.5, 5.1, 5.8, 5.4, 5.2, 4.9, 5.3],
    area: 600,
    estWeight: 1200 + i * 50,
  })), []);

  const filteredPonds = useMemo(() => {
    return ponds.filter(pond => {
      const matchSearch = !filterValues.searchText || 
        pond.id.toLowerCase().includes(filterValues.searchText.toLowerCase()) ||
        pond.name.includes(filterValues.searchText);
      const matchStatus = !filterValues.status || pond.status === filterValues.status;
      const matchSpecies = !filterValues.species || pond.species === filterValues.species;
      const matchBase = !filterValues.baseId || pond.baseId === filterValues.baseId;
      return matchSearch && matchStatus && matchSpecies && matchBase;
    });
  }, [ponds, filterValues]);

  const getStatusColor = (status: PondItem['status']) => {
    switch (status) {
      case 'breeding': return '#1890ff';
      case 'empty': return '#52c41a';
      case 'locked': return '#f5222d';
      case 'ready': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: PondItem['status']) => {
    switch (status) {
      case 'breeding': return '养殖中';
      case 'empty': return '空塘';
      case 'locked': return '锁定';
      case 'ready': return '待出塘';
      default: return '未知';
    }
  };

  if (filteredPonds.length === 0) {
    return <Empty description="未找到匹配的塘口" style={{ padding: '40px' }} />;
  }

  return (
    <Row gutter={[12, 12]}>
      {filteredPonds.map((pond) => (
        <Col key={pond.id} xs={12} sm={8} md={6} lg={4}>
          <Card
            hoverable
            variant="borderless"
            className="fin-card"
            styles={{ body: { padding: viewMode === 'device' ? '0' : '12px' } }}
            onClick={() => onPondClick(pond)}
            style={{ borderTop: `3px solid ${getStatusColor(pond.status)}` }}
          >
            {viewMode === 'production' ? (
              // 生产指标模式
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: '14px' }}>{pond.id}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{pond.name}</Text>
                  </Space>
                  <Badge 
                    count={getStatusText(pond.status)} 
                    style={{ backgroundColor: getStatusColor(pond.status), fontSize: '10px', borderRadius: '2px' }} 
                  />
                </div>

                {pond.status !== 'empty' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '11px' }}>{pond.species}</Text>
                      <Text className="fin-number" style={{ fontSize: '11px' }}>{pond.days}d</Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                      <span className="fin-number" style={{ fontSize: '18px', fontWeight: 'bold', color: pond.do < 4 ? '#cf1322' : '#262626' }}>
                        {pond.do.toFixed(1)}
                      </span>
                      <Text type="secondary" style={{ fontSize: '10px' }}>mg/L (DO)</Text>
                    </div>

                    <WaterQualitySparkline data={pond.doTrend} color={pond.do < 4 ? '#ff4d4f' : '#1890ff'} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '10px' }}>水温: <span className="fin-number">{pond.temp.toFixed(1)}°C</span></Text>
                      <Text type="secondary" style={{ fontSize: '10px' }}>预估: <span className="fin-number">{pond.estWeight}kg</span></Text>
                    </div>
                  </>
                ) : (
                  <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', borderRadius: '2px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>空塘待放苗</Text>
                  </div>
                )}
              </>
            ) : (
              // 设备监控模式
              <div style={{ overflow: 'hidden' }}>
                {/* 模拟摄像头画面 */}
                <div style={{ 
                  height: '120px', 
                  backgroundColor: '#000', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <VideoCameraOutlined style={{ fontSize: '24px', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', top: '4px', left: '8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#52c41a', animation: 'pulse 2s infinite' }} />
                    <span style={{ opacity: 0.8 }}>REC {pond.id}</span>
                  </div>
                  <style>{`
                    @keyframes pulse {
                      0% { opacity: 1; }
                      50% { opacity: 0.3; }
                      100% { opacity: 1; }
                    }
                  `}</style>
                </div>
                
                {/* 设备状态条 */}
                <div style={{ padding: '8px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '12px' }}>{pond.id}</Text>
                    <Badge status="processing" text={<span style={{ fontSize: '10px' }}>信号极佳</span>} />
                  </div>
                  
                  <Row gutter={8}>
                    <Col span={8}>
                      <Tooltip title="增氧机状态">
                        <div style={{ textAlign: 'center', padding: '4px', backgroundColor: '#f6ffed', borderRadius: '2px', border: '1px solid #b7eb8f' }}>
                          <ThunderboltOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                          <div style={{ fontSize: '9px', color: '#389e0d' }}>运行中</div>
                        </div>
                      </Tooltip>
                    </Col>
                    <Col span={8}>
                      <Tooltip title="光照控制">
                        <div style={{ textAlign: 'center', padding: '4px', backgroundColor: '#f9f9f9', borderRadius: '2px', border: '1px solid #d9d9d9' }}>
                          <BulbOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />
                          <div style={{ fontSize: '9px', color: '#8c8c8c' }}>已关闭</div>
                        </div>
                      </Tooltip>
                    </Col>
                    <Col span={8}>
                      <Tooltip title="智能投饵机">
                        <div style={{ textAlign: 'center', padding: '4px', backgroundColor: '#e6f7ff', borderRadius: '2px', border: '1px solid #91d5ff' }}>
                          <ReloadOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
                          <div style={{ fontSize: '9px', color: '#0050b3' }}>待命</div>
                        </div>
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PondGrid;
