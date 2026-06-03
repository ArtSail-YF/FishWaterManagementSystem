import { Card, Col, Row, Tag, Typography, Spin, Space, Pagination } from "antd";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { history } from "@umijs/max";
import { getNewsList, type NewsItem } from "@/services/api/news";

const { Text, Title } = Typography;

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  industry: { label: "行业动态", color: "#1f2937" },
  market: { label: "市场行情", color: "#1890ff" },
  policy: { label: "政策法规", color: "#52c41a" },
  tech: { label: "技术前沿", color: "#722ed1" },
};

const CATEGORIES = [
  { key: "", label: "全部" },
  { key: "industry", label: "行业动态" },
  { key: "market", label: "市场行情" },
  { key: "policy", label: "政策法规" },
  { key: "tech", label: "技术前沿" },
];

const NewsList: React.FC = () => {
  const [list, setList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchData = async (p: number, cat: string) => {
    setLoading(true);
    try {
      const res = await getNewsList({ current: p, pageSize: 10, category: cat || undefined });
      setList(res.data?.records || []);
      setTotal(res.data?.total || 0);
    } catch (_) {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, category);
  }, [page, category]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <Title level={4} style={{ marginBottom: 20 }}>资讯导航</Title>

      {/* Category tabs */}
      <Card variant="borderless" styles={{ body: { padding: "12px 16px" } }} style={{ marginBottom: 16 }}>
        <Space wrap>
          {CATEGORIES.map((c) => (
            <Tag
              key={c.key}
              color={category === c.key ? "#1f2937" : "default"}
              style={{ cursor: "pointer", padding: "4px 16px", borderRadius: 4, margin: 0 }}
              onClick={() => { setCategory(c.key); setPage(1); }}
            >
              {c.label}
            </Tag>
          ))}
        </Space>
      </Card>

      <Spin spinning={loading}>
        {list.map((item) => {
          const cat = CATEGORY_MAP[item.category] || { label: item.category, color: "#8c8c8c" };
          return (
            <Card
              key={item.id}
              variant="borderless"
              hoverable
              style={{ marginBottom: 12 }}
              styles={{ body: { padding: "16px 20px" } }}
              onClick={() => history.push("/news/" + item.id)}
            >
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  <div style={{ marginBottom: 6 }}>
                    <Tag color={cat.color} style={{ borderRadius: 2, fontSize: 11 }}>{cat.label}</Tag>
                    {item.source && (
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{item.source}</Text>
                    )}
                  </div>
                  <Text strong style={{ fontSize: 15, lineHeight: "24px" }}>{item.title}</Text>
                  {item.summary && (
                    <div style={{ fontSize: 13, color: "#8c8c8c", marginTop: 6, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.summary}
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {item.publishTime?.slice(0, 10)}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          );
        })}

        {!loading && list.length === 0 && (
          <Card variant="borderless"><Text type="secondary">暂无资讯</Text></Card>
        )}

        {total > 10 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Pagination current={page} total={total} onChange={setPage} showSizeChanger={false} />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default NewsList;
