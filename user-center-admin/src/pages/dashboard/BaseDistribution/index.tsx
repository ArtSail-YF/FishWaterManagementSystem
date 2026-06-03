import React, { useState, useEffect } from "react";
import BaseFilter from "./components/BaseFilter";
import GISStats from "./components/GISStats";
import GisMap from "./components/GisMap";
import WeatherMini from "./components/WeatherMini";
import WeatherSummary from "@/pages/weather/RealTime/components/WeatherSummary";
import { getBaseList } from "@/services/api/base";
import { getAquacultureAdvice } from "@/services/api/weather";
import { MOCK_AQUACULTURE_ADVICE } from "@/services/api/mock";
import { getBasesWeather } from "@/services/api/weather";

const BaseDistribution: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bases, setBases] = useState<Pond.BaseItem[]>([]);
  const [selectedBase, setSelectedBase] = useState<Pond.BaseItem | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [weatherMap, setWeatherMap] = useState<Record<string, any>>({});
  const [advice, setAdvice] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [baseRes, weatherRes] = await Promise.all([
        getBaseList(),
        getBasesWeather(),
      ]);
      const data = baseRes.data?.records || baseRes.data || [];
      setBases(Array.isArray(data) ? data : []);
      const wMap: Record<string, any> = {};
      const wList = weatherRes?.data || [];
      (Array.isArray(wList) ? wList : []).forEach((w: any) => {
        wMap[String(w.baseId)] = w;
      });
      setWeatherMap(wMap);
      getAquacultureAdvice().then((r) => {
        const a = r.data;
        if (a?.indices?.[0]?.desc) setAdvice(a.indices[0].desc);
        else if (a?.forecast?.[0]?.advice) setAdvice(a.forecast[0].advice);
      }).catch(() => {
        const a = MOCK_AQUACULTURE_ADVICE;
        if (a?.indices?.[0]?.desc) setAdvice(a.indices[0].desc);
      });
    } catch (error) {
      console.error("fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    normal: bases.filter((b) => b.status === "normal").length,
    todo: bases.filter((b) => b.status === "todo").length,
    warning: bases.filter((b) => b.status === "warning").length,
  };

  const filteredBases = bases.filter((b) =>
    b.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelectBase = (base: Pond.BaseItem) => {
    setSelectedBase(base);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusClick = (status: string) => {};

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <WeatherSummary />

      <div
        style={{
          position: "absolute",
          top: 32,
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
        }}
      >
        <div
          style={{
            width: 220,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "6px 0 6px 6px",
            flexShrink: 0,
          }}
        >
          <GISStats stats={stats} onStatusClick={handleStatusClick} />
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <BaseFilter
              bases={filteredBases}
              selectedBaseId={selectedBase?.id}
              onSelect={handleSelectBase}
              onSearch={handleSearch}
              weatherMap={weatherMap}
            />
          </div>
          <WeatherMini />
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <GisMap
            bases={filteredBases}
            selectedBase={selectedBase}
            onMarkerClick={handleSelectBase}
          />
        </div>
      </div>
      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 88,
          left: 0,
          right: 0,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderTop: "1px solid #f0f0f0",
          fontSize: 12,
          color: "#595959",
        }}
      >
        <span>养殖建议：{advice}</span>
      </div>

    </div>
  );
};

export default BaseDistribution;






