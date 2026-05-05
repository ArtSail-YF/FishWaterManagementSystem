/**
 * 基地数据转换工具 (Adapter)
 * 职责：将后端 API 的原始数据 "翻译" 为前端组件所需的标准化模型
 */

import type { Base, BaseStatus } from '@/models/base';
import type { BaseWaterSummary } from '@/models/water';

/**
 * 【核心转换函数】
 * 输入：单个脏对象 (any)
 * 输出：干净的 Base 模型
 */
function adaptBaseItem(raw: any): Base {
  // 1. 处理坐标：增加兜底，防止 NaN 导致地图崩溃
  const lng = Number(raw.longitude);
  const lat = Number(raw.latitude);
  // 简单的有效性校验，如果是无效坐标，默认给到杭州（或者你项目的中心点）
  const isValid = !isNaN(lng) && !isNaN(lat);
  const location: [number, number] = isValid ? [lng, lat] : [120.15, 30.28];

  // 2. 处理状态：数字转字符串枚举
  let status: BaseStatus = 'todo';
  if (raw.status === 1) status = 'normal';
  else if (raw.status === 0) status = 'warning';

  // 3. 智能推断类型（基于真实字段）
  const isDeepSea = raw.deepSeaCertified === 1;
  // 【关键修复】使用可选链 (?.) 防止 waterSource 为空时报错
  const source = raw.waterSource || ''; 
  let baseType = '近海'; // 默认
  if (isDeepSea) {
    baseType = '深远海';
  } else if (source.includes('淡水') || source.includes('循环水')) {
    baseType = '陆基工厂化';
  }

  // 4. 组装最终对象
  return {
    id: String(raw.id),             // 统一转字符串，防止精度问题
    name: raw.baseName || '未命名', // 增加默认值
    location,                       // 组合字段
    status,                         // 枚举映射
    baseType,                       // 逻辑推断
    deepSeaCertified: isDeepSea ? 1 : 0,    // 统一格式
    taiwanCooperation: raw.taiwanCooperation === 1 ? 1 : 0,
    greenCertification: raw.greenCertification || '',
    // 水质数据直接透传
    waterQuality: {
      pH: raw.phValue || 0, // 增加兜底 0
      oxygen: 0, 
      temperature: 0,
      warningUnits: 0
    }
  };
}

/**
 * 批量转换入口
 */
export function transformBaseResponse(apiResponse: any): any {
  // 【关键修复】增加空值判断，防止 records 不存在时页面崩溃
  const list = apiResponse?.data?.records || [];
  
  if (!Array.isArray(list)) {
    console.error('[API Error] 返回的数据不是数组', apiResponse);
    return { ...apiResponse, data: { ...apiResponse.data, records: [] } };
  }

  const transformedRecords = list.map(adaptBaseItem);

  return {
    ...apiResponse,
    data: {
      ...apiResponse.data,
      records: transformedRecords,
    },
  };
}

// 导出单个转换函数供其他地方使用
export function convertApiDataToBase(item: any): Base {
  return adaptBaseItem(item);
}