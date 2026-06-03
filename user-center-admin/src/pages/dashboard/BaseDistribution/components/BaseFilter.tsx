import {
  EnvironmentOutlined,
  SearchOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { Badge, Card, Input, List, Tag, Typography } from "antd";
import React from "react";
import type { Base } from "@/models/base";

const { Text } = Typography;

interface BaseFilterProps {
  bases: Base[];
  selectedBaseId?: string;
  onSelect: (base: Base) => void;
  onSearch: (value: string) => void;
  weatherMap?: Record<string, any>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "success";
    case "warning":
      return "error";
    case "todo":
      return "processing";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "normal":
      return "正常";
    case "warning":
      return "预警";
    case "todo":
      return "待办";
    default:
      return "未知";
  }
};

const BaseFilter: React.FC<BaseFilterProps> = ({
  bases,
  selectedBaseId,
  onSelect,
  onSearch,
  weatherMap = {},
}) => {
  return (
    <Card
      variant="borderless"
      styles={{ body: { padding: 0 } }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Search */}
      <div style={{ padding: "8px 10px" }}>
        <Input
          placeholder="搜索基地"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          size="small"
          variant="borderless"
          style={{ backgroundColor: "#f5f5f5", borderRadius: 4 }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 6px 6px" }}>
        <List
          dataSource={bases}
          size="small"
          renderItem={(item) => (
            <List.Item
              onClick={() => onSelect(item)}
              style={{
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: 6,
                marginBottom: 4,
                backgroundColor:
                  selectedBaseId === item.id ? "#e6f7ff" : "transparent",
                border:
                  selectedBaseId === item.id
                    ? "1px solid #91d5ff"
                    : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Text strong style={{ fontSize: 13 }}>
                    {item.name}
                  </Text>
                  <Badge
                    status={getStatusColor(item.status)}
                    text={
                      <span style={{ fontSize: 11 }}>
                        {getStatusText(item.status)}
                      </span>
                    }
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8c8c8c",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <EnvironmentOutlined style={{ marginRight: 2 }} />
                    {item.location?.[0]?.toFixed(2) ?? "--"},{" "}
                    {item.location?.[1]?.toFixed(2) ?? "--"}
                  </span>
                  {weatherMap[item.id]?.temperature != null && (
                    <span style={{ color: "#1890ff" }}>
                      <CloudOutlined style={{ fontSize: 10, marginRight: 2 }} />
                      {weatherMap[item.id].temperature}°C
                    </span>
                  )}
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
