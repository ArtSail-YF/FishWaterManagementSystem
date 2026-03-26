// @ts-ignore
/* eslint-disable */

// import { Result } from "antd";


declare namespace API {

  // ====== 通用响应结构 ======
  type BaseResponse<T> = {
    code: number;       // 200 表示成功
    message: string;    // 描述信息
    data: T;           // 业务数据（可选）
    description?: string;
  };



  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };


// 用户数据接口
interface CurrentUser {
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
};

// API响应类型
type CurrentUserResult = BaseResponse<CurrentUser>;

type CurrentUserListResult = BaseResponse<CurrentUser[]>;

  // ====== 登录/注册 ======

  
  interface NewType {
    userAccount?: string;
    userPassword?: string;
    autoLogin?: boolean;
    type?: string;
  }


  interface LoginData {
    currentAuthority?: string;
    status?: string;
    autoLogin?: boolean;
    type?: string;
    user: CurrentUser;
  }

  interface RegisterData {
    id: number;
    status?: string;
  }




  type LoginResult = BaseResponse<LoginData>;
  type RegisterResult = BaseResponse<RegisterData>;




  //* 登录接口 POST /api/user/login/account
  type LoginParams = NewType;


  //* 注册接口 POST /api/user/register/account
  type RegisterParams = NewType & { checkPassword: string };



  // ====== 列表分页 ======

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatarUrl?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };





}



