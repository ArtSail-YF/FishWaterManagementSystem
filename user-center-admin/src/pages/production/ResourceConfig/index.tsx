import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Layout, Typography, Empty } from 'antd';
import { getBaseList, type Base } from '@/services/api/base';
import BaseSidebar from './components/BaseSidebar';
import ResourcePondPanel from './components/ResourcePondPanel';

const { Sider, Content } = Layout;
const { Text } = Typography;

const ResourceConfig = () => {
  const [bases, setBases] = useState<Base[]>([]);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);

  const loadBases = async () => {
    try {
      const res = await getBaseList();
      const list = Array.isArray(res) ? res : (res.data?.records || res.data || []);
      setBases(list);
      if (selectedBase && !list.some((b: Base) => b.id === selectedBase.id)) {
        setSelectedBase(null);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadBases();
  }, []);

  return (
    <PageContainer>
      <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 180px)' }}>
        <Sider
          width={280}
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: '20px 20px',
            marginRight: 24,
            border: '1px solid #f0f0f0',
            overflow: 'auto',
          }}
        >
          <BaseSidebar
            bases={bases}
            selectedId={selectedBase?.id ?? null}
            onSelect={setSelectedBase}
            onChanged={loadBases}
          />
        </Sider>

        <Content style={{ background: '#fff', borderRadius: 8, padding: 24, border: '1px solid #f0f0f0' }}>
          {selectedBase ? (
            <ResourcePondPanel key={selectedBase.id} base={selectedBase} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300 }}>
              <Empty description="请从左侧选择一个基地" />
            </div>
          )}
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default ResourceConfig;
