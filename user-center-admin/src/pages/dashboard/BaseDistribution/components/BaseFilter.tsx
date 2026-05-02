import { EnvironmentOutlined, SearchOutlined, FilterOutlined, DownOutlined, UpOutlined, GlobalOutlined, AppstoreOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Badge, Card, Input, List, Tag, Typography, Collapse, Select, Checkbox, Divider, Space, Row, Col } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const { Text } = Typography;
const { Panel } = Collapse;

const useStyles = createStyles(({ token }) => ({
  filterHeader: {
    color: token.colorPrimary,
  },
  labelText: {
    color: token.colorTextSecondary,
  },
  listItem: {
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  selectedItem: {
    backgroundColor: token.colorPrimaryBg,
    border: `1px solid ${token.colorPrimary}`,
  },
  badgeNormal: {
    color: token.colorSuccess,
  },
  badgeWarning: {
    color: token.colorError,
  },
  badgeTodo: {
    color: token.colorPrimary,
  },
}));


interface BaseFilterProps {
  bases: Pond.BaseItem[];
  selectedBaseId?: string;
  onSelect: (base: Pond.BaseItem) => void;
  onSearch: (value: string) => void;
  onAdvancedFilterChange?: (filters: {
    region: string[];
    baseType: string;
    cooperationAttrs: {
      taiwanCooperation: boolean;
      deepSeaCertified: boolean;
      greenCertification: boolean;
    };
  }) => void;
  advancedFilters?: {
    region: string[];
    baseType: string;
    cooperationAttrs: {
      taiwanCooperation: boolean;
      deepSeaCertified: boolean;
      greenCertification: boolean;
    };
  };
}

const BaseFilter: React.FC<BaseFilterProps> = ({
  bases,
  selectedBaseId,
  onSelect,
  onSearch,
  onAdvancedFilterChange,
  advancedFilters,
}) => {
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [region, setRegion] = useState<string[]>(advancedFilters?.region || []);
  const [baseType, setBaseType] = useState<string>(advancedFilters?.baseType || 'all');
  const [cooperationAttrs, setCooperationAttrs] = useState({
    taiwanCooperation: advancedFilters?.cooperationAttrs?.taiwanCooperation || false,
    deepSeaCertified: advancedFilters?.cooperationAttrs?.deepSeaCertified || false,
    greenCertification: advancedFilters?.cooperationAttrs?.greenCertification || false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'warning':
        return 'error';
      case 'todo':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '预警';
      case 'todo':
        return '待办';
      default:
        return '未知';
    }
  };

  const handleRegionChange = (values: string[]) => {
    setRegion(values);
    if (onAdvancedFilterChange) {
      onAdvancedFilterChange({
        region: values,
        baseType,
        cooperationAttrs,
      });
    }
  };

  const handleBaseTypeChange = (value: string) => {
    setBaseType(value);
    if (onAdvancedFilterChange) {
      onAdvancedFilterChange({
        region,
        baseType: value,
        cooperationAttrs,
      });
    }
  };

  const handleCooperationAttrChange = (key: keyof typeof cooperationAttrs, checked: boolean) => {
    const newCooperationAttrs = {
      ...cooperationAttrs,
      [key]: checked,
    };
    setCooperationAttrs(newCooperationAttrs);
    if (onAdvancedFilterChange) {
      onAdvancedFilterChange({
        region,
        baseType,
        cooperationAttrs: newCooperationAttrs,
      });
    }
  };

  return (
    <Card
      title="基地/塘口筛选"
      styles={{ body: { padding: 0 } }}
      style={{ height: 'calc(100vh - 250px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* 搜索栏 */}
      <div style={{ padding: 16 }}>
        <Input
          placeholder="搜索基地或塘口"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* 高级筛选 */}
      <Collapse
        defaultActiveKey={[]}
        onChange={() => setAdvancedFilterVisible(!advancedFilterVisible)}
        ghost
        style={{ margin: '0 16px' }}
      >
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 500 }}>
                <FilterOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                高级筛选
              </span>
            </div>
          }
          key="1"
        >
          <div style={{ padding: '8px 0 16px' }}>
            {/* 区域筛选 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <GlobalOutlined style={{ marginRight: 6, color: '#8c8c8c', fontSize: 12 }} />
                <Text style={{ fontSize: 13, color: '#595959' }}>区域</Text>
              </div>
              <Select
                mode="multiple"
                placeholder="选择区域"
                style={{ width: '100%' }}
                size="small"
                value={region}
                onChange={handleRegionChange}
                options={[
                  { value: 'east', label: '华东' },
                  { value: 'south', label: '华南' },
                  { value: 'north', label: '华北' },
                  { value: 'west', label: '华西' },
                ]}
              />
            </div>

            {/* 基地类型筛选 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <AppstoreOutlined style={{ marginRight: 6, color: '#8c8c8c', fontSize: 12 }} />
                <Text style={{ fontSize: 13, color: '#595959' }}>基地类型</Text>
              </div>
              <Select
                placeholder="选择基地类型"
                style={{ width: '100%' }}
                size="small"
                value={baseType}
                onChange={handleBaseTypeChange}
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'offshore', label: '近海' },
                  { value: 'deepsea', label: '深远海' },
                  { value: 'land', label: '陆基工厂化' },
                ]}
              />
            </div>

            {/* 合作属性筛选 */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <TeamOutlined style={{ marginRight: 6, color: '#8c8c8c', fontSize: 12 }} />
                <Text style={{ fontSize: 13, color: '#595959' }}>合作属性</Text>
              </div>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Checkbox
                    checked={cooperationAttrs.taiwanCooperation}
                    onChange={(e) => handleCooperationAttrChange('taiwanCooperation', e.target.checked)}
                    style={{ fontSize: 12 }}
                  >
                    台资合作
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={cooperationAttrs.deepSeaCertified}
                    onChange={(e) => handleCooperationAttrChange('deepSeaCertified', e.target.checked)}
                    style={{ fontSize: 12 }}
                  >
                    深远海认证
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={cooperationAttrs.greenCertification}
                    onChange={(e) => handleCooperationAttrChange('greenCertification', e.target.checked)}
                    style={{ fontSize: 12 }}
                  >
                    绿色认证
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
        </Panel>
      </Collapse>

      <Divider style={{ margin: 0 }} />

      {/* 基地列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <List
          dataSource={bases}
          renderItem={(item) => (
            <List.Item
              onClick={() => onSelect(item)}
              style={{
                cursor: 'pointer',
                padding: '12px 8px',
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: selectedBaseId === item.id ? '#e6f7ff' : 'transparent',
                border: selectedBaseId === item.id ? '1px solid #91d5ff' : '1px solid transparent',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text strong>{item.name}</Text>
                  <Badge status={getStatusColor(item.status)} text={getStatusText(item.status)} />
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {item.location[0].toFixed(4)}, {item.location[1].toFixed(4)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tag color="blue">溶氧: {(item.waterQuality?.oxygen || '--')}mg/L</Tag>
                  <Tag color="orange">水温: {(item.waterQuality?.temp || '--')}℃</Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default BaseFilter;
