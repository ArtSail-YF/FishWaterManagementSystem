/**
 * API参数映射工具
 * 统一前端参数名与后端不同类别API的参数名映射
 */

// ====== 前端统一参数名 ======
export interface FrontendQueryParams {
  current: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  code?: string;
  baseId?: string;
  area?: number;
  depth?: number;
  depthAvg?: number;
  depthMax?: number;
  shapeType?: string;
  bottomType?: string;
  waterQuality?: string;
  capacity?: number;
  volume?: number;
  tonnage?: number;
  material?: string;
  compartment?: string;
  shipNumber?: string;
  waterDepth?: number;
  shape?: string;
  breedingVolume?: number;
  lengthOverall?: number;
  width?: number;
  status?: number;
  remark?: string;
  category?: string;
  categoryName?: string;
  type?: string;
  videoStatus?: string;
  sensorCount?: number;
  [key: string]: any;
}

// ====== 参数映射函数 ======

/**
 * 根据类别映射查询参数
 * @param category 类别: 'pond' | 'cage' | 'workboat'
 * @param frontendParams 前端统一参数
 * @returns 后端特定参数
 */
export function mapQueryParamsByCategory(
  category: string,
  frontendParams: FrontendQueryParams
): any {
  const commonParams = {
    current: frontendParams.current,
    pageSize: frontendParams.pageSize,
    keyword: frontendParams.keyword || frontendParams.name,
    status: frontendParams.status,
    remark: frontendParams.type,
    category: frontendParams.category,
    categoryName: frontendParams.categoryName,
    type: frontendParams.type,
    videoStatus: frontendParams.videoStatus,
    sensorCount: frontendParams.sensorCount,
  };

  switch (category) {
    case 'pond':
      return {
        ...commonParams,
        pondName: frontendParams.pondName || frontendParams.name,
        pondCode: frontendParams.pondCode || frontendParams.code,
        baseId: frontendParams.baseId,
        area: frontendParams.area,
        depthAvg: frontendParams.depthAvg,
        depthMax: frontendParams.depthMax,
        shapeType: frontendParams.shapeType,
        bottomType: frontendParams.bottomType,
        bottomSiltDepth: frontendParams.bottomSiltDepth,
        inletCount: frontendParams.inletCount,
        outletCount: frontendParams.outletCount,
        aerationType: frontendParams.aerationType,
        aerationPower: frontendParams.aerationPower,
        currentSpecies: frontendParams.currentSpecies,
        stockingDate: frontendParams.stockingDate,
      };

    case 'cage':
      return {
        ...commonParams,
        cageName: frontendParams.cageName || frontendParams.name,
        cageCode: frontendParams.cageCode || frontendParams.code,
        baseId: frontendParams.baseId,
        longitude: frontendParams.longitude,
        latitude: frontendParams.latitude,
        seaAreaName: frontendParams.seaAreaName,
        waterDepth: frontendParams.waterDepth,
        windResistance: frontendParams.windResistance,
        volume: frontendParams.volume,
        perimeter: frontendParams.perimeter,
        netBagDepth: frontendParams.netBagDepth,
        material: frontendParams.material,
        currentSpecies: frontendParams.currentSpecies,
        stockingDate: frontendParams.stockingDate,
      };

    case 'workboat':
      return {
        ...commonParams,
        vslName: frontendParams.vslName || frontendParams.name,
        vslCode: frontendParams.vslCode || frontendParams.code,
        mmsi: frontendParams.mmsi,
        lengthOverall: frontendParams.lengthOverall,
        width: frontendParams.width,
        depth: frontendParams.depth,
        grossTonnage: frontendParams.grossTonnage,
        deadweight: frontendParams.deadweight,
        maxSpeed: frontendParams.maxSpeed,
        breedingVolume: frontendParams.breedingVolume,
        productionCapacity: frontendParams.productionCapacity,
        currentSpecies: frontendParams.currentSpecies,
        stockingDate: frontendParams.stockingDate,
      };
    default:
      return commonParams;
  }
}

/**
 * 映射创建/更新参数
 */
export function mapCreateUpdateParamsByCategory(
  category: string,
  values: any
): any {
  switch (category) {
    case 'pond':
      return {
        ...values,
        pondName: values.pondName,
        pondCode: values.pondCode,
        area: values.area,
        depthAvg: values.depthAvg,
        depthMax: values.depthMax,
      };
    case 'cage':
      return {
        ...values,
        cageName: values.cageName,
        cageCode: values.cageCode,
        volume: values.volume,
      };
    case 'workboat':
      return {
        ...values,
        vslName: values.vslName,
        vslCode: values.vslCode,
        breedingVolume: values.breedingVolume,
      };
    default:
      return values;
  }
}

/**
 * 过滤掉undefined和空值参数
 * @param params 参数对象
 * @returns 过滤后的参数
 */
export function filterEmptyParams(params: any): any {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => 
      value !== undefined && value !== '' && value !== null
    )
  );
}