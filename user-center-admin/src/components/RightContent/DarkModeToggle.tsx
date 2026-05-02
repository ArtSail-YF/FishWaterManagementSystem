import React, { useState, useEffect, useRef } from 'react';
import { Switch, Tooltip, message } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { auto, disable, setFetchMethod } from 'darkreader';

// 1. 全局配置
setFetchMethod(window.fetch);

// 地图选择器
const MAP_SELECTORS = ['.amap-container', '#map-container', '.mapboxgl-map'];

export const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const pollRef = useRef<number | null>(null);

  // 2. 核心逻辑：应用地图滤镜
  const applyMapFilter = (isDark: boolean) => {
    // 清理之前的轮询
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }

    const runFilter = () => {
      const containers = document.querySelectorAll(MAP_SELECTORS.join(','));
      if (containers.length > 0) {
        containers.forEach((container) => {
          const el = container as HTMLElement;
          // 强制加上 !important
          el.style.setProperty('filter', isDark ? 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)' : 'none', 'important');
          
          // 处理地图控件
          const controls = el.querySelectorAll('.amap-control, .mapboxgl-ctrl');
          controls.forEach(ctrl => {
             (ctrl as HTMLElement).style.setProperty('filter', isDark ? 'invert(1) hue-rotate(180deg)' : 'none', 'important');
          });
        });
        // 找到元素后停止轮询
        if (pollRef.current) {
            window.clearInterval(pollRef.current);
            pollRef.current = null;
        }
        return true; // 成功找到元素
      }
      return false; // 未找到元素
    };

    // 立即尝试应用滤镜
    const foundElements = runFilter();

    // 如果一开始没找到（地图还没加载完），开始轮询
    if (!foundElements) {
      let count = 0;
      const maxAttempts = 20; // 最大重试次数
      
      pollRef.current = window.setInterval(() => {
        count++;
        const success = runFilter();
        
        // 成功找到元素或达到最大重试次数后停止轮询
        if (success || count >= maxAttempts) {
          if (pollRef.current) {
            window.clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      }, 500);
    }
  };

  // 3. 初始化与副作用
  useEffect(() => {
    // --- 核心修复逻辑：暴力重启 ---
    const savedMode = localStorage.getItem('darkMode');
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode !== null ? savedMode === 'true' : systemMode;

    // 1. 先设置状态
    setIsDarkMode(initialMode);

    // 2. 暴力重置 darkreader：先关，等 100ms，再开
    // 这一步是为了欺骗 darkreader，让它以为主题变了，强制重新扫描 DOM
    disable();

    setTimeout(() => {
      if (initialMode) {
        auto({ brightness: 85, contrast: 105, sepia: 0 });
        applyMapFilter(true);
      } else {
        applyMapFilter(false);
      }
    }, 100); // 100ms 的延迟是关键

    // --- 监听逻辑保持不变 ---
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
        if (localStorage.getItem('darkMode') === null) {
            setIsDarkMode(e.matches);
            if (e.matches) {
                auto({ brightness: 100, contrast: 95, sepia: 0 });
                applyMapFilter(true);
            } else {
                disable();
                applyMapFilter(false);
            }
        }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (pollRef.current) window.clearInterval(pollRef.current);
      // 注意：这里不要 disable()，否则切走的时候页面会闪白
    };
  }, []); // 依赖数组为空，确保只在挂载时执行一次

  // 4. 切换处理
  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('darkMode', checked.toString());

    if (checked) {
      auto({ brightness: 100, contrast: 95, sepia: 0 });
      applyMapFilter(true);
      message.success('深色模式已开启');
    } else {
      disable();
      applyMapFilter(false);
      message.success('浅色模式已开启');
    }
  };

  return (
    <Tooltip title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        style={{ margin: '0 8px' }}
      />
    </Tooltip>
  );
};