import { Card, Col, Row, Statistic } from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import React from "react";

interface GISStatsProps {
  stats: {
    normal: number;
    todo: number;
    warning: number;
  };
  onStatusClick: (status: string) => void;
}

const GISStats: React.FC<GISStatsProps> = ({ stats, onStatusClick }) => {
  const total = stats.normal + stats.todo + stats.warning;

  return (
    <Card variant="borderless" styles={{ body: { padding: "10px 12px" } }}>
      <Row gutter={8}>
        <Col span={8}>
          <div
            onClick={() => onStatusClick("normal")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Statistic
              title={
                <span style={{ fontSize: 12 }}>
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  总基地
                </span>
              }
              value={total}
              valueStyle={{ color: "#1f2937", fontSize: 16 }}
              suffix="个"
            />
          </div>
        </Col>
        <Col span={8}>
          <div
            onClick={() => onStatusClick("normal")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Statistic
              title={
                <span style={{ fontSize: 12 }}>
                  <CheckCircleOutlined
                    style={{ marginRight: 4, color: "#52c41a" }}
                  />
                  正常
                </span>
              }
              value={stats.normal}
              valueStyle={{ color: "#52c41a", fontSize: 16 }}
              suffix="个"
            />
          </div>
        </Col>
        <Col span={8}>
          <div
            onClick={() => onStatusClick("warning")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Statistic
              title={
                <span style={{ fontSize: 12 }}>
                  <WarningOutlined
                    style={{ marginRight: 4, color: "#ef4444" }}
                  />
                  预警
                </span>
              }
              value={stats.warning}
              valueStyle={{ color: "#ef4444", fontSize: 16 }}
              suffix="个"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default GISStats;
