/**
 * 池塘模型
 * 前端自己使用的理想模型
 */

/** 池塘状态 */
export type PondStatus = 'breeding' | 'empty' | 'locked' | 'ready';

/** 基地类型 */
export type BaseType = '近海' | '深远海' | '陆基工厂化';

/** 水质指标 */
export interface WaterMetrics {
  waterLevel?: number;      // 水位 (cm)
  waterTemp?: number;       // 水温 (°C)
  waterPH?: number;         // pH值
  waterDO?: number;         // 溶氧量 (mg/L)
  waterTurbidity?: number;  // 浊度 (NTU)
}

/** 池塘物理参数 */
export interface PondPhysicalParams {
  area?: number;            // 面积 (亩)
  depth?: number;           // 深度 (m)
  days?: number;            // 养殖天数
  aerators?: string;        // 增氧机配置
}

/** 池塘基础模型 */
export interface Pond {
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
  pondType: string;        // 塘口类型（传统/循环水/智慧养殖）
  ecologicalIndex: number;  // 生态健康指数
  carbonFootprint: number;  // 碳足迹（吨/年）
}

/** 池塘详情模型 */
export interface PondDetail extends Pond {
  Water?: WaterMetrics;
  PondPhysical?: PondPhysicalParams;
  timeline?: TimelineItem[];
  stats?: PondStats;
}

/** 时间轴项 */
export interface TimelineItem {
  time: string;
  title: string;
  content: string;
  status: 'wait' | 'process' | 'finish';
}

/** 池塘统计 */
export interface PondStats {
  todayTasks: number;
  completedTasks: number;
  activePlans: number;
  overdueTasks: number;
}

/** 池塘汇总统计 */
export interface PondSummaryStats {
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

/** 池塘状态项 */
export interface PondStatusItem {
  id: string;
  name: string;
  baseName: string;
  status: 'normal' | 'warning' | 'error';
  indicators: {
    oxygen: { value: number; trend: 'up' | 'down' | 'stable' };
    temp: { value: number; trend: 'up' | 'down' | 'stable' };
    ph: { value: number; trend: 'up' | 'down' | 'stable' };
  };
}

/** 深远海装备模型 */
export interface DeepSeaEquipment {
  id: string;                // 装备编号
  equipmentType: string;     // 装备类型（工船/网箱/平台）
  name: string;               // 装备名称
  baseId: string;            // 所属基地编号
  tonnage: number;            // 吨位/容量
  maxDepth: number;          // 最大作业水深（米）
  gpsPosition: string;       // 实时GPS位置
  status: string;             // 状态（运行/维修/停用）
  subsidyAmount: number;     // 已申请补贴金额
  subsidyStatus: string;     // 补贴状态（申请中/已获批/已发放）
}

/** 深远海作业日志模型 */
export interface DeepSeaOperationLog {
  id: string;                // 记录编号
  equipmentId: string;       // 装备编号
  operationType: string;     // 作业类型（投喂/捕捞/维护）
  startTime: string;         // 作业开始时间
  endTime: string;           // 作业结束时间
  catchQuantity: number;     // 捕捞量
  fuelConsumption: number;   // 燃油消耗（升）
}

/** 台资企业模型 */
export interface TaiwanEnterprise {
  id: string;                    // 备案编号
  companyName: string;           // 企业名称
  taiwanBusinessLicense: string; // 台湾营业执照编号
  taiwanContact: string;         // 台湾联系地址
  crossStraitCooperation: string; // 是否两岸合作项目
  preferentialPolicy: string;    // 享受的惠台政策
  insuranceDiscount: number;     // 保费优惠比例（%）
}

/** 台湾种苗引进模型 */
export interface TaiwanSeedImport {
  id: string;                // 引进编号
  speciesName: string;       // 品种名称（石斑鱼/鲍鱼/虾类）
  originTaiwan: string;      // 台湾来源地
  quarantineCertificate: string; // 检疫证明文件
  adaptationAssessment: string; // 适应性评估报告
  importCost: number;        // 引进成本
  expectedYield: number;     // 预期产量
}

/** 两岸技术交流模型 */
export interface CrossStraitTechExchange {
  id: string;                // 交流编号
  expertName: string;        // 台湾专家姓名
  expertise: string;          // 专长领域
  consultationType: string;  // 咨询类型（视频/现场/文档）
  consultationContent: string; // 咨询内容
  taiwanStandard: string;    // 台湾标准对照
}

/** 物资信息模型 */
export interface Material {
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
  originRegion: string;       // 来源地区（大陆/台湾/进口）
  taiwanBrand: string;        // 台湾品牌名称
  crossStraitStandard: string; // 两岸标准互认状态
}

/** 供应商模型 */
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  supplierOrigin: string;     // 供应商来源（大陆/台湾）
  taiwanQualification: string; // 台湾资质证书
  crossStraitCooperation: number; // 是否两岸合作供应商
  insuranceDiscount: number;  // 台资企业保费优惠
}

/** 产品合格证模型 */
export interface Certificate {
  id: string;
  productName: string;
  batchNumber: string;
  productionDate: string;
  expirationDate: string;
  issuer: string;
  issueDate: string;
  greenCertification: string;  // 绿色认证标识
  crossStraitRecognition: number; // 两岸互认标志
  exportTaiwan: number;        // 是否出口台湾
  premiumPrice: number;        // 优质优价（元/斤）
}

/** 市场行情模型 */
export interface MarketQuote {
  id: string;
  productName: string;
  marketPrice: number;
  date: string;
  region: string;
  taiwanMarketPrice: number;  // 台湾市场价格
  exportDemand: string;        // 台湾出口需求
  crossStraitTrend: string;   // 两岸价格趋势对比
}
