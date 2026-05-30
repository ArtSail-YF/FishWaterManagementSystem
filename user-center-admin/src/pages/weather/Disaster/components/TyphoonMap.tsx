import AMapLoader from '@amap/amap-jsapi-loader';
import { Card, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const TyphoonMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 模拟台风数据
  const typhoonPath = [
    { position: [123.5, 23.2], time: '03-27 08:00', power: 12, pressure: 975 },
    { position: [122.8, 23.8], time: '03-27 14:00', power: 13, pressure: 965 },
    { position: [121.9, 24.5], time: '03-27 20:00', power: 14, pressure: 955 },
    { position: [121.2, 25.1], time: '03-28 02:00', power: 15, pressure: 945, isCurrent: true },
  ];

  const forecastPath = [
    { position: [120.5, 25.8], time: '03-28 08:00', power: 14 },
    { position: [119.8, 26.5], time: '03-28 14:00', power: 13 },
    { position: [119.2, 27.2], time: '03-28 20:00', power: 12 },
  ];

  useEffect(() => {
    // 设置 AMap 安全配置 - 必须在 load 之前调用
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '04764b88497672223a5980004128522e',
    };

    AMapLoader.load({
      key: '109677464197e889b9404c0e66d9294e',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar'],
    })
      .then((AMap) => {
        const mapInstance = new AMap.Map(mapRef.current, {
          viewMode: '3D',
          zoom: 7,
          center: [120.5, 25.5],
          mapStyle: 'amap://styles/darkblue', // 使用深色底图增强指挥感
        });

        // 1. 绘制历史路径
        const historyLine = new AMap.Polyline({
          path: typhoonPath.map(p => p.position),
          strokeColor: '#ef4444',
          strokeWeight: 4,
          strokeStyle: 'solid',
        });
        mapInstance.add(historyLine);

        // 2. 绘制预测路径
        const forecastLine = new AMap.Polyline({
          path: [typhoonPath[typhoonPath.length - 1].position, ...forecastPath.map(p => p.position)],
          strokeColor: '#9ca3af',
          strokeWeight: 4,
          strokeStyle: 'dashed',
        });
        mapInstance.add(forecastLine);

        // 3. 绘制台风中心点及风圈
        const currentPos = typhoonPath[typhoonPath.length - 1].position;
        
        // 7级风圈 (假设半径 300km)
        const circle7 = new AMap.Circle({
          center: currentPos,
          radius: 300000,
          fillColor: '#9ca3af',
          fillOpacity: 0.1,
          strokeColor: '#9ca3af',
          strokeWeight: 1,
        });
        // 10级风圈 (假设半径 150km)
        const circle10 = new AMap.Circle({
          center: currentPos,
          radius: 150000,
          fillColor: '#ff7a45',
          fillOpacity: 0.15,
          strokeColor: '#ff7a45',
          strokeWeight: 1,
        });
        // 12级风圈 (假设半径 80km)
        const circle12 = new AMap.Circle({
          center: currentPos,
          radius: 80000,
          fillColor: '#ef4444',
          fillOpacity: 0.2,
          strokeColor: '#ef4444',
          strokeWeight: 1,
        });
        mapInstance.add([circle7, circle10, circle12]);

        // 4. 添加台风图标
        const typhoonIcon = document.createElement('div');
        typhoonIcon.innerHTML = `
          <div style="width: 40px; height: 40px; animation: rotateTyphoon 2s linear infinite;">
            <svg viewBox="0 0 1024 1024" width="40" height="40">
              <path d="M512 512m-128 0a128 128 0 1 0 256 0 128 128 0 1 0-256 0Z" fill="#ef4444"></path>
              <path d="M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384z m0 640c-141.4 0-256-114.6-256-256s114.6-256 256-256 256 114.6 256 256-114.6 256-256 256z" fill="#ef4444" opacity="0.3"></path>
            </svg>
          </div>
          <style>
            @keyframes rotateTyphoon {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          </style>
        `;
        const marker = new AMap.Marker({
          position: currentPos,
          content: typhoonIcon,
          offset: new AMap.Pixel(-20, -20),
        });
        mapInstance.add(marker);

        setMap(mapInstance);
        setLoading(false);
      })
      .catch((e) => {
        console.error('地图加载失败', e);
        setLoading(false);
      });

    return () => {
      if (map) map.destroy();
    };
  }, []);

  return (
    <Card 
      className="fin-card" 
      variant="borderless" 
      styles={{ body: { padding: 0, height: '550px', position: 'relative' } }}
    >
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 10 
        }}>
          <Spin size="large" />
          <div style={{ marginLeft: '12px', color: '#1f2937' }}>加载地图指挥系统...</div>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </Card>
  );
};

export default TyphoonMap;
