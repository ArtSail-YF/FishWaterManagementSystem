/**
 * 生产计划 API 类型定义
 * 后端返回的原始数据结构（契约）
 */

import type { BaseResponse, PageResult, PageQueryParams } from '../common';

/** 计划类型枚举 */
export type PlanType = 'feeding' | 'medication' | 'harvest' | 'maintenance' | 'seeding' | 'water_change';

/** 目标类型枚举 */
export type TargetType = 'pond' | 'cage' | 'vsl';

/** 计划状态枚举 */
export type PlanStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

/** 计划查询参数 */
export interface PlanQueryParams extends PageQueryParams {
  baseId?: number;
  planType?: PlanType;
  targetType?: TargetType;
  targetId?: number;
  status?: PlanStatus;
  ownerId?: number;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

/** 计划详情（后端返回） */
export interface PlanDTO {
  id: number;
  baseId: number;
  parentPlanId?: number;
  targetType: TargetType;
  targetId?: number;
  planType: PlanType;
  title: string;
  contentDesc?: string;
  startTime?: string;
  endTime?: string;
  cycleRule?: string;
  status: PlanStatus;
  ownerId?: number;
  assigneeGroupId?: number;
  createdAt: string;
  updatedAt?: string;
  isDelete?: number;
  deleteTime?: string;
  baseName?: string;
  targetName?: string;
}

/** 创建计划请求 */
export interface CreatePlanRequest {
  baseId: number;
  parentPlanId?: number;
  targetType: TargetType;
  targetId?: number;
  planType: PlanType;
  title: string;
  contentDesc?: string;
  startTime?: string;
  endTime?: string;
  cycleRule?: string;
  assigneeGroupId?: number;
}

/** 更新计划请求 */
export interface UpdatePlanRequest {
  baseId?: number;
  parentPlanId?: number;
  targetType?: TargetType;
  targetId?: number;
  planType?: PlanType;
  title?: string;
  contentDesc?: string;
  startTime?: string;
  endTime?: string;
  cycleRule?: string;
  assigneeGroupId?: number;
}

/** 取消计划请求 */
export interface CancelPlanRequest {
  reason?: string;
}

/** 计划统计响应 */
export interface PlanStatsDTO {
  total: number;
  draft: number;
  published: number;
  active: number;
  completed: number;
  cancelled: number;
}

/** 分页响应 */
export type PlanPageResponse = BaseResponse<PageResult<PlanDTO>>;

/** 详情响应 */
export type PlanDetailResponse = BaseResponse<PlanDTO>;

/** 统计响应 */
export type PlanStatsResponse = BaseResponse<PlanStatsDTO>;
