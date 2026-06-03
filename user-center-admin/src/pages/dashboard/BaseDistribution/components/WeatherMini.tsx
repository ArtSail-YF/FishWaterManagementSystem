import { Typography } from "antd";
import React, { useState, useEffect } from "react";
import { getRealTimeWeather } from "@/services/api/weather";
import { MOCK_REAL_TIME_WEATHER } from "@/services/api/mock";

const { Text } = Typography;

const WeatherMini: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    getRealTimeWeather()
      .then((res) => setWeather(res.data || {}))
      .catch(() => setWeather(MOCK_REAL_TIME_WEATHER));
  }, []);

  const w = weather || MOCK_REAL_TIME_WEATHER;
  const tideText =
    w.tide?.status === "rising"
      ? "涨潮"
      : w.tide?.status === "falling"
        ? "落潮"
        : "平潮";

  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        borderRadius: 6,
        fontSize: 12,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: 500 }}>
        {w.avgTemp ?? "--"}
        °C
      </Text>
      <Text type="secondary" style={{ fontSize: 11 }}>
        {w.maxWind ?? "--"}m/s
      </Text>
      <Text style={{ fontSize: 11, color: "#1890ff" }}>
        {tideText} {w.tide?.height ? `±${w.tide.height}m` : ""}
      </Text>
      <Text type="secondary" style={{ fontSize: 11 }}>
        体感{Math.round((w.avgTemp || 0) + 2)}°C
      </Text>
    </div>
  );
};

export default WeatherMini;

