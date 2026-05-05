/**
 * 通用类型定义
 * 遵循阿里Ant Design Pro规范 + MyBatis Plus风格
 */

// ====== 基础响应结构 ======

export interface BaseResponse<T = any> {
  code: number;       // 200-成功，其他-失败
  message: string;    // 描述信息
  data: T;           // 业务数据
  description?: string;
}

// ====== MyBatis Plus风格分页响应 ======

// 【核心】MyBatis Plus 风格的分页响应
// 对应后端返回的 data: { records: [...], total: ... }
export interface PageResult<T> {
  records: T[];        // 数据列表
  total: number;      // 总记录数
  size: number;       // 每页大小
  current: number;    // 当前页
  pages: number;      // 总页数
  searchCount?: boolean; // 是否进行 count 查询
}

// ====== 分页查询参数 ======

export interface PageQueryParams {
  current: number;    // 当前页码
  pageSize: number;   // 每页条数
  keyword?: string;   // 搜索关键词
  [key: string]: any; // 其他查询条件
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  success: boolean;
  [key: string]: any;
}


// ====== 字典管理通用类型 ======

// 字典数据实体
export interface DictData {
  id: number;
  dictType: string;    // 字典类型 (如 sys_user_sex)
  dictLabel: string;   // 字典标签 (如 "男")
  dictValue: string;   // 字典值 (如 "0")
  sortOrder: number;   // 排序
  status: number;      // 状态
  createTime: string;
  updateTime: string | null;
}

// 字典类型查询参数
export interface DictTypeQueryParams extends PageQueryParams {
  dictType?: string;
  dictName?: string;
  status?: number;
}

// 字典数据查询参数
export interface DictDataQueryParams extends PageQueryParams {
  dictType?: string;   // 可选：按类型筛选
  dictLabel?: string;  // 可选：按标签搜索
  dictValue?: string;  // 可选：按值搜索
  status?: number;     // 可选：按状态筛选
}

// 字典状态枚举
export enum DictStatusEnum {
  ENABLED = 1,        // 启用
  DISABLED = 0,       // 禁用
}

// 字典类型通用响应格式
export interface DictTypeListResponse {
  code: number;
  message: string;
  data: PageResult<any>;
}

// 字典数据通用响应格式
export interface DictDataListResponse {
  code: number;
  message: string;
  data: PageResult<any>;
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

export interface BaseQueryParams extends PageQueryParams, TimeRangeParams {
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
