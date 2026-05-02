# 暗色模式下地图显示问题修复


**“一键切换，全局生效，记忆偏好，兼容地图”**
用户点击一个按钮，整个网站（包括很难搞的地图）都要变色，而且刷新页面后不能恢复默认，必须记住用户的选择。



#### 1. 用户偏好管理流程（记忆逻辑）

**这是业务的基础，确保用户觉得“这软件懂我”。**

* **优先级策略** **：**

1. **用户手动设置 > 系统默认设置** **。**
2. **代码启动时，先查“小本本”（**`localStorage`）。如果有记录，听用户的；如果没有记录，听系统的（`matchMedia`）。

* **业务价值** **：提升用户体验，避免用户每次刷新都要重新设置。**

#### 2. 全局主题切换流程（通用逻辑）

**这是处理 90% 普通页面内容（文字、背景、导航栏）的业务。**

* **外包策略** **：直接雇佣专业外包团队** `darkreader`。
* **执行动作** **：**
* **开** **：调用** `auto()`，库自动分析页面 DOM，注入深色 CSS。
* **关** **：调用** `auto(false)`，移除注入的 CSS。
* **业务价值** **：低成本、高效率地解决大部分页面的深色适配，不用自己写 CSS。**

#### 3. 地图组件适配流程（特殊逻辑）

**这是处理那 10% “难搞”的第三方地图组件的业务。因为地图通常是 Canvas 绘制，**`darkreader` **搞不定，需要特殊业务逻辑。**

* **监控策略（轮询）** **：**
* **痛点** **：地图加载是异步的，不知道它什么时候画好。**
* **方案** **：派一个“保安”（**`setInterval`），每 0.5 秒看一眼地图容器（`.amap-container`）出来没。
* **执行动作** **：**
* **开** **：一旦地图出来，直接给地图容器套上“墨镜”（CSS** `filter: invert(...)`），强制反色。
* **关** **：摘掉“墨镜”（CSS** `filter: none`）。
* **止损** **：找到地图后，保安就可以下班了（清除定时器），节省资源。**
* **业务价值** **：解决核心业务组件（地图）在深色模式下的可用性问题，这是该业务的** **核心壁垒** **。**

#### 4. 交互与反馈流程（UI 逻辑）

**这是用户直接感知的部分。**

* **输入** **：用户点击 Ant Design 的** `Switch` **开关。**
* **反馈** **：**
* **视觉** **：图标变化（太阳/月亮）。**
* **提示** **：弹出** `message.success` **提示“深色模式已开启”。**
* **业务价值** **：提供即时的操作反馈，确认系统已响应。**





## 问题描述

1. **初始问题**：默认暗色模式下地图不显示为暗色，需要重新选择暗色模式
2. **后续问题**：会突然刷新好几次的亮暗色，导致用户体验不佳

## 问题原因分析

1. **地图加载时序问题**：当组件初始化时，地图可能还未加载完成，导致 `setTimeout` 无法找到地图容器，从而无法应用暗色滤镜
2. **重复主题切换**：代码中存在重复切换主题的逻辑，导致界面频繁在亮色和暗色之间切换
3. **重复滤镜应用**：对地图容器重复应用相同的滤镜，导致不必要的 DOM 操作

## 解决方案

### 1. 使用 MutationObserver 监听地图加载

- 当 DOM 中添加新节点时，检查是否包含地图容器
- 一旦发现地图容器，立即应用相应的滤镜
- 同时立即检查现有地图容器，确保即使地图已经加载完成，也能正确应用滤镜

### 2. 避免重复切换主题

- 添加 `currentTheme` 状态来跟踪当前主题状态
- 在 `applyTheme` 函数中检查当前主题是否与目标主题相同，避免重复切换

### 3. 避免重复应用滤镜

- 在 `applyFilter` 函数中检查当前滤镜是否与目标滤镜相同，避免重复应用

### 4. 优化观察器逻辑

- 只当地图容器发生变化时才重新应用滤镜
- 移除可能导致频繁检查的定时器
- 缩短观察器的运行时间，避免内存泄漏

## 代码修改

### 修改前

```typescript
const handleMapFilter = (isDark: boolean) => {
  // 使用 MutationObserver 监听地图加载，或者简单粗暴用 setTimeout
  // 这里为了简单，还是用 setTimeout，但建议配合 ID 使用
  setTimeout(() => {
    // 修改点：建议使用 ID 选择器，或者更通用的类名
    // 如果你能在地图组件上加 id="map-container"，这里就写 '#map-container'
    const mapContainers = document.querySelectorAll('.amap-container, #map-container'); 
  
    mapContainers.forEach((container) => {
      if (isDark) {
        // 关键微调：
        // invert(1) hue-rotate(180deg) 会把地图变暗，但也会把图标变回正常颜色（反反色）
        // 如果图标还是反的，尝试去掉 hue-rotate(180deg)
        (container as HTMLElement).style.filter = 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)';
      } else {
        (container as HTMLElement).style.filter = 'none';
      }
    });
  }, 100); // 延迟稍微加长一点，等地图渲染完
};
```

### 修改后

```typescript
// 跟踪当前主题状态，避免重复切换
const [currentTheme, setCurrentTheme] = useState<boolean | null>(null);

useEffect(() => {
  // 2. 初始化检查
  const savedDarkMode = localStorage.getItem('darkMode');
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const shouldBeDark = savedDarkMode === 'true' || (!savedDarkMode && systemDarkMode);
  
  setIsDarkMode(shouldBeDark);
  setCurrentTheme(shouldBeDark);
  applyTheme(shouldBeDark);
}, []);

const applyTheme = (checked: boolean) => {
  // 避免重复切换主题
  if (currentTheme === checked) {
    return;
  }
  
  setCurrentTheme(checked);
  
  if (checked) {
    enable({
      brightness: 100,
      contrast: 95, // 稍微调高一点，Antd 默认对比度较高
      sepia: 0,     // 去掉复古色调，保持现代感
    });
  
    // 3. 处理地图滤镜
    handleMapFilter(true);
  } else {
    disable();
    handleMapFilter(false);
  }
};

// 抽离地图处理逻辑，支持传入 DOM 元素或选择器
const handleMapFilter = (isDark: boolean) => {
  // 辅助函数：应用滤镜
  function applyFilter(container: Element) {
    const element = container as HTMLElement;
    const currentFilter = element.style.filter;
  
    // 避免重复应用相同的滤镜
    if (isDark && currentFilter === 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)') {
      return;
    }
    if (!isDark && currentFilter === 'none') {
      return;
    }
  
    if (isDark) {
      // 关键微调：
      // invert(1) hue-rotate(180deg) 会把地图变暗，但也会把图标变回正常颜色（反反色）
      // 如果图标还是反的，尝试去掉 hue-rotate(180deg)
      element.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)';
    } else {
      element.style.filter = 'none';
    }
  }

  // 立即检查并应用滤镜，确保页面刷新时能立即处理已存在的地图
  const checkAndApplyFilters = () => {
    const mapContainers = document.querySelectorAll('.amap-container, #map-container');
    mapContainers.forEach(applyFilter);
  };

  // 立即执行一次，处理已存在的地图
  checkAndApplyFilters();

  // 使用 MutationObserver 监听地图加载，确保地图容器出现时能及时应用滤镜
  const observer = new MutationObserver((mutations) => {
    // 标记是否有地图容器变化
    let hasMapContainerChange = false;
  
    mutations.forEach((mutation) => {
      // 检查添加的节点
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          // 检查当前元素是否为地图容器
          if (element.classList.contains('amap-container') || element.id === 'map-container') {
            hasMapContainerChange = true;
          }
          // 检查子元素
          if (element.querySelectorAll('.amap-container, #map-container').length > 0) {
            hasMapContainerChange = true;
          }
        }
      });
    
      // 检查修改的节点，以防地图容器属性变化
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          // 检查是否移除了地图容器的父元素
          if (element.querySelector('.amap-container, #map-container')) {
            hasMapContainerChange = true;
          }
        }
      });
    });
  
    // 只有当地图容器发生变化时才重新应用滤镜
    if (hasMapContainerChange) {
      checkAndApplyFilters();
    }
  });

  // 开始观察文档主体的子节点变化
  observer.observe(document.body, { 
    childList: true, 
    subtree: true
  });

  // 3秒后断开观察器，避免内存泄漏
  setTimeout(() => {
    observer.disconnect();
  }, 3000);
};
```

## 验证结果

- 服务器已成功启动，预览已打开
- TypeScript 类型检查通过，没有发现错误
- 暗色模式下地图会自动应用暗色滤镜，与整体主题保持一致
- 不会出现频繁切换亮暗色的问题

## 总结

通过使用 MutationObserver 监听地图加载，避免重复切换主题和应用滤镜，我们成功解决了暗色模式下地图显示的问题。现在，当默认设置为暗色模式时，地图会自动应用暗色滤镜，与整体主题保持一致，并且不会出现频繁切换亮暗色的问题，提升了用户体验。



```js
import React, { useState, useEffect } from 'react';
import { Switch, Tooltip, message } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. 【记状态】页面刚打开时，先看看用户之前选没选暗黑模式
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    // 如果有记录就用记录，没有就看系统是不是暗色
    const shouldBeDark = saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
    setIsDarkMode(shouldBeDark);
    applyTheme(shouldBeDark); // 初始化时也要处理地图
  }, []);

  // 2. 【总开关】负责调用 DarkReader 和 地图处理
  const applyTheme = (checked: boolean) => {
    if (checked) {
      // --- 开启暗黑模式 ---
      // 这里你原本用了 DarkReader，其实可以不用，直接用 CSS 滤镜也能搞定全局
      // 如果保留 DarkReader，记得配置 ignore 忽略地图，防止冲突
      enable({ brightness: 100, contrast: 95, sepia: 0 }); 
    
      handleMapFilter(true); // 单独处理地图
    } else {
      // --- 关闭暗黑模式 ---
      disable();
      handleMapFilter(false);
    }
  };

  // 3. 【等地图 & 涂滤镜】这是最核心的部分
  const handleMapFilter = (isDark: boolean) => {
    // 定义一个函数：专门负责给地图“穿衣服”
    const applyFilter = () => {
      // 找地图的壳子（高德地图的标准类名）
      const mapContainers = document.querySelectorAll('.amap-container');
    
      if (mapContainers.length > 0) {
        mapContainers.forEach((container) => {
          // 如果是暗黑模式，加上 CSS 滤镜
          if (isDark) {
            container.setAttribute('style', 'filter: invert(1) hue-rotate(180deg) brightness(0.9) !important;');
          } else {
            // 否则去掉滤镜
            container.setAttribute('style', 'filter: none !important;');
          }
        });
        return true; // 找到了，任务完成
      }
      return false; // 没找到地图
    };

    // 第一步：先试着找一下（万一地图已经加载好了呢）
    const found = applyFilter();

    // 第二步：如果没找到（说明地图还在加载中），启动“保安”监听
    if (isDark && !found) {
      const observer = new MutationObserver((mutations, obs) => {
        const success = applyFilter();
        if (success) {
          obs.disconnect(); // 找到并涂好后，保安就可以下班了（断开监听，省性能）
        }
      });

      // 保安盯着整个页面，一旦有东西加进来就检查是不是地图
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('darkMode', checked.toString()); // 记小本本
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
```
