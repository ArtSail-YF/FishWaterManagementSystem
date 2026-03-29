import AMapLoader from '@amap/amap-jsapi-loader';
import { Card, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { BaseItem } from './BaseFilter';

interface GisMapProps {
  bases: BaseItem[];
  selectedBase?: BaseItem;
  onMarkerClick: (base: BaseItem) => void;
}

const GisMap: React.FC<GisMapProps> = ({ bases, selectedBase, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    // 解决 AMap 2.0 INVALID_USER_KEY 错误，设置安全密钥
    // 注意：正式环境建议通过环境变量注入
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '04764b88497672223a5980004128522e', // 假设这是配套的密钥，如果不对请用户提供
    };

    AMapLoader.load({
      key: '109677464197e889b9404c0e66d9294e',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.InfoWindow', 'AMap.Marker'],
    })
      .then((AMap) => {
        const mapInstance = new AMap.Map(mapRef.current, {
          viewMode: '3D',
          zoom: 11,
          center: [120.153576, 30.287459], // 默认中心点（杭州）
        });

        mapInstance.addControl(new AMap.Scale());
        mapInstance.addControl(new AMap.ToolBar());

        setMap(mapInstance);
        setLoading(false);
      })
      .catch((e) => {
        console.error('地图加载失败', e);
        setLoading(false);
      });

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  // 处理标记点渲染
  useEffect(() => {
    if (!map) return;

    // 清除旧标记点
    Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
    markersRef.current = {};

    bases.forEach((base) => {
      // 数据校验，避免 NaN 错误
      if (!base.location || isNaN(base.location[0]) || isNaN(base.location[1])) {
        console.warn(`基地 ${base.name} 的坐标无效:`, base.location);
        return;
      }

      // 创建 DOM 元素作为标记点内容，避免 AMap 2.0 的 string content 兼容性问题
      const color = base.status === 'warning' ? '#ff4d4f' : base.status === 'todo' ? '#1890ff' : '#52c41a';
      const div = document.createElement('div');
      div.style.backgroundColor = color;
      div.style.width = '26px';
      div.style.height = '26px';
      div.style.borderRadius = '50% 50% 50% 0';
      div.style.transform = 'rotate(-45deg)';
      div.style.border = '2px solid #fff';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new window.AMap.Marker({
        position: base.location,
        title: base.name,
        offset: new window.AMap.Pixel(-13, -30),
        content: div, // 直接传 DOM 元素
      });

      marker.on('click', () => {
        onMarkerClick(base);
        openInfoWindow(base, marker);
      });

      marker.setMap(map);
      markersRef.current[base.id] = marker;
    });

    if (bases.length > 0) {
      map.setFitView();
    }
  }, [map, bases]);

  // 处理选中基地联动
  useEffect(() => {
    if (map && selectedBase && markersRef.current[selectedBase.id]) {
      const marker = markersRef.current[selectedBase.id];
      // 再次校验坐标
      if (selectedBase.location && !isNaN(selectedBase.location[0]) && !isNaN(selectedBase.location[1])) {
        map.setCenter(selectedBase.location);
        map.setZoom(15);
        openInfoWindow(selectedBase, marker);
      }
    }
  }, [selectedBase, map]);

  const openInfoWindow = (base: BaseItem, marker: any) => {
    if (!map) return;

    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-size: 16px;">${base.name}</h4>
          <div style="margin-bottom: 4px;">状态: <span style="color: ${base.status === 'warning' ? '#ff4d4f' : '#52c41a'}">${base.status === 'warning' ? '预警' : '正常'}</span></div>
          <div style="margin-bottom: 4px;">溶氧量: ${base.waterQuality.oxygen} mg/L</div>
          <div style="margin-bottom: 4px;">水温: ${base.waterQuality.temp} ℃</div>
          <div style="margin-bottom: 4px;">PH值: ${base.waterQuality.ph}</div>
          <div style="margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px;">
            <a href="/dashboard/pond-archives?baseId=${base.id}" style="color: #1890ff;">查看详情 &gt;</a>
          </div>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30),
    });

    infoWindow.open(map, base.location);
  };

  return (
    <Card styles={{ body: { padding: 0 } }} style={{ height: 'calc(100vh - 250px)', position: 'relative' }}>
      <Spin spinning={loading} tip="地图加载中..." size="large">
        <div ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 250px)' }} />
      </Spin>
    </Card>
  );
};

export default GisMap;
