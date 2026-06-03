import { Badge, Card, Col, Row, Space, Statistic, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { getDisasterInfo } from "@/services/api/weather";
import { MOCK_REAL_TIME_WEATHER } from "@/services/api/mock";

const { Text } = Typography;

const DisasterHeader: React.FC = () => {
  const [disaster, setDisaster] = useState<any>(null);

  useEffect(() => {
    getDisasterInfo()
      .then((res) => setDisaster(res.data || null))
      .catch(() => setDisaster(null));
  }, []);

  if (!disaster) {
    return (
      <Card variant="borderless" style={{ backgroundColor: "#fff1f0", border: "1px solid #ffa39e" }}
        styles={{ body: { padding: "16px 24px", textAlign: "center" } }}>
        <Text type="secondary">当前无活跃灾害预警</Text>
      </Card>
    );
  }

  const levelColor =
    disaster.level === "red"
      ? "#cf1322"
      : disaster.level === "orange"
        ? "#fa8c16"
        : "#fadb14";

  return (
    <Card
      variant="borderless"
      className="fin-card"
      style={{ backgroundColor: "#fff1f0", border: "1px solid #ffa39e" }}
      styles={{ body: { padding: "16px 24px" } }}
    >
      <Row gutter={24} align="middle">
        <Col span={6}>
          <Space direction="vertical" size={0}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge status="error" />
              <Text strong style={{ fontSize: "16px", color: "#cf1322" }}>
                {disaster.name}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              编号：{disaster.id} | 预警等级：
              <span style={{ color: levelColor, fontWeight: "bold" }}>
                {disaster.level === "red"
                  ? "红色"
                  : disaster.level === "orange"
                    ? "橙色"
                    : "黄色"}
              </span>
            </Text>
          </Space>
        </Col>

        <Col span={4}>
          <Statistic
            title={<span style={{ fontSize: "12px" }}>中心最大风力</span>}
            value={disaster.maxWind}
            suffix="级"
            valueStyle={{ fontSize: "24px", color: "#cf1322", fontWeight: "bold" }}
            className="fin-number"
          />
        </Col>

        <Col span={4}>
          <Statistic
            title={<span style={{ fontSize: "12px" }}>移动速度</span>}
            value={disaster.speed}
            suffix="km/h"
            valueStyle={{ fontSize: "24px", color: "#cf1322" }}
            className="fin-number"
          />
        </Col>

        <Col span={4}>
          <Statistic
            title={<span style={{ fontSize: "12px" }}>中心气压</span>}
            value={disaster.pressure}
            suffix="hPa"
            valueStyle={{ fontSize: "24px" }}
            className="fin-number"
          />
        </Col>

        <Col span={6} style={{ borderLeft: "1px solid #ffa39e", paddingLeft: "24px" }}>
          <Space direction="vertical" size={4}>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>风险评估统计</div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Text style={{ fontSize: "13px" }}>受影响基地</Text>
              <Text strong className="fin-number" style={{ color: "#cf1322" }}>
                {disaster.affectedBases} 个
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Text style={{ fontSize: "13px" }}>高风险资产</Text>
              <Text strong className="fin-number" style={{ color: "#cf1322" }}>
                ¥{disaster.highRiskAssets}M
              </Text>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DisasterHeader;
