// 导入高德地图加载器
import AMapLoader from '@amap/amap-jsapi-loader';
// 导入 Ant Design 组件
import { Card, Spin, Radio, RadioChangeEvent, Checkbox, CheckboxChangeEvent } from 'antd';
// 导入 React 及相关钩子
import React, { useEffect, useRef, useState } from 'react';

// 全局类型声明，扩展 Window 接口以支持高德地图相关属性
declare global {
  interface Window {
    AMap: any; // 高德地图主对象
    _AMapSecurityConfig: any; // 高德地图安全配置
  }
}

// 组件属性接口定义
interface GisMapProps {
  bases: Pond.BaseItem[]; // 基地数据数组
  selectedBase?: Pond.BaseItem; // 选中的基地（可选）
  onMarkerClick: (base: Pond.BaseItem) => void; // 标记点点击回调函数
}

// GisMap 组件定义，使用 React.FC 类型并接收 GisMapProps 属性
const GisMap: React.FC<GisMapProps> = ({ bases, selectedBase, onMarkerClick }) => {
  // 地图容器引用，用于挂载地图
  const mapRef = useRef<HTMLDivElement>(null);
  // 地图实例状态
  const [map, setMap] = useState<any>(null);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 标记点引用，用于管理地图上的标记点
  const markersRef = useRef<{ [key: string]: any }>({});
  // 底图类型
  const [mapType, setMapType] = useState<string>('standard');
  // 图层控制
  const [layers, setLayers] = useState({
    base: true,
    pond: true,
    device: true,
    channel: true,
  });
  // 暗黑模式状态
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  // 卫星图层引用
  const satelliteLayerRef = useRef<any>(null);
  // 地形图层引用
  const terrainLayerRef = useRef<any>(null);

  // 监听暗黑模式变化的 useEffect
  useEffect(() => {
    // 检查本地存储的暗黑模式状态
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem('darkMode');
      const isDark = savedDarkMode === 'true';
      setIsDarkMode(isDark);
    };

    // 初始检查
    checkDarkMode();

    // 监听存储变化，以便在其他组件修改暗黑模式时同步
    window.addEventListener('storage', checkDarkMode);

    // 清理函数
    return () => {
      window.removeEventListener('storage', checkDarkMode);
    };
  }, []);

  // 地图初始化和样式更新 useEffect
  useEffect(() => {
    // 解决 AMap 2.0 INVALID_USER_KEY 错误，设置安全密钥
    // 注意：正式环境建议通过环境变量注入
    window._AMapSecurityConfig = {
        securityJsCode: 'c45605948a17f054b3a28823baa42cf5', // 安全密钥
      };

    // 加载高德地图
    AMapLoader.load({
      key: 'dc6e158e590e6dd03f973bb0eafba585', // 高德地图 API 密钥
      version: '2.0', // 地图版本
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.InfoWindow', 'AMap.Marker', 'AMap.MapType', 'AMap.TileLayer'], // 所需插件
    })
      .then((AMap) => {
        // 创建地图实例
        const mapInstance = new AMap.Map(mapRef.current, {
          viewMode: '3D', // 3D 视图模式
          zoom: 11, // 初始缩放级别
          center: [120.153576, 30.287459], // 默认中心点（杭州）
          mapStyle: isDarkMode ? 'amap://styles/darkblue' : 'amap://styles/normal', // 根据暗黑模式状态选择样式
        });

        // 添加比例尺控件
        mapInstance.addControl(new AMap.Scale());
        // 添加工具栏控件
        mapInstance.addControl(new AMap.ToolBar());

        // 设置地图实例到状态
        setMap(mapInstance);
        // 设置加载状态为 false
        setLoading(false);
      })
      .catch((e) => {
        // 捕获地图加载错误
        console.error('地图加载失败', e);
        // 即使失败也要设置加载状态为 false
        setLoading(false);
      });

    // 清理函数，在组件卸载时销毁地图实例
    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []); // 只在组件挂载时初始化一次

  // 当地图实例和暗黑模式状态变化时更新地图样式
  useEffect(() => {
    if (map) {
      // 直接更新地图样式，而不是重新初始化地图
      map.setMapStyle(isDarkMode ? 'amap://styles/darkblue' : 'amap://styles/normal');
    }
  }, [map, isDarkMode]); // 依赖地图实例和暗黑模式状态

  // 处理底图切换
  const handleMapTypeChange = (e: RadioChangeEvent) => {
    const type = e.target.value;
    setMapType(type);
    
    if (!map || !window.AMap) return;

    // 移除所有自定义图层
    if (satelliteLayerRef.current) {
      map.remove(satelliteLayerRef.current);
      satelliteLayerRef.current = null;
    }
    if (terrainLayerRef.current) {
      map.remove(terrainLayerRef.current);
      terrainLayerRef.current = null;
    }

    // 重置为默认图层
    map.setLayers([]);

    switch (type) {
      case 'standard':
        // 标准地图 - 添加默认图层
        map.add(new window.AMap.TileLayer());
        break;
      case 'satellite':
        // 卫星地图 - 添加卫星图层
        satelliteLayerRef.current = new window.AMap.TileLayer.Satellite();
        map.add(satelliteLayerRef.current);
        break;
      case 'terrain':
        // 地形地图 - 添加地形图层
        terrainLayerRef.current = new window.AMap.TileLayer.Terrain();
        map.add(terrainLayerRef.current);
        break;
      default:
        map.add(new window.AMap.TileLayer());
    }
  };

  // 处理图层控制
  const handleLayerChange = (key: keyof typeof layers, checked: boolean) => {
    const newLayers = {
      ...layers,
      [key]: checked,
    };
    setLayers(newLayers);
    
    // 控制基地标记的显示/隐藏
    if (key === 'base') {
      Object.values(markersRef.current).forEach((marker) => {
        if (checked) {
          marker.show();
        } else {
          marker.hide();
        }
      });
    }
    
    // TODO: 控制塘口、设备、航道图层的显示/隐藏
    // 这些需要根据实际数据实现
  };

  // 处理标记点渲染的 useEffect
  useEffect(() => {
    // 地图未加载完成时直接返回
    if (!map) return;

    // 清除旧标记点
    Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
    markersRef.current = {};

    // 遍历基地数据，为每个基地创建标记点
    bases.forEach((base) => {
      // 数据校验，避免 NaN 错误
      if (!base.location || isNaN(base.location[0]) || isNaN(base.location[1])) {
        console.warn(`基地 ${base.name} 的坐标无效:`, base.location);
        return;
      }

      // 根据基地状态设置标记点颜色
      const color = base.status === 'warning' ? '#ff4d4f' : base.status === 'todo' ? '#1890ff' : '#52c41a';
      // 创建 DOM 元素作为标记点内容，避免 AMap 2.0 的 string content 兼容性问题
      const div = document.createElement('div');
      // 设置标记点样式
      div.style.backgroundColor = color;
      div.style.width = '26px';
      div.style.height = '26px';
      div.style.borderRadius = '50% 50% 50% 0';
      div.style.transform = 'rotate(-45deg)';
      div.style.border = '2px solid #fff';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // 创建标记点
      const marker = new window.AMap.Marker({
        position: base.location, // 标记点位置
        title: base.name, // 鼠标悬停时显示的标题
        offset: new window.AMap.Pixel(-13, -30), // 标记点偏移量
        content: div, // 标记点内容（自定义 DOM 元素）
      });

      // 为标记点添加点击事件
      marker.on('click', () => {
        // 调用父组件传递的回调函数
        onMarkerClick(base);
        // 打开信息窗口
        openInfoWindow(base, marker);
      });

      // 将标记点添加到地图
      marker.setMap(map);
      // 根据图层状态设置显示/隐藏
      if (!layers.base) {
        marker.hide();
      }
      // 将标记点存储到引用中，以便后续操作
      markersRef.current[base.id] = marker;
    });

    // 如果有基地数据，调整地图视图以适应所有标记点
    if (bases.length > 0) {
      map.setFitView();
    }
  }, [map, bases]); // 依赖地图实例和基地数据，当它们变化时重新渲染标记点

  // 处理选中基地联动的 useEffect
  useEffect(() => {
    // 当地图、选中基地和对应的标记点都存在时
    if (map && selectedBase && markersRef.current[selectedBase.id]) {
      const marker = markersRef.current[selectedBase.id];
      // 再次校验坐标
      if (selectedBase.location && !isNaN(selectedBase.location[0]) && !isNaN(selectedBase.location[1])) {
        // 将地图中心设置为选中基地的位置
        map.setCenter(selectedBase.location);
        // 放大地图
        map.setZoom(15);
        // 打开选中基地的信息窗口
        openInfoWindow(selectedBase, marker);
      }
    }
  }, [selectedBase, map]); // 依赖选中基地和地图实例，当它们变化时执行

  // 打开信息窗口函数
  const openInfoWindow = (base: Pond.BaseItem, marker: any) => {
    // 地图未加载完成时直接返回
    if (!map) return;

    // 创建信息窗口
    const infoWindow = new window.AMap.InfoWindow({
      // 信息窗口内容，使用 HTML 字符串
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
      // 信息窗口偏移量
      offset: new window.AMap.Pixel(0, -30),
    });

    // 在地图上打开信息窗口，位置为基地坐标
    infoWindow.open(map, base.location);
  };

  // 组件渲染
  return (
    // 使用 Ant Design 的 Card 组件作为容器
    <Card styles={{ body: { padding: 0 } }} style={{ height: 'calc(100vh - 250px)', position: 'relative' }}>
      {/* 底图切换和图层控制 */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: 'white', padding: 12, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        {/* 底图切换 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>底图切换</div>
          <Radio.Group value={mapType} onChange={handleMapTypeChange} buttonStyle="solid">
            <Radio.Button value="standard">标准</Radio.Button>
            <Radio.Button value="satellite">卫星</Radio.Button>
          </Radio.Group>
        </div>
        
        {/* 图层控制 */}
        <div>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>图层控制</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Checkbox checked={layers.base} onChange={(e: CheckboxChangeEvent) => handleLayerChange('base', e.target.checked)}>
              基地
            </Checkbox>
            <Checkbox checked={layers.pond} onChange={(e: CheckboxChangeEvent) => handleLayerChange('pond', e.target.checked)}>
              塘口
            </Checkbox>
            <Checkbox checked={layers.device} onChange={(e: CheckboxChangeEvent) => handleLayerChange('device', e.target.checked)}>
              设备
            </Checkbox>
            <Checkbox checked={layers.channel} onChange={(e: CheckboxChangeEvent) => handleLayerChange('channel', e.target.checked)}>
              航道
            </Checkbox>
          </div>
        </div>
      </div>
      
      {/* 加载状态显示 */}
      <Spin spinning={loading} tip="地图加载中..." size="large">
        {/* 地图容器，使用 ref 引用 */}
        <div ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 250px)' }} />
      </Spin>
    </Card>
  );
};

// 导出组件
export default GisMap;