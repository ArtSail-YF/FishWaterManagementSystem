import React, { useState, useEffect } from 'react';
import { Switch, Tooltip, message } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { enable, disable, setFetchMethod } from 'darkreader';

// 1. 全局配置：在组件外执行，确保最先加载
// 解决跨域问题，使用原生 fetch
setFetchMethod(window.fetch);

export const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // 2. 初始化检查
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedDarkMode === 'true' || (!savedDarkMode && systemDarkMode);
    
    setIsDarkMode(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (checked: boolean) => {
    if (checked) {
      // 先关闭再开启，防止重复叠加
      disable(); 
      enable({
        brightness: 100,
        contrast: 80, // 稍微调高一点，Antd 默认对比度较高
        sepia: 0,     // 去掉复古色调，保持现代感
      });
 
    } else {
      disable();
    }
  };


  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('darkMode', checked.toString());
    applyTheme(checked);
    
    message.success(checked ? '深色模式已开启' : '浅色模式已开启');
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