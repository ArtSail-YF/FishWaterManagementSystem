import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Layout, Typography, Empty } from 'antd';
import { getCategoryList, type MatCategory } from '@/services/api/material/category';
import CategoryPanel from './components/CategoryPanel';
import MaterialPanel from './components/MaterialPanel';

const { Sider, Content } = Layout;
const { Text } = Typography;

const MaterialConfig = () => {
  const [categories, setCategories] = useState<MatCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MatCategory | null>(null);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList();
      const list = res.data?.records || res.data || [];
      const cats = Array.isArray(list) ? list : [];
      setCategories(cats);
      if (selectedCategory && !cats.some(c => c.id === selectedCategory.id)) {
        setSelectedCategory(null);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadCategories();
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
          <CategoryPanel
            categories={categories}
            selectedId={selectedCategory?.id ?? null}
            onSelect={setSelectedCategory}
            onChanged={loadCategories}
          />
        </Sider>

        <Content style={{ background: '#fff', borderRadius: 8, padding: 24, border: '1px solid #f0f0f0' }}>
          {selectedCategory ? (
            <MaterialPanel
              key={selectedCategory.id}
              category={selectedCategory}
              categories={categories}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300 }}>
              <Empty description="请从左侧选择一个物料分类" />
            </div>
          )}
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default MaterialConfig;
