import type { ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Card, Space, Tag, Typography } from "antd";
import React from "react";
import { getWeatherHistory } from "@/services/api/weather";

const { Text } = Typography;

export type WeatherHistoryItem = {
  id: string;
  time: string;
  base: string;
  weather: string;
  avgTemp: number;
  maxWind: number;
  totalRain: number;
  avgPressure: number;
  status: "normal" | "extreme";
};

const WeatherHistoryTable: React.FC = () => {
  const columns: ProColumns<WeatherHistoryItem>[] = [
    {
      title: "采集时间",
      dataIndex: "time",
      valueType: "dateTime",
      width: 160,
      render: (text) => (
        <Text className="fin-number" style={{ fontSize: "13px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "监测基地",
      dataIndex: "base",
      width: 120,
      valueEnum: {
        hz: { text: "杭州基地" },
        zs: { text: "舟山基地" },
        nb: { text: "宁波基地" },
        wz: { text: "温州基地" },
      },
    },
    {
      title: "天气现象",
      dataIndex: "weather",
      width: 100,
      render: (text) => (
        <Space size={4}>
          <Text style={{ fontSize: "12px" }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: "平均气温",
      dataIndex: "avgTemp",
      width: 100,
      align: "right",
      render: (text: any) => (
        <Text
          className="fin-number"
          style={{
            color: text > 30 ? "#cf1322" : text < 15 ? "#3f8600" : "#262626",
            fontWeight: "bold",
          }}
        >
          {text}°C
        </Text>
      ),
    },
    {
      title: "最大风力",
      dataIndex: "maxWind",
      width: 100,
      align: "right",
      render: (text: any) => (
        <Text
          className="fin-number"
          style={{ color: text > 8 ? "#cf1322" : "#262626" }}
        >
          {text}级
        </Text>
      ),
    },
    {
      title: "总降水量",
      dataIndex: "totalRain",
      width: 100,
      align: "right",
      render: (text: any) => (
        <Text className="fin-number">{text}mm</Text>
      ),
    },
    {
      title: "平均气压",
      dataIndex: "avgPressure",
      width: 110,
      align: "right",
      render: (text: any) => (
        <Text className="fin-number">{text}hPa</Text>
      ),
    },
    {
      title: "风险等级",
      dataIndex: "status",
      width: 100,
      render: (text: any) => (
        <Tag
          color={text === "extreme" ? "error" : "success"}
          style={{ borderRadius: "2px", fontSize: "11px", margin: 0 }}
        >
          {text === "extreme" ? "极端天气" : "常规气象"}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      className="fin-card"
      variant="borderless"
      styles={{ body: { padding: "0" } }}
    >
      <ProTable<WeatherHistoryItem>
        columns={columns}
        request={async (params) => {
          const res = await getWeatherHistory();
          const data = res.data || [];
          return {
            data,
            success: true,
            total: data.length,
          };
        }}
        rowKey="id"
        search={false}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        size="small"
        headerTitle={
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            历史气象明细清单 / DATA LIST
          </span>
        }
      />
    </Card>
  );
};

export default WeatherHistoryTable;
