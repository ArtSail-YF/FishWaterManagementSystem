/**
 * 通用类型定义
 * 遵循阿里Ant Design Pro规范
 */

// ====== 基础响应结构 ======

export interface BaseResponse<T = any> {
  code: number;       // 200-成功，其他-失败
  message: string;    // 描述信息
  data: T;           // 业务数据
  description?: string;
}

// ====== 分页相关类型 ======

export interface PaginationParams {
  current?: number;   // 当前页码
  pageSize?: number;  // 每页大小
  keyword?: string;   // 搜索关键词
  [key: string]: any; // 其他查询条件
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  success: boolean;
  [key: string]: any;
}

// ====== 基础实体类型 ======

export interface BaseEntity {
  id: string;         // 主键ID (VARCHAR(32))
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
  isDeleted?: number;  // 逻辑删除：0-正常，1-删除
}

// ====== 通用枚举类型 ======

export enum StatusEnum {
  ENABLED = 1,        // 启用
  DISABLED = 0,       // 禁用
}

export enum ApprovalStatusEnum {
  PENDING = 0,        // 待审批
  APPROVED = 1,       // 已通过
  REJECTED = 2,       // 已拒绝
}

// ====== 通用查询参数 ======

export interface TimeRangeParams {
  startTime?: string;  // 开始时间
  endTime?: string;    // 结束时间
}

export interface BaseQueryParams extends PaginationParams, TimeRangeParams {
  status?: number;     // 状态筛选
  creatorId?: string;  // 创建人筛选
}

// ====== 扩展查询参数 ======

export interface DomainQueryParams extends BaseQueryParams {
  // 通用扩展字段
  type?: string | number;      // 类型筛选
  level?: string | number;     // 级别筛选
  category?: string;           // 分类筛选
  baseId?: string;            // 基地ID筛选
  pondId?: string;            // 塘口ID筛选
}