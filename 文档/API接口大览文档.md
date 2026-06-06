# 📊 水产管理系统 API 接口大览

## 📋 文档概述

本文档汇总了水产管理系统前端项目的所有API接口，包括接口功能、请求参数、响应格式等详细信息。

## 🏗️ 接口架构概览

### 接口分类
- **生产管理** - 生产计划、生产任务、生产统计
- **塘口管理** - 塘口信息、塘口统计、塘口扩展
- **水质监测** - 水质数据、水质历史、水质报警
- **预警中心** - 预警规则、预警记录、预警统计
- **基础数据** - 基地信息、基础配置
- **气象数据** - 气象历史、实时气象、气象建议
- **日志管理** - 投喂日志、用药日志、生产日志
- **任务管理** - 任务统计、任务调度、时间轴

### 接口规范
- **请求方式**: RESTful API
- **数据格式**: JSON
- **认证方式**: Token认证
- **路径前缀**: `/api` (前端拦截器自动添加)

## 🔧 生产管理接口

### 1. 生产计划管理

#### 1.1 获取生产计划列表
- **接口**: `GET /production/plan/list`
- **描述**: 获取生产计划分页列表
- **请求参数**:
  ```typescript
  interface ProductionPlanParams extends PaginationParams {
    planType?: number;        // 计划类型
    status?: number;          // 状态
    approvalStatus?: number;  // 审批状态
    keyword?: string;         // 搜索关键词
    startTime?: string;       // 开始时间
    endTime?: string;         // 结束时间
  }
  ```
- **响应格式**: `PaginationResponse<ProductionPlan>`

#### 1.2 获取生产计划详情
- **接口**: `GET /production/plan/detail`
- **描述**: 获取单个生产计划详情
- **请求参数**: `id: string` (计划ID)
- **响应格式**: `BaseResponse<ProductionPlan>`

#### 1.3 创建生产计划
- **接口**: `POST /production/plan/create`
- **描述**: 创建新的生产计划
- **请求体**: `Omit<ProductionPlan, 'id' | 'createTime' | 'updateTime' | 'isDeleted'>`
- **响应格式**: `BaseResponse<string>` (返回计划ID)

#### 1.4 更新生产计划
- **接口**: `PUT /production/plan/update`
- **描述**: 更新生产计划信息
- **请求体**: `Partial<ProductionPlan> & { id: string }`
- **响应格式**: `BaseResponse<boolean>`

#### 1.5 删除生产计划
- **接口**: `DELETE /production/plan/delete`
- **描述**: 删除生产计划
- **请求参数**: `id: string` (计划ID)
- **响应格式**: `BaseResponse<boolean>`

#### 1.6 审批生产计划
- **接口**: `POST /production/plan/approve`
- **描述**: 审批生产计划
- **请求体**: `{ id: string; approvalStatus: number; approverId: string }`
- **响应格式**: `BaseResponse<boolean>`

### 2. 生产任务管理

#### 2.1 获取生产任务列表
- **接口**: `GET /production/task/list`
- **描述**: 获取生产任务分页列表
- **请求参数**: `ProductionTaskParams extends PaginationParams`
- **响应格式**: `PaginationResponse<ProductionTask>`

#### 2.2 执行生产任务
- **接口**: `POST /production/task/execute`
- **描述**: 执行生产任务
- **请求体**: `{ id: string; executorId: string; actualTime?: string }`
- **响应格式**: `BaseResponse<boolean>`

#### 2.3 批量创建生产任务
- **接口**: `POST /production/task/batch`
- **描述**: 批量创建生产任务
- **请求体**: `{
  planId: string;
  tasks: Array<Omit<ProductionTask, 'id' | 'createTime' | 'updateTime'>>;
}`
- **响应格式**: `BaseResponse<boolean>`

### 3. 生产统计

#### 3.1 获取生产统计
- **接口**: `GET /production/statistics`
- **描述**: 获取生产统计数据
- **请求参数**: `{ startTime?: string; endTime?: string; baseId?: string }`
- **响应格式**: `BaseResponse<any>`

## 🌊 塘口管理接口

### 1. 塘口基本信息

#### 1.1 获取塘口列表
- **接口**: `GET /pond/list`
- **描述**: 获取塘口分页列表
- **请求参数**: `PondInfoParams extends PaginationParams`
- **响应格式**: `PaginationResponse<PondInfo>`

#### 1.2 获取塘口详情
- **接口**: `GET /pond/detail`
- **描述**: 获取单个塘口详情
- **请求参数**: `id: string` (塘口ID)
- **响应格式**: `BaseResponse<PondInfo>`

#### 1.3 创建塘口
- **接口**: `POST /pond/create`
- **描述**: 创建新的塘口
- **请求体**: `Omit<PondInfo, 'id' | 'createTime' | 'updateTime' | 'isDeleted'>`
- **响应格式**: `BaseResponse<string>` (返回塘口ID)

#### 1.4 更新塘口
- **接口**: `PUT /pond/update`
- **描述**: 更新塘口信息
- **请求体**: `Partial<PondInfo> & { id: string }`
- **响应格式**: `BaseResponse<boolean>`

#### 1.5 删除塘口
- **接口**: `DELETE /pond/delete`
- **描述**: 删除塘口
- **请求参数**: `id: string` (塘口ID)
- **响应格式**: `BaseResponse<boolean>`

#### 1.6 启用/禁用塘口
- **接口**: `POST /pond/toggle`
- **描述**: 启用或禁用塘口
- **请求体**: `{ id: string; status: number }`
- **响应格式**: `BaseResponse<boolean>`

### 2. 塘口统计

#### 2.1 获取塘口统计
- **接口**: `GET /pond/statistics`
- **描述**: 获取塘口统计数据
- **请求参数**: `{ baseId?: string; pondType?: number }`
- **响应格式**: `BaseResponse<any>`

#### 2.2 获取塘口分布地图数据
- **接口**: `GET /pond/map`
- **描述**: 获取塘口分布地图数据
- **请求参数**: `{ baseId?: string }`
- **响应格式**: `BaseResponse<any>`

### 3. 塘口扩展信息

#### 3.1 获取塘口扩展信息
- **接口**: `GET /pond/ext`
- **描述**: 获取塘口扩展信息
- **请求参数**: `{ pondId: string }`
- **响应格式**: `BaseResponse<any>`

#### 3.2 更新塘口扩展信息
- **接口**: `PUT /pond/ext`
- **描述**: 更新塘口扩展信息
- **请求体**: `{ pondId: string; extData: any }`
- **响应格式**: `BaseResponse<boolean>`

## 💧 水质监测接口

### 1. 水质实时监测

#### 1.1 获取水质实时监测列表
- **接口**: `GET /water/quality/list`
- **描述**: 获取水质实时监测分页列表
- **请求参数**: `WaterQualityParams extends PaginationParams`
- **响应格式**: `PaginationResponse<WaterQuality>`

#### 1.2 获取水质监测详情
- **接口**: `GET /water/quality/detail`
- **描述**: 获取单个水质监测详情
- **请求参数**: `id: string` (监测记录ID)
- **响应格式**: `BaseResponse<WaterQuality>`

#### 1.3 创建水质监测记录
- **接口**: `POST /water/quality/create`
- **描述**: 创建新的水质监测记录
- **请求体**: `Omit<WaterQuality, 'id' | 'createTime' | 'updateTime'>`
- **响应格式**: `BaseResponse<string>` (返回记录ID)

#### 1.4 更新水质监测记录
- **接口**: `PUT /water/quality/update`
- **描述**: 更新水质监测记录
- **请求体**: `Partial<WaterQuality> & { id: string }`
- **响应格式**: `BaseResponse<boolean>`

#### 1.5 删除水质监测记录
- **接口**: `DELETE /water/quality/delete`
- **描述**: 删除水质监测记录
- **请求参数**: `id: string` (记录ID)
- **响应格式**: `BaseResponse<boolean>`

### 2. 水质历史数据

#### 2.1 获取水质历史数据
- **接口**: `GET /water/history`
- **描述**: 获取水质历史数据
- **请求参数**: `{
  pondId: string;
  startTime: string;
  endTime: string;
  dataType?: string; // 数据类型：ph,do,temperature等
}`
- **响应格式**: `BaseResponse<any>`

#### 2.2 批量导入水质数据
- **接口**: `POST /water/import`
- **描述**: 批量导入水质数据
- **请求体**: `{
  pondId: string;
  data: Array<Omit<WaterQuality, 'id' | 'createTime' | 'updateTime'>>;
}`
- **响应格式**: `BaseResponse<boolean>`

### 3. 水质统计

#### 3.1 获取水质统计
- **接口**: `GET /water/statistics`
- **描述**: 获取水质统计数据
- **请求参数**: `{ pondId?: string; startTime?: string; endTime?: string }`
- **响应格式**: `BaseResponse<any>`

#### 3.2 获取水质趋势分析
- **接口**: `GET /water/trend`
- **描述**: 获取水质趋势分析数据
- **请求参数**: `{ pondId: string; dataType: string; days: number }`
- **响应格式**: `BaseResponse<any>`

### 4. 水质报警

#### 4.1 获取水质报警列表
- **接口**: `GET /water/alarm`
- **描述**: 获取水质报警列表
- **请求参数**: `{ pondId?: string; alarmStatus?: string; startTime?: string; endTime?: string }`
- **响应格式**: `BaseResponse<any>`

#### 4.2 处理水质报警
- **接口**: `POST /water/alarm/handle`
- **描述**: 处理水质报警
- **请求体**: `{ id: string; handlerId: string; handleNotes: string }`
- **响应格式**: `BaseResponse<boolean>`

## ⚠️ 预警中心接口

### 1. 预警规则管理

#### 1.1 获取预警规则列表
- **接口**: `GET /warning/rule/list`
- **描述**: 获取预警规则分页列表
- **请求参数**: `WarningRuleParams extends PaginationParams`
- **响应格式**: `PaginationResponse<WarningRule>`

#### 1.2 获取预警规则详情
- **接口**: `GET /warning/rule/detail`
- **描述**: 获取单个预警规则详情
- **请求参数**: `id: string` (规则ID)
- **响应格式**: `BaseResponse<WarningRule>`

#### 1.3 创建预警规则
- **接口**: `POST /warning/rule/create`
- **描述**: 创建新的预警规则
- **请求体**: `Omit<WarningRule, 'id' | 'createTime' | 'updateTime' | 'isDeleted'> & {
  params?: Array<Omit<WarningRuleParam, 'id' | 'createTime'>>;
}`
- **响应格式**: `BaseResponse<string>` (返回规则ID)

#### 1.4 更新预警规则
- **接口**: `PUT /warning/rule/update`
- **描述**: 更新预警规则
- **请求体**: `Partial<WarningRule> & { id: string } & {
  params?: Array<Omit<WarningRuleParam, 'id' | 'createTime'>>;
}`
- **响应格式**: `BaseResponse<boolean>`

#### 1.5 删除预警规则
- **接口**: `DELETE /warning/rule/delete`
- **描述**: 删除预警规则
- **请求参数**: `id: string` (规则ID)
- **响应格式**: `BaseResponse<boolean>`

#### 1.6 启用/禁用预警规则
- **接口**: `POST /warning/rule/toggle`
- **描述**: 启用或禁用预警规则
- **请求体**: `{ id: string; enabled: number }`
- **响应格式**: `BaseResponse<boolean>`

### 2. 预警记录管理

#### 2.1 获取预警记录列表
- **接口**: `GET /warning/record/list`
- **描述**: 获取预警记录分页列表
- **请求参数**: `WarningRecordParams extends PaginationParams`
- **响应格式**: `PaginationResponse<WarningRecord>`

#### 2.2 处理预警记录
- **接口**: `POST /warning/record/handle`
- **描述**: 处理预警记录
- **请求体**: `{ id: string; handlerId: string; handleNotes: string }`
- **响应格式**: `BaseResponse<boolean>`

#### 2.3 批量处理预警记录
- **接口**: `POST /warning/record/batch-handle`
- **描述**: 批量处理预警记录
- **请求体**: `{ ids: string[]; handlerId: string; handleNotes: string }`
- **响应格式**: `BaseResponse<boolean>`

### 3. 预警统计

#### 3.1 获取预警统计
- **接口**: `GET /warning/statistics`
- **描述**: 获取预警统计数据
- **请求参数**: `{ startTime?: string; endTime?: string; warningType?: number }`
- **响应格式**: `BaseResponse<any>`

#### 3.2 获取实时预警
- **接口**: `GET /warning/realtime`
- **描述**: 获取实时预警数据
- **响应格式**: `BaseResponse<WarningRecord[]>`

## 🌤️ 气象数据接口

### 1. 历史气象记录
- **接口**: `GET /weather/history`
- **描述**: 获取历史气象记录
- **响应格式**: `BaseResponse<WeatherHistoryItem[]>`

### 2. 实时气象摘要
- **接口**: `GET /weather/summary`
- **描述**: 获取实时气象摘要
- **响应格式**: `BaseResponse<WeatherSummaryItem[]>`

### 3. 实时天气详情
- **接口**: `GET /weather/realtime`
- **描述**: 获取实时天气详情
- **响应格式**: `BaseResponse<any>`

### 4. 养殖建议
- **接口**: `GET /weather/advice`
- **描述**: 获取养殖建议
- **响应格式**: `BaseResponse<AquacultureAdviceItem>`

### 5. 灾害信息
- **接口**: `GET /weather/disaster`
- **描述**: 获取当前灾害信息
- **响应格式**: `BaseResponse<DisasterInfo>`

## 📝 日志管理接口

### 1. 投喂记录
- **接口**: `GET /logs/feeding`
- **描述**: 获取投喂记录
- **响应格式**: `BaseResponse<FeedingLogItem[]>`

### 2. 生产日志
- **接口**: `GET /production/logs`
- **描述**: 统一生产日志查询接口
- **请求参数**: `type: 'feeding' | 'medicine' | 'patrol'`
- **响应格式**: `BaseResponse<any[]>`

### 3. 用药记录
- **接口**: `GET /logs/medicine`
- **描述**: 获取用药记录
- **响应格式**: `BaseResponse<MedicineLogItem[]>`

## 📅 任务管理接口

### 1. 生产计划统计数据
- **接口**: `GET /tasks/stats`
- **描述**: 获取生产计划统计数据
- **响应格式**: `BaseResponse<PlanStatsProps>`

### 2. 日历视图任务
- **接口**: `GET /tasks/schedule`
- **描述**: 获取日历视图任务（按日期分组）
- **请求参数**: `{ start: string; end: string }`
- **响应格式**: `BaseResponse<Record<string, CalendarTask[]>>`

### 3. 某一天的任务列表
- **接口**: `GET /tasks/detail`
- **描述**: 获取某一天的任务列表
- **请求参数**: `date: string`
- **响应格式**: `BaseResponse<Record<string, TaskItem[]>>`

### 4. 塘口生产计划时间轴
- **接口**: `GET /tasks/pond`
- **描述**: 获取某个塘口生产计划时间轴
- **请求参数**: `pondId: string`
- **响应格式**: `BaseResponse<TimelineItem[]>`

## 🏢 基础数据接口

### 1. 基地列表
- **接口**: `GET /base/list`
- **描述**: 获取基地列表
- **响应格式**: `BaseResponse<any[]>`

## 📊 接口统计汇总

| 模块 | 接口数量 | 主要功能 |
|------|----------|----------|
| 生产管理 | 9个 | 生产计划、任务、统计 |
| 塘口管理 | 8个 | 塘口信息、统计、扩展 |
| 水质监测 | 11个 | 水质数据、历史、报警 |
| 预警中心 | 9个 | 预警规则、记录、统计 |
| 气象数据 | 5个 | 气象历史、实时、建议 |
| 日志管理 | 3个 | 投喂、用药、生产日志 |
| 任务管理 | 4个 | 任务统计、调度、时间轴 |
| 基础数据 | 1个 | 基地信息 |
| **总计** | **50个** | **完整业务覆盖** |

## 🔧 接口使用示例

### TypeScript 类型导入
```typescript
import type {
  ProductionPlanParams,
  ProductionPlanList,
  BaseResponse
} from '@/types';

import { getProductionPlanList } from '@/services/api/production';
```

### API 调用示例
```typescript
// 获取生产计划列表
const loadProductionPlans = async () => {
  const params: ProductionPlanParams = {
    current: 1,
    pageSize: 10,
    planType: 1,
    status: 1
  };
  
  try {
    const response = await getProductionPlanList(params);
    if (response.code === 200) {
      console.log('获取成功:', response.data);
    } else {
      console.error('业务错误:', response.message);
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
};
```

## 📋 接口规范说明

### 请求规范
- **HTTP方法**: GET、POST、PUT、DELETE
- **Content-Type**: application/json
- **认证**: Bearer Token
- **分页**: 统一使用current/pageSize参数

### 响应规范
- **成功响应**: code=200, message="成功"
- **错误响应**: code≠200, message="错误描述"
- **分页响应**: PaginationResponse<T>格式
- **单条数据**: BaseResponse<T>格式

### 错误码说明
- **200**: 成功
- **400**: 请求参数错误
- **401**: 未授权
- **403**: 权限不足
- **404**: 资源不存在
- **500**: 服务器内部错误

---

**文档版本**: v1.0  
**最后更新**: 2026-04-16  
**维护者**: 前端开发团队