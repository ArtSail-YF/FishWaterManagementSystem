/**
 * 用户相关API返回的数据结构（契约）
 * 这些类型定义应该与后端API文档保持一致
 */

import { BaseResponse } from './common';

/** 用户数据 */
export interface UserDTO {
  id?: number;
  userName?: string;
  userAccount?: string;
  avatarUrl?: string;
  gender?: number;
  phone?: string;
  email?: string;
  userStatus?: number;
  userRole?: number;
  createTime?: string;
  userVIP?: number;
}

/** 登录参数 */
export interface LoginParams {
  userAccount?: string;
  userPassword?: string;
  autoLogin?: boolean;
  type?: string;
}

/** 登录响应数据 */
export interface LoginData {
  currentAuthority?: string;
  status?: string;
  autoLogin?: boolean;
  type?: string;
  user: UserDTO;
}

/** 注册参数 */
export interface RegisterParams extends LoginParams {
  checkPassword: string;
}

/** 注册响应数据 */
export interface RegisterData {
  id: number;
  status?: string;
}

/** 登录响应 */
export type LoginResponse = BaseResponse<LoginData>;

/** 注册响应 */
export type RegisterResponse = BaseResponse<RegisterData>;

/** 用户响应 */
export type UserResponse = BaseResponse<UserDTO>;

/** 用户列表响应 */
export type UserListResponse = BaseResponse<UserDTO[]>;
