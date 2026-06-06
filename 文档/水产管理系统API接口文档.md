# 水产管理系统API接口文档

## 概述

本文档基于PC端需求文档和前端页面分析，定义了水产管理系统所需的后端API接口。系统采用RESTful API设计风格，使用JSON格式进行数据交换。

## 基础信息

- **基础URL**: `/api`
- **响应格式**: 统一使用`BaseResponse<T>`格式
- **认证方式**: JWT Token（Bearer Token）
- **编码**: UTF-8

## 通用响应结构

```typescript
interface BaseResponse<T> {
  code: number;       // 状态码：200-成功，其他-失败
  message: string;    // 描述信息
  data: T;           // 业务数据
  description?: string; // 可选描述
}
```

## 用户管理模块

### 1. 用户登录
- **接口**: `POST /api/user/login`
- **描述**: 用户登录系统
- **请求参数**:
```typescript
interface LoginParams {
  userAccount: string;    // 用户账号
  userPassword: string;   // 用户密码
  autoLogin?: boolean;    // 是否自动登录
  type?: string;         // 登录类型
}
```
- **响应数据**:
```typescript
interface LoginData {
  token: string;         // JWT Token
  user: CurrentUser;     // 用户信息
  currentAuthority?: string; // 权限
}
```

### 2. 用户注册
- **接口**: `POST /api/user/register`
- **描述**: 用户注册账号
- **请求参数**:
```typescript
interface RegisterParams extends LoginParams {
  checkPassword: string; // 确认密码
}
```
- **响应数据**:
```typescript
interface RegisterData {
  id: number;           // 用户ID
  status?: string;      // 状态
}
```

### 3. 获取当前用户信息
- **接口**: `GET /api/user/current`
- **描述**: 获取当前登录用户信息
- **认证**: 需要Token
- **响应数据**: `CurrentUser`

### 4. 更新用户信息
- **接口**: `PUT /api/user/update`
- **描述**: 更新用户信息
- **认证**: 需要Token
- **请求参数**: `CurrentUser`（部分字段）
- **响应数据**: `CurrentUser`

## 基地管理模块

### 1. 获取基地列表
- **接口**: `GET /api/base/list`
- **描述**: 获取所有养殖基地信息
- **认证**: 需要Token
- **查询参数**:
```typescript
interface BaseListParams {
  page?: number;        // 页码
  size?: number;        // 每页大小
  status?: 'normal' | 'warning' | 'todo'; // 状态过滤
  keyword?: string;     // 搜索关键词
}
```
- **响应数据**:
```typescript
interface BaseListResponse {
  list: BaseItem[];     // 基地列表
  total: number;        // 总数
  page: number;         // 当前页
  size: number;         // 每页大小
}
```

### 2. 获取基地详情
- **接口**: `GET /api/base/{id}`
- **描述**: 获取指定基地的详细信息
- **认证**: 需要Token
- **响应数据**: `BaseItem`

### 3. 创建/更新基地
- **接口**: `POST /api/base/save`
- **描述**: 创建或更新基地信息
- **认证**: 需要Token
- **请求参数**: `BaseItem`
- **响应数据**: `BaseItem`

### 4. 删除基地
- **接口**: `DELETE /api/base/{id}`
- **描述**: 删除指定基地
- **认证**: 需要Token
- **响应数据**: 操作结果

## 生产管理模块

### 1. 投入记录管理

#### 1.1 获取投入记录列表
- **接口**: `GET /api/input/records`
- **描述**: 获取投入记录列表（支持分页、筛选）
- **认证**: 需要Token
- **查询参数**:
```typescript
interface InputRecordParams {
  page?: number;        // 页码
  size?: number;        // 每页大小
  type?: 'in' | 'out';  // 类型：入库/出库
  category?: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other'; // 分类
  status?: 'pending' | 'approved' | 'rejected'; // 审核状态
  startDate?: string;   // 开始日期
  endDate?: string;     // 结束日期
  keyword?: string;     // 搜索关键词
}
```
- **响应数据**:
```typescript
interface InputRecordListResponse {
  list: InputRecordItem[]; // 记录列表
  total: number;           // 总数
  page: number;            // 当前页
  size: number;            // 每页大小
}
```

#### 1.2 创建投入记录
- **接口**: `POST /api/input/record`
- **描述**: 创建新的投入记录
- **认证**: 需要Token
- **请求参数**: `InputRecordItem`
- **响应数据**: `InputRecordItem`

#### 1.3 更新投入记录
- **接口**: `PUT /api/input/record/{id}`
- **描述**: 更新投入记录
- **认证**: 需要Token
- **请求参数**: `InputRecordItem`
- **响应数据**: `InputRecordItem`

#### 1.4 删除投入记录
- **接口**: `DELETE /api/input/record/{id}`
- **描述**: 删除投入记录
- **认证**: 需要Token
- **响应数据**: 操作结果

#### 1.5 批量审核投入记录
- **接口**: `POST /api/input/records/batch-approve`
- **描述**: 批量审核投入记录
- **认证**: 需要Token
- **请求参数**:
```typescript
interface BatchApproveParams {
  ids: string[];        // 记录ID数组
  status: 'approved' | 'rejected'; // 审核状态
  remark?: string;      // 审核备注
}
```
- **响应数据**: 操作结果

### 2. 库存管理

#### 2.1 获取库存统计
- **接口**: `GET /api/inventory/stats`
- **描述**: 获取各类物资的库存统计
- **认证**: 需要Token
- **响应数据**:
```typescript
interface InventoryStats {
  feed: {               // 饲料库存
    total: number;      // 总量
    unit: string;       // 单位
    value: number;      // 价值
  };
  medicine: {           // 药品库存
    total: number;
    unit: string;
    value: number;
  };
  equipment: {          // 设备库存
    total: number;
    unit: string;
    value: number;
  };
  seed: {               // 苗种库存
    total: number;
    unit: string;
    value: number;
  };
}
```

#### 2.2 获取库存预警
- **接口**: `GET /api/inventory/warnings`
- **描述**: 获取库存预警信息
- **认证**: 需要Token
- **响应数据**:
```typescript
interface InventoryWarning {
  id: string;           // 物资ID
  name: string;         // 物资名称
  category: string;     // 分类
  currentStock: number; // 当前库存
  minStock: number;     // 最低库存
  unit: string;         // 单位
  daysLeft: number;     // 预计可用天数
}
```

### 3. 塘口管理

#### 3.1 获取塘口列表
- **接口**: `GET /api/pond/list`
- **描述**: 获取所有塘口信息
- **认证**: 需要Token
- **查询参数**:
```typescript
interface PondListParams {
  page?: number;        // 页码
  size?: number;        // 每页大小
  status?: 'active' | 'inactive'; // 状态
  baseId?: string;      // 基地ID
  keyword?: string;     // 搜索关键词
}
```
- **响应数据**:
```typescript
interface PondListResponse {
  list: PondManagementItem[]; // 塘口列表
  total: number;              // 总数
  page: number;               // 当前页
  size: number;               // 每页大小
}
```

#### 3.2 获取塘口详情
- **接口**: `GET /api/pond/{id}`
- **描述**: 获取指定塘口的详细信息
- **认证**: 需要Token
- **响应数据**: `PondManagementItem`

## 经营分析模块

### 1. 获取经营统计数据
- **接口**: `GET /api/business/stats`
- **描述**: 获取经营KPI统计数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface BusinessStatsParams {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'; // 统计周期
  date?: string;        // 指定日期
}
```
- **响应数据**:
```typescript
interface BusinessStats {
  revenue: {            // 收入
    value: number;      // 数值
    percent: number;    // 增长率
    isUp: boolean;      // 是否增长
    target: number;     // 目标值
  };
  cost: {               // 成本
    value: number;
    percent: number;
    isUp: boolean;
    target: number;
  };
  profit: {             // 利润
    value: number;
    percent: number;
    isUp: boolean;
    target: number;
  };
  roi: {                // 投资回报率
    value: number;
    percent: number;
    isUp: boolean;
    target: number;
  };
}
```

### 2. 获取利润趋势
- **接口**: `GET /api/business/profit-trend`
- **描述**: 获取利润趋势数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface ProfitTrendParams {
  type: 'month' | 'quarter' | 'year'; // 趋势类型
  startDate: string;   // 开始日期
  endDate: string;     // 结束日期
}
```
- **响应数据**:
```typescript
interface ProfitTrendData {
  dates: string[];     // 日期数组
  profits: number[];   // 利润数组
  costs: number[];     // 成本数组
  revenues: number[];  // 收入数组
}
```

### 3. 获取基地排名
- **接口**: `GET /api/business/base-ranking`
- **描述**: 获取基地利润排名
- **认证**: 需要Token
- **查询参数**:
```typescript
interface BaseRankingParams {
  period: 'month' | 'quarter' | 'year'; // 统计周期
  date?: string;        // 指定日期
  limit?: number;       // 返回数量
}
```
- **响应数据**:
```typescript
interface BaseRankingItem {
  rank: number;         // 排名
  baseId: string;       // 基地ID
  baseName: string;     // 基地名称
  profit: number;       // 利润
  revenue: number;      // 收入
  cost: number;         // 成本
  roi: number;          // 投资回报率
}
```

### 4. 获取成本/收入分类分布
- **接口**: `GET /api/business/category-distribution`
- **描述**: 获取成本或收入的分类分布
- **认证**: 需要Token
- **查询参数**:
```typescript
interface CategoryDistributionParams {
  type: 'cost' | 'income'; // 类型：成本/收入
  period: 'month' | 'quarter' | 'year'; // 统计周期
  date?: string;        // 指定日期
}
```
- **响应数据**:
```typescript
interface CategoryDistribution {
  categories: string[]; // 分类名称
  values: number[];     // 数值
  percentages: number[]; // 百分比
  total: number;        // 总计
}
```

## 预警中心模块

### 1. 获取综合预警列表
- **接口**: `GET /api/warning/comprehensive`
- **描述**: 获取综合预警信息
- **认证**: 需要Token
- **查询参数**:
```typescript
interface WarningParams {
  page?: number;        // 页码
  size?: number;        // 每页大小
  level?: 'low' | 'medium' | 'high' | 'critical'; // 预警级别
  type?: 'water' | 'drug' | 'feeding' | 'weather' | 'other'; // 预警类型
  status?: 'unread' | 'read' | 'handled'; // 处理状态
}
```
- **响应数据**:
```typescript
interface WarningListResponse {
  list: WarningItem[];  // 预警列表
  total: number;        // 总数
  page: number;         // 当前页
  size: number;         // 每页大小
}
```

### 2. 获取预警记录
- **接口**: `GET /api/warning/records`
- **描述**: 获取历史预警记录
- **认证**: 需要Token
- **查询参数**: `WarningParams`
- **响应数据**: `WarningListResponse`

### 3. 更新预警状态
- **接口**: `PUT /api/warning/{id}/status`
- **描述**: 更新预警处理状态
- **认证**: 需要Token
- **请求参数**:
```typescript
interface UpdateWarningStatus {
  status: 'read' | 'handled'; // 新状态
  remark?: string;      // 处理备注
}
```
- **响应数据**: 操作结果

## 气象监测模块

### 1. 获取实时气象数据
- **接口**: `GET /api/weather/realtime`
- **描述**: 获取实时气象数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface RealtimeWeatherParams {
  location?: string;    // 位置（经纬度或地名）
  baseId?: string;      // 基地ID
}
```
- **响应数据**:
```typescript
interface RealtimeWeather {
  temperature: number;  // 温度（℃）
  humidity: number;     // 湿度（%）
  windSpeed: number;    // 风速（m/s）
  windDirection: string; // 风向
  precipitation: number; // 降水量（mm）
  pressure: number;     // 气压（hPa）
  visibility: number;   // 能见度（km）
  condition: string;    // 天气状况
  feelsLike: number;    // 体感温度
  uvIndex: number;      // UV指数
  updateTime: string;   // 更新时间
}
```

### 2. 获取天气预报
- **接口**: `GET /api/weather/forecast`
- **描述**: 获取天气预报
- **认证**: 需要Token
- **查询参数**: `RealtimeWeatherParams`
- **响应数据**:
```typescript
interface WeatherForecast {
  location: string;     // 位置
  forecasts: ForecastItem[]; // 预报列表
}
interface ForecastItem {
  date: string;         // 日期
  day: string;          // 星期
  highTemp: number;     // 最高温度
  lowTemp: number;      // 最低温度
  condition: string;    // 天气状况
  precipitation: number; // 降水量
  windSpeed: number;    // 风速
  windDirection: string; // 风向
}
```

### 3. 获取潮汐数据
- **接口**: `GET /api/weather/tide`
- **描述**: 获取潮汐数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface TideParams {
  location: string;     // 位置（港口名称）
  date?: string;        // 日期（默认今天）
}
```
- **响应数据**:
```typescript
interface TideData {
  location: string;     // 位置
  date: string;         // 日期
  tides: TideItem[];    // 潮汐数据
  sunrise: string;      // 日出时间
  sunset: string;       // 日落时间
}
interface TideItem {
  time: string;         // 时间
  height: number;       // 潮高（米）
  type: 'high' | 'low'; // 高潮/低潮
}
```

### 4. 获取灾害预警
- **接口**: `GET /api/weather/disaster`
- **描述**: 获取灾害预警信息
- **认证**: 需要Token
- **查询参数**:
```typescript
interface DisasterParams {
  location?: string;    // 位置
  type?: 'typhoon' | 'rainstorm' | 'gale' | 'other'; // 灾害类型
}
```
- **响应数据**:
```typescript
interface DisasterWarning {
  id: string;           // 预警ID
  type: string;         // 灾害类型
  level: string;        // 预警级别
  title: string;        // 标题
  content: string;      // 内容
  affectedAreas: string[]; // 影响区域
  startTime: string;    // 开始时间
  endTime: string;      // 结束时间
  advice: string;       // 建议措施
  source: string;       // 信息来源
  publishTime: string;  // 发布时间
}
```

### 5. 获取历史气象查询
- **接口**: `GET /api/weather/history`
- **描述**: 获取历史气象数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface HistoryWeatherParams {
  location: string;     // 位置
  startDate: string;    // 开始日期
  endDate: string;      // 结束日期
  metrics?: string[];   // 指标：temperature, humidity, precipitation等
}
```
- **响应数据**:
```typescript
interface HistoryWeatherData {
  location: string;     // 位置
  data: HistoryWeatherItem[]; // 历史数据
}
interface HistoryWeatherItem {
  date: string;         // 日期
  temperature: number;  // 平均温度
  maxTemp: number;      // 最高温度
  minTemp: number;      // 最低温度
  humidity: number;     // 湿度
  precipitation: number; // 降水量
  windSpeed: number;    // 风速
  sunshineHours: number; // 日照时数
}
```

## 信息导航模块

### 1. 获取行情推送
- **接口**: `GET /api/market/quotes`
- **描述**: 获取水产行情数据
- **认证**: 需要Token
- **查询参数**:
```typescript
interface MarketQuoteParams {
  species?: string;     // 品种：草鱼、鲫鱼、加州鲈等
  region?: string;      // 区域：广东佛山、江苏苏州等
  date?: string;        // 日期（默认今天）
}
```
- **响应数据**:
```typescript
interface MarketQuote {
  id: string;           // 行情ID
  species: string;      // 品种
  region: string;       // 区域
  price: number;        // 价格（元/斤）
  unit: string;         // 单位
  change: number;       // 涨跌幅（%）
  volume: number;       // 成交量
  market: string;       // 市场名称
  updateTime: string;   // 更新时间
  trend: 'up' | 'down' | 'stable'; // 趋势
}
```

### 2. 获取供应商名录
- **接口**: `GET /api/supplier/list`
- **描述**: 获取供应商列表
- **认证**: 需要Token
- **查询参数**:
```typescript
interface SupplierListParams {
  page?: number;        // 页码
  size?: number;        // 每页大小
  category?: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other'; // 分类
  region?: string;      // 区域
  keyword?: string;     // 搜索关键词
}
```
- **响应数据**:
```typescript
interface SupplierListResponse {
  list: SupplierItem[]; // 供应商列表
  total: number;        // 总数
  page: number;         // 当前页
  size: number;         // 每页大小
}
interface SupplierItem {
  id: string;           // 供应商ID
  name: string;         // 供应商名称
  category: string;     // 主营分类
  address: string;      // 地址
  phone: string;        // 联系电话
  wechat?: string;      // 微信
  region: string;       // 服务区域
  products: string[];   // 主营产品
  rating?: number;      // 评分（1-5）
  isVerified: boolean;  // 是否认证
}
```

### 3. 获取知识库内容
- **接口**: `GET /api/knowledge/content`
- **描述**: 获取知识库内容
- **认证**: 需要Token
- **查询参数**:
```typescript
interface KnowledgeParams {
  type: 'disease' | 'species' | 'technology' | 'qa'; // 知识类型
  keyword?: string;     // 搜索关键词
  page?: number;        // 页码
  size?: number;        // 每页大小
}
```
- **响应数据**:
```typescript
interface KnowledgeContent {
  id: string;           // 知识ID
  title: string;        // 标题
  type: string;         // 类型
  content: string;      // 内容
  tags: string[];       // 标签
  author?: string;      // 作者
  createTime: string;   // 创建时间
  viewCount: number;    // 查看次数
}
```

## 数据实体定义

### 1. 用户实体
```typescript
interface CurrentUser {
  id?: number;          // 用户ID
  userName?: string;    // 用户昵称
  userAccount?: string; // 用户账号
  avatarUrl?: string;   // 用户头像
  gender?: number;      // 性别
  phone?: string;       // 电话
  email?: string;       // 邮箱
  userStatus?: number;  // 用户状态
  userRole?: number;    // 用户角色
  createTime?: string;  // 创建时间
  userVIP?: number;     // VIP等级
}
```

### 2. 基地实体
```typescript
interface BaseItem {
  id: string;           // 基地ID
  name: string;         // 基地名称
  location: [number, number]; // 经纬度坐标
  status: 'normal' | 'warning' | 'todo'; // 基地状态
  waterQuality: WaterQuality; // 水质数据
  area?: number;        // 面积（亩）
  pondCount?: number;   // 塘口数量
  manager?: string;     // 负责人
  phone?: string;       // 联系电话
  address?: string;     // 详细地址
  createTime?: string;  // 创建时间
  updateTime?: string;  // 更新时间
}
```

### 3. 水质数据
```typescript
interface WaterQuality {
  oxygen: number;       // 溶解氧含量（mg/L）
  temp: number;         // 水温（℃）
  ph: number;          // pH值
  ammonia?: number;     // 氨氮（mg/L）
  nitrite?: number;     // 亚硝酸盐（mg/L）
  salinity?: number;    // 盐度（‰）
  transparency?: number; // 透明度（cm）
  updateTime?: string;  // 更新时间
}
```

### 4. 投入记录
```typescript
interface InputRecordItem {
  id: string;           // 记录ID
  date: string;         // 日期
  name: string;         // 物品名称
  category: 'feed' | 'medicine' | 'seed' | 'equipment' | 'other'; // 物品类别
  type: 'in' | 'out';   // 出入库类型
  specification: string; // 规格
  quantity: number;     // 数量
  unit: string;         // 单位
  price: number;        // 单价
  totalPrice: number;   // 总价
  pondName?: string;    // 塘口名称（出库时必填）
  operator: string;     // 操作员
  supplier?: string;    // 供应商（入库时必填）
  status: 'pending' | 'approved' | 'rejected'; // 审核状态
  remark?: string;      // 备注
  createTime?: string;  // 创建时间
  updateTime?: string;  // 更新时间
}
```

### 5. 塘口管理
```typescript
interface PondManagementItem {
  id: string;           // 塘口ID
  name: string;         // 塘口名称
  type: string;         // 塘口类型
  area: number;         // 面积（亩）
  depth: number;        // 深度（米）
  videoStatus: 'online' | 'offline' | 'error'; // 视频状态
  videoUrl?: string;    // 视频地址
  sensorCount: number;  // 传感器数量
  iotNodes: string[];   // 物联网节点
  status: 'active' | 'inactive'; // 塘口状态
  baseId: string;       // 所属基地ID
  baseName?: string;    // 所属基地名称
  species?: string;     // 养殖品种
  stockingDensity?: number; // 放养密度
  createTime?: string;  // 创建时间
  updateTime?: string;  // 更新时间
}
```

### 6. 预警实体
```typescript
interface WarningItem {
  id: string;           // 预警ID
  type: 'water' | 'drug' | 'feeding' | 'weather' | 'other'; // 预警类型
  level: 'low' | 'medium' | 'high' | 'critical'; // 预警级别
  title: string;        // 预警标题
  content: string;      // 预警内容
  baseId?: string;      // 关联基地ID
  baseName?: string;    // 关联基地名称
  pondId?: string;      // 关联塘口ID
  pondName?: string;    // 关联塘口名称
  status: 'unread' | 'read' | 'handled'; // 处理状态
  createTime: string;   // 创建时间
  updateTime?: string;  // 更新时间
  handler?: string;     // 处理人
  handleRemark?: string; // 处理备注
  handleTime?: string;  // 处理时间
}
```

## 状态码定义

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 用户账号或密码错误 |
| 1002 | 用户账号已存在 |
| 1003 | 验证码错误 |
| 2001 | 基地不存在 |
| 2002 | 塘口不存在 |
| 3001 | 库存不足 |
| 3002 | 物资不存在 |
| 4001 | 预警不存在 |
| 5001 | 天气数据获取失败 |

## 接口调用示例

### 1. 用户登录
```http
POST /api/user/login
Content-Type: application/json

{
  "userAccount": "admin",
  "userPassword": "123456",
  "autoLogin": true
}
```

响应：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "userName": "管理员",
      "userAccount": "admin",
      "avatarUrl": "https://example.com/avatar.jpg",
      "userRole": 1
    }
  }
}
```

### 2. 获取基地列表
```http
GET /api/base/list?page=1&size=10&status=normal
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

响应：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "base001",
        "name": "萧山生态基地 01",
        "location": [120.253576, 30.227459],
        "status": "normal",
        "waterQuality": {
          "oxygen": 6.8,
          "temp": 24.5,
          "ph": 7.8
        }
      }
    ],
    "total": 15,
    "page": 1,
    "size": 10
  }
}
```

## 注意事项

1. **认证要求**：除登录、注册接口外，其他接口都需要在请求头中添加`Authorization: Bearer {token}`

2. **参数验证**：所有接口都会对输入参数进行验证，不符合要求的参数会返回400错误

3. **分页参数**：列表接口都支持分页，默认`page=1`，`size=10`

4. **时间格式**：所有时间字段都使用ISO 8601格式：`YYYY-MM-DDTHH:mm:ssZ`

5. **错误处理**：所有错误都会返回统一的错误格式，包含错误码和错误信息

6. **数据权限**：用户只能访问自己有权限的数据，跨权限访问会返回403错误

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03-28 | 初始版本，基于PC端需求文档和前端页面分析 |
| v1.1 | 2026-03-28 | 补充数据实体定义和接口调用示例 |

## 后续开发建议

1. **接口文档自动化**：建议使用Swagger/OpenAPI自动生成接口文档
2. **接口版本管理**：建议在URL中添加版本号，如`/api/v1/user/login`
3. **接口监控**：建议添加接口调用统计和性能监控
4. **接口缓存**：对于不常变动的数据（如供应商名录、知识库），建议添加缓存机制
5. **接口限流**：对于高频接口（如气象数据），建议添加限流保护

---
*文档结束*
