import AMapLoader from "@amap/amap-jsapi-loader";
import { Spin, Radio, RadioChangeEvent, Checkbox, CheckboxChangeEvent } from "antd";
import React, { useEffect, useRef, useState } from "react";
import type { Base } from "@/models/base";

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

const isValidCoord = (loc: any): loc is [number, number] =>
  loc &&
  Array.isArray(loc) &&
  loc.length >= 2 &&
  !isNaN(Number(loc[0])) &&
  !isNaN(Number(loc[1]));

interface GisMapProps {
  bases: Base[];
  selectedBase?: Base;
  onMarkerClick: (base: Base) => void;
}

const GisMap: React.FC<GisMapProps> = ({ bases, selectedBase, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [mapType, setMapType] = useState<string>("standard");
  const [layers, setLayers] = useState({
    base: true,
    pond: true,
    device: true,
    channel: true,
  });

  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: "c45605948a17f054b3a28823baa42cf5",
    };

    AMapLoader.load({
      key: "dc6e158e590e6dd03f973bb0eafba585",
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.InfoWindow", "AMap.Marker"],
    })
      .then((AMap) => {
        let mapInstance;
        try {
          mapInstance = new AMap.Map(mapRef.current, {
            viewMode: "3D",
            zoom: 11,
            center: [120.153576, 30.287459],
          });
        } catch (e) {
          console.error("Map init failed, retrying", e);
          mapInstance = new AMap.Map(mapRef.current, {
            zoom: 11,
            center: [120.153576, 30.287459],
          });
        }
        mapInstance.addControl(new AMap.Scale());
        mapInstance.addControl(new AMap.ToolBar());
        setMap(mapInstance);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Map load error", e);
        setLoading(false);
      });

    return () => {
      // use the ref-based cleanup pattern instead of closure over stale state
    };
  }, []);

  // Cleanup on unmount via a separate effect with map state
  useEffect(() => {
    return () => {
      if (map) map.destroy();
    };
  }, [map]);


  // Auto-center on first base when bases first load
  const hasAutoCentered = useRef(false);
  useEffect(() => {
    if (!map || !window.AMap || hasAutoCentered.current) return;
    const first = (bases || []).find((b) => isValidCoord(b.location));
    if (first) {
      map.setCenter(first.location);
      map.setZoom(11);
      hasAutoCentered.current = true;
    }
  }, [bases, map]);

  // Update markers when bases change
  useEffect(() => {
    if (!map || !window.AMap) return;
    Object.values(markersRef.current).forEach((m: any) => {
      try { map.remove(m); } catch (_) {}
    });
    markersRef.current = {};

    (bases || []).forEach((base) => {
      if (!isValidCoord(base.location)) return;

      try {
        const marker = new window.AMap.Marker({
          position: base.location,
          title: base.name,
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(24, 34),
            image: base.status === "warning"
              ? "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"
              : "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            imageSize: new window.AMap.Size(24, 34),
          }),
        });

        marker.on("click", () => {
          onMarkerClick(base);
          openInfoWindow(base, marker);
        });

        marker.setMap(map);
        markersRef.current[String(base.id)] = marker;
      } catch (e) {
        console.warn("Marker creation failed for", base.name, e);
      }
    });
  }, [bases, map]);

  useEffect(() => {
    if (!map || !selectedBase || !window.AMap) return;
    const marker = markersRef.current[selectedBase.id];
    if (!marker) return;
    if (!isValidCoord(selectedBase.location)) return;

    try {
      map.setCenter(selectedBase.location);
      map.setZoom(17);
      map.panBy(-110, 0);
      openInfoWindow(selectedBase, marker);
    } catch (e) {
      console.warn("Center/zoom/infoWindow failed for", selectedBase.name, e);
    }
  }, [selectedBase, map]);

  const openInfoWindow = (base: Base, marker: any) => {
    if (!map || !window.AMap) return;
    if (!isValidCoord(base.location)) return;

    try {
      const waterQuality = base.waterQuality || { oxygen: "--", temp: "--", ph: "--" };
      const infoWindow = new window.AMap.InfoWindow({
        content: '<div style="padding:12px;min-width:200px;">' +
          '<h4 style="margin:0 0 8px 0;font-size:16px;">' + base.name + '</h4>' +
          '<div style="margin-bottom:4px;">状态: <span style="color:' + (base.status === "warning" ? "#ef4444" : "#6b7280") + '">' + (base.status === "warning" ? "预警" : "正常") + '</span></div>' +
          '<div style="margin-bottom:4px;">溶解氧量: ' + waterQuality.oxygen + ' mg/L</div>' +
          '<div style="margin-bottom:4px;">水温: ' + waterQuality.temperature + ' °C</div>' +
          '<div style="margin-bottom:4px;">PH值: ' + waterQuality.ph + '</div>' +
          '<div style="margin-top:8px;border-top:1px solid #eee;padding-top:8px;">' +
          '<a href="/dashboard/integrated-dashboard" style="color:#1f2937;">查看综合监测 &gt;</a>' +
          '</div>',
        offset: new window.AMap.Pixel(0, -30),
      });
      infoWindow.open(map, base.location);
    } catch (e) {
      console.warn("InfoWindow open failed for", base.name, e);
    }
  };

  const handleMapTypeChange = (e: RadioChangeEvent) => {
    setMapType(e.target.value);
  };

  const handleLayerChange = (layer: string, checked: boolean) => {
    setLayers((prev) => ({ ...prev, [layer]: checked }));
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Map container - fills parent */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.6)", zIndex: 5,
        }}>
          <Spin size="large" tip="加载地图中..." />
        </div>
      )}

      {/* Map controls overlay */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: "white",
          padding: 12,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          pointerEvents: "auto",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>底图切换</div>
          <Radio.Group value={mapType} onChange={handleMapTypeChange} buttonStyle="solid" size="small">
            <Radio.Button value="standard">标准</Radio.Button>
            <Radio.Button value="satellite">卫星</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>图层控制</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Checkbox checked={layers.base} onChange={(e: CheckboxChangeEvent) => handleLayerChange("base", e.target.checked)}>
              基地
            </Checkbox>
            <Checkbox checked={layers.pond} onChange={(e: CheckboxChangeEvent) => handleLayerChange("pond", e.target.checked)}>
              塘口
            </Checkbox>
            <Checkbox checked={layers.device} onChange={(e: CheckboxChangeEvent) => handleLayerChange("device", e.target.checked)}>
              设备
            </Checkbox>
            <Checkbox checked={layers.channel} onChange={(e: CheckboxChangeEvent) => handleLayerChange("channel", e.target.checked)}>
              水道
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisMap;




