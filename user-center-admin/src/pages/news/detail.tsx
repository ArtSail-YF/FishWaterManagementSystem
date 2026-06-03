import { Card, Spin, Tag, Typography } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { history, useParams } from "@umijs/max";
import { getNewsDetail, type NewsItem } from "@/services/api/news";

const { Text, Title } = Typography;

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  industry: { label: "行业动态", color: "#1f2937" },
  market: { label: "市场行情", color: "#1890ff" },
  policy: { label: "政策法规", color: "#52c41a" },
  tech: { label: "技术前沿", color: "#722ed1" },
};

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getNewsDetail(Number(id))
      .then((res) => setItem(res.data || null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <Spin spinning={loading}>
        {item && (
          <Card variant="borderless">
            <div
              style={{ cursor: "pointer", marginBottom: 16, color: "#595959" }}
              onClick={() => history.push("/news")}
            >
              <ArrowLeftOutlined style={{ marginRight: 6 }} />
              返回列表
            </div>

            <div style={{ marginBottom: 12 }}>
              <Tag color={CATEGORY_MAP[item.category]?.color || "#8c8c8c"} style={{ borderRadius: 2 }}>
                {CATEGORY_MAP[item.category]?.label || item.category}
              </Tag>
            </div>

            <Title level={3} style={{ marginBottom: 12 }}>{item.title}</Title>

            <div style={{ marginBottom: 20, color: "#8c8c8c", fontSize: 13 }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {item.publishTime?.slice(0, 10)}
              {item.source && <span style={{ marginLeft: 16 }}>来源：{item.source}</span>}
            </div>

            {item.summary && (
              <div style={{ backgroundColor: "#fafafa", padding: "12px 16px", borderRadius: 6, marginBottom: 20, fontSize: 13, color: "#595959", lineHeight: "22px" }}>
                {item.summary}
              </div>
            )}

            <div
              style={{ fontSize: 14, lineHeight: "28px", color: "#262626" }}
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />
          </Card>
        )}

        {!loading && !item && (
          <Card variant="borderless"><Text type="secondary">资讯不存在</Text></Card>
        )}
      </Spin>
    </div>
  );
};

export default NewsDetail;
