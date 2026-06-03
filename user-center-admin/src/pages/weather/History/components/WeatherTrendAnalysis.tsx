import { Card, Space, Tag, Typography } from "antd";
import ReactECharts from "echarts-for-react";
import React, { useState, useEffect } from "react";
import { getWeatherHistory } from "@/services/api/weather";
import type { WeatherHistoryItem } from "@/services/api/weather";

const { Text } = Typography;

const WeatherTrendAnalysis: React.FC = () => {
  const [data, setData] = useState<WeatherHistoryItem[]>([]);

  useEffect(() => {
    getWeatherHistory()
      .then((res) => setData(res.data || []))
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <Card variant="borderless" className="fin-card">
        <Text type="secondary">暂无历史数据</Text>
      </Card>
    );
  }

  // Sort by time
  const sorted = [...data].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const dates = sorted.map((d) => d.time.slice(5, 16));

  // Group data by base
  const baseMap: Record<string, { times: string[]; temps: number[] }> = {};
  sorted.forEach((d) => {
    if (!baseMap[d.base]) baseMap[d.base] = { times: [], temps: [] };
    baseMap[d.base].times.push(d.time);
    baseMap[d.base].temps.push(d.avgTemp);
  });

  const maxTemp = Math.max(...sorted.map((d) => d.avgTemp));
  const minTemp = Math.min(...sorted.map((d) => d.avgTemp));
  const maxPressureDiff =
    Math.max(...sorted.map((d) => d.avgPressure)) -
    Math.min(...sorted.map((d) => d.avgPressure));

  const baseNames: Record<string, string> = {
    hz: "杭州基地",
    zs: "舟山基地",
    nb: "宁波基地",
    wz: "温州基地",
  };
  const colors = ["#cf1322", "#1f2937", "#1890ff", "#52c41a"];

  const series = Object.entries(baseMap).map(([key, val], i) => ({
    name: baseNames[key] || key,
    type: "line" as const,
    smooth: true,
    data: sorted
      .filter((d) => d.base === key)
      .map((d) => d.avgTemp),
    itemStyle: { color: colors[i % colors.length] },
    lineStyle: { width: 2 },
  }));

  series.push({
    name: "气压走势",
    type: "line",
    yAxisIndex: 1,
    data: sorted.map((d) => d.avgPressure),
    itemStyle: { color: "#6b7280" },
    lineStyle: { width: 1.5, type: "dashed" as const },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: "rgba(82,196,26,0.1)" },
          { offset: 1, color: "rgba(82,196,26,0.01)" },
        ],
      },
    },
  });

  const option = {
    backgroundColor: "transparent",
    grid: { left: "3%", right: "3%", bottom: "15%", top: "20%", containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: "rgba(0,0,0,0.85)",
      borderColor: "#333",
      textStyle: { color: "#fff", fontSize: 12 },
    },
    legend: {
      data: [...Object.values(baseNames).slice(0, Math.min(4, Object.keys(baseMap).length)), "气压走势"],
      top: "0",
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: "#595959", fontSize: 11 },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
      axisLabel: { color: "#8c8c8c", fontSize: 10 },
      axisLine: { lineStyle: { color: "#f0f0f0" } },
    },
    yAxis: [
      {
        type: "value",
        name: "气温 (°C)",
        nameTextStyle: { color: "#8c8c8c", fontSize: 10 },
        axisLabel: { color: "#8c8c8c", fontSize: 10 },
        splitLine: { lineStyle: { type: "dashed", color: "#f0f0f0" } },
      },
      {
        type: "value",
        name: "气压 (hPa)",
        nameTextStyle: { color: "#8c8c8c", fontSize: 10 },
        axisLabel: { color: "#8c8c8c", fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series,
    dataZoom: [
      {
        type: "slider",
        height: 20,
        bottom: 10,
        borderColor: "transparent",
        backgroundColor: "#f0f0f0",
        fillerColor: "rgba(24,144,255,0.1)",
        handleSize: "0",
      },
    ],
  };

  return (
    <Card
      title={
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
          历史趋势深度对比分析 / TREND ANALYSIS
        </span>
      }
      className="fin-card"
      variant="borderless"
      extra={
        <Space>
          <Tag color="error">极值标注</Tag>
          <Tag color="processing">多轴对比</Tag>
        </Space>
      }
      styles={{ body: { padding: "16px 24px" } }}
    >
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "24px",
        }}
      >
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            查询范围内最高温
          </Text>
          <Text
            strong
            className="fin-number"
            style={{ fontSize: "18px", color: "#cf1322" }}
          >
            {maxTemp.toFixed(1)}°C
          </Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            查询范围内最低温
          </Text>
          <Text
            strong
            className="fin-number"
            style={{ fontSize: "18px", color: "#3f8600" }}
          >
            {minTemp.toFixed(1)}°C
          </Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            最大气压差
          </Text>
          <Text strong className="fin-number" style={{ fontSize: "18px" }}>
            {maxPressureDiff}hPa
          </Text>
        </Space>
      </div>
      <ReactECharts option={option} style={{ height: "320px" }} />
    </Card>
  );
};

export default WeatherTrendAnalysis;
