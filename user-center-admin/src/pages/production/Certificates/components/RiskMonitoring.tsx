import { Card, Space, Tag, Typography, Progress, Table, Badge, Button, Modal, List, Descriptions, message } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { getWithdrawalSummary } from '@/services/api/certificate';
import type { WithdrawalStatus, WithdrawalDrugInfo } from '@/types/api/certificate';

const { Title, Text } = Typography;

const RiskMonitoring: React.FC = () => {
  const [riskData, setRiskData] = useState<WithdrawalStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState<WithdrawalStatus | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWithdrawalSummary(1);
      if (res?.code === 200 && res?.data) {
        setRiskData(res.data);
      }
    } catch (e: any) {
      message.error('获取休药期风险数据失败: ' + (e?.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showDetail = (record: WithdrawalStatus) => {
    setSelectedPond(record);
    setDetailVisible(true);
  };

  const getRiskLevel = (record: WithdrawalStatus): 'high' | 'medium' | 'low' => {
    if (!record.locked) return 'low';
    if (record.remainingDays <= 7) return 'high';
    if (record.remainingDays <= 20) return 'medium';
    return 'low';
  };

  const getStatusText = (record: WithdrawalStatus): string => {
    if (!record.locked) return '正常';
    return '锁定中';
  };

  const columns = [
    {
      title: '塘口信息',
      key: 'pond',
      render: (_: any, record: WithdrawalStatus) => (
        <Space direction="vertical">
          <Tag color="blue">P{String(record.pondId).padStart(3, '0')}</Tag>
          <Text>{record.pondName || '塘口#' + record.pondId}</Text>
        </Space>
      ),
    },
    {
      title: '风险等级',
      key: 'riskLevel',
      render: (_: any, record: WithdrawalStatus) => {
        const level = getRiskLevel(record);
        return (
          <Badge
            status={level === 'high' ? 'error' : level === 'medium' ? 'warning' : 'success'}
            text={level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '正常'}
          />
        );
      },
    },
    {
      title: '休药期状态',
      key: 'withdrawal',
      render: (_: any, record: WithdrawalStatus) => {
        if (!record.locked) return <Tag color="green">无休药期限制</Tag>;
        const maxDays = record.relatedDrugs?.length > 0
          ? Math.max(...record.relatedDrugs.map(d => d.withdrawalDays))
          : record.remainingDays;
        const progressPct = maxDays > 0
          ? Math.max(0, Math.min(100, ((maxDays - record.remainingDays) / maxDays) * 100))
          : 0;
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <Text type="danger">锁定中</Text>
              <Text className="fin-number">剩 {record.remainingDays} 天</Text>
            </div>
            <Progress
              percent={Math.round(progressPct)}
              size="small"
              showInfo={false}
              strokeColor="#ef4444"
            />
          </Space>
        );
      },
    },
    {
      title: '涉及药品',
      key: 'drugs',
      render: (_: any, record: WithdrawalStatus) => (
        <Space direction="vertical" size={2}>
          {record.relatedDrugs?.slice(0, 2).map((drug, idx) => (
            <Tag key={idx} color="volcano" style={{ margin: 0 }}>{drug.drugName}</Tag>
          ))}
          {record.relatedDrugs?.length > 2 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              +{record.relatedDrugs.length - 2} 种药品
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'lockedUntil',
      key: 'lockedUntil',
      render: (val: string) => val || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WithdrawalStatus) => (
        <Button type="link" size="small" onClick={() => showDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <Card
      className="fin-card"
      title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>休药期风险监控 / WITHDRAWAL PERIOD RISK MONITORING</span>}
      variant="borderless"
    >
      <Table
        columns={columns}
        dataSource={riskData}
        loading={loading}
        rowKey="pondId"
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        size="small"
      />

      <Modal
        title={'塘口休药期详情 - ' + (selectedPond?.pondName || '塘口#' + selectedPond?.pondId)}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedPond && (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="锁定状态">
                <Badge status={selectedPond.locked ? 'error' : 'success'} text={selectedPond.locked ? '锁定中' : '正常'} />
              </Descriptions.Item>
              <Descriptions.Item label="剩余天数">{selectedPond.remainingDays} 天</Descriptions.Item>
              <Descriptions.Item label="锁定截止日">{selectedPond.lockedUntil || '-'}</Descriptions.Item>
            </Descriptions>

            <Text strong>关联药品列表</Text>
            <List
              size="small"
              bordered
              dataSource={selectedPond.relatedDrugs || []}
              renderItem={(drug: WithdrawalDrugInfo) => (
                <List.Item>
                  <Space direction="vertical" size={2}>
                    <Text strong>{drug.drugName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      用药日期: {drug.adminDate} | 休药期: {drug.withdrawalDays}天 | 截止日: {drug.banHarvestUntil}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Space>
        )}
      </Modal>
    </Card>
  );
};

export default RiskMonitoring;
