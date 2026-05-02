/**
 * 池塘相关API返回的数据结构（契约）
 * 这些类型定义应该与后端API文档保持一致
 */

import { BaseResponse } from '../common';

/** 池塘状态 */
export type PondStatus = 'breeding' | 'empty' | 'locked' | 'ready';

/** 基地类型 */
export type BaseType = '近海' | '深远海' | '陆基工厂化';

/** 池塘基础信息 */
export interface PondDTO {
  id: string;
  name: string;
  baseId: string;
  type: string;
  area: number;
  depth: number;
  status: PondStatus;
  species: string;
  days: number;
  temp: number;
  do: number;
  doTrend: number[];
  estWeight: number;
  videoStatus: 'online' | 'offline' | 'error';
  videoUrl: string;
  sensorCount: number;
  iotNodes: string[];
  pond_type: string;        // 塘口类型（传统/循环水/智慧养殖）
  ecological_index: number;  // 生态健康指数
  carbon_footprint: number;  // 碳足迹（吨/年）
}

/** 池塘详情 */
export interface PondDetailDTO extends PondDTO {
  Water?: {
    waterTemp?: number;
    waterDO?: number;
    waterPH?: number;
  };
  PondPhysical?: {
    area?: number;
    depth?: number;
    days?: number;
  };
  timeline?: {
    time: string;
    title: string;
    content: string;
    status: 'wait' | 'process' | 'finish';
  }[];
  stats?: {
    todayTasks: number;
    completedTasks: number;
    activePlans: number;
    overdueTasks: number;
  };
}

/** 池塘统计 */
export interface PondSummaryDTO {
  totalPonds: number;
  breedingCount: number;
  emptyCount: number;
  lockedCount: number;
  totalArea: number;
  avgDepth: number;
  totalBiomass: number;
  species: string[];
  estimatedValue?: number;
  growthRate?: number;
}

/** 基地信息 */
export interface BaseDTO {
  id: string;
  name: string;
  location: [number, number];
  status: 'normal' | 'warning' | 'todo';
  waterQuality: {
    oxygen: number;
    temp: number;
    ph: number;
  };
  base_type: string;              // 基地类型（近海/深远海/陆基工厂化）
  deep_sea_certified: number;     // 是否深远海认证基地
  taiwan_cooperation: number;     // 是否有台资合作
  green_certification: string;    // 绿色认证等级
}

/** 深远海装备 */
export interface DeepSeaEquipmentDTO {
  id: string;                // 装备编号
  equipment_type: string;     // 装备类型（工船/网箱/平台）
  name: string;               // 装备名称
  base_id: string;            // 所属基地编号
  tonnage: number;            // 吨位/容量
  max_depth: number;          // 最大作业水深（米）
  gps_position: string;       // 实时GPS位置
  status: string;             // 状态（运行/维修/停用）
  subsidy_amount: number;     // 已申请补贴金额
  subsidy_status: string;     // 补贴状态（申请中/已获批/已发放）
}

/** 深远海作业日志 */
export interface DeepSeaOperationLogDTO {
  id: string;                // 记录编号
  equipment_id: string;       // 装备编号
  operation_type: string;     // 作业类型（投喂/捕捞/维护）
  start_time: string;         // 作业开始时间
  end_time: string;           // 作业结束时间
  catch_quantity: number;     // 捕捞量
  fuel_consumption: number;   // 燃油消耗（升）
}

/** 台资企业 */
export interface TaiwanEnterpriseDTO {
  id: string;                    // 备案编号
  company_name: string;           // 企业名称
  taiwan_business_license: string; // 台湾营业执照编号
  taiwan_contact: string;         // 台湾联系地址
  cross_strait_cooperation: string; // 是否两岸合作项目
  preferential_policy: string;    // 享受的惠台政策
  insurance_discount: number;     // 保费优惠比例（%）
}

/** 台湾种苗引进 */
export interface TaiwanSeedImportDTO {
  id: string;                // 引进编号
  species_name: string;       // 品种名称（石斑鱼/鲍鱼/虾类）
  origin_taiwan: string;      // 台湾来源地
  quarantine_certificate: string; // 检疫证明文件
  adaptation_assessment: string; // 适应性评估报告
  import_cost: number;        // 引进成本
  expected_yield: number;     // 预期产量
}

/** 两岸技术交流 */
export interface CrossStraitTechExchangeDTO {
  id: string;                // 交流编号
  expert_name: string;        // 台湾专家姓名
  expertise: string;          // 专长领域
  consultation_type: string;  // 咨询类型（视频/现场/文档）
  consultation_content: string; // 咨询内容
  taiwan_standard: string;    // 台湾标准对照
}

/** 物资信息 */
export interface MaterialDTO {
  id: string;
  name: string;
  category: string;
  specification: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  supplier: string;
  status: string;
  operator: string;
  origin_region: string;       // 来源地区（大陆/台湾/进口）
  taiwan_brand: string;        // 台湾品牌名称
  cross_strait_standard: string; // 两岸标准互认状态
}

/** 供应商 */
export interface SupplierDTO {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  supplier_origin: string;     // 供应商来源（大陆/台湾）
  taiwan_qualification: string; // 台湾资质证书
  cross_strait_cooperation: number; // 是否两岸合作供应商
  insurance_discount: number;  // 台资企业保费优惠
}

/** 产品合格证 */
export interface CertificateDTO {
  id: string;
  product_name: string;
  batch_number: string;
  production_date: string;
  expiration_date: string;
  issuer: string;
  issue_date: string;
  green_certification: string;  // 绿色认证标识
  cross_strait_recognition: number; // 两岸互认标志
  export_taiwan: number;        // 是否出口台湾
  premium_price: number;        // 优质优价（元/斤）
}

/** 市场行情 */
export interface MarketQuoteDTO {
  id: string;
  product_name: string;
  market_price: number;
  date: string;
  region: string;
  taiwan_market_price: number;  // 台湾市场价格
  export_demand: string;        // 台湾出口需求
  cross_strait_trend: string;   // 两岸价格趋势对比
}

/** 池塘列表响应 */
export type PondListResponse = BaseResponse<PondDTO[]>;

/** 池塘详情响应 */
export type PondDetailResponse = BaseResponse<PondDetailDTO>;

/** 池塘统计响应 */
export type PondSummaryResponse = BaseResponse<PondSummaryDTO>;

/** 基地列表响应 */
export type BaseListResponse = BaseResponse<BaseDTO[]>;

/** 深远海装备列表响应 */
export type DeepSeaEquipmentListResponse = BaseResponse<DeepSeaEquipmentDTO[]>;

/** 深远海作业日志列表响应 */
export type DeepSeaOperationLogListResponse = BaseResponse<DeepSeaOperationLogDTO[]>;

/** 台资企业列表响应 */
export type TaiwanEnterpriseListResponse = BaseResponse<TaiwanEnterpriseDTO[]>;

/** 台湾种苗引进列表响应 */
export type TaiwanSeedImportListResponse = BaseResponse<TaiwanSeedImportDTO[]>;

/** 两岸技术交流列表响应 */
export type CrossStraitTechExchangeListResponse = BaseResponse<CrossStraitTechExchangeDTO[]>;

/** 物资信息列表响应 */
export type MaterialListResponse = BaseResponse<MaterialDTO[]>;

/** 供应商列表响应 */
export type SupplierListResponse = BaseResponse<SupplierDTO[]>;

/** 产品合格证列表响应 */
export type CertificateListResponse = BaseResponse<CertificateDTO[]>;

/** 市场行情列表响应 */
export type MarketQuoteListResponse = BaseResponse<MarketQuoteDTO[]>;
