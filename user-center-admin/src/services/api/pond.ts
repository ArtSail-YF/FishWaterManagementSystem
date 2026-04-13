/**
 * 池塘相关API服务
 * 封装 API 调用 + 类型转换
 */

import { request } from '@umijs/max';
import type {
  PondListResponse,
  PondDetailResponse,
  PondSummaryResponse,
  BaseListResponse,
  DeepSeaEquipmentListResponse,
  DeepSeaOperationLogListResponse,
  TaiwanEnterpriseListResponse,
  TaiwanSeedImportListResponse,
  CrossStraitTechExchangeListResponse,
  MaterialListResponse,
  SupplierListResponse,
  CertificateListResponse,
  MarketQuoteListResponse,
} from '@/types/api';
import type { 
  Pond, 
  PondDetail, 
  PondSummaryStats, 
  Base, 
  DeepSeaEquipment, 
  DeepSeaOperationLog,
  TaiwanEnterprise,
  TaiwanSeedImport,
  CrossStraitTechExchange,
  Material,
  Supplier,
  Certificate,
  MarketQuote
} from '@/models';

/**
 * 获取池塘列表
 * GET /api/pond/list
 */
export async function getPondList(options?: any) {
  const response = await request<PondListResponse>('/api/pond/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(pond => ({
      ...pond,
      pondType: pond.pond_type,
      ecologicalIndex: pond.ecological_index,
      carbonFootprint: pond.carbon_footprint,
    }));
  }
  
  return response;
}

/**
 * 获取池塘详情
 * GET /api/pond/:id
 */
export async function getPondDetail(id: string, options?: any) {
  const response = await request<PondDetailResponse>(`/api/pond/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = {
      ...response.data,
      pondType: response.data.pond_type,
      ecologicalIndex: response.data.ecological_index,
      carbonFootprint: response.data.carbon_footprint,
    };
  }
  
  return response;
}

/**
 * 获取池塘统计
 * GET /api/pond/stats
 */
export async function getPondStats(options?: any) {
  const response = await request<PondSummaryResponse>('/api/pond/stats', {
    method: 'GET',
    ...(options || {}),
  });
  
  return response;
}

/**
 * 获取基地列表
 * GET /api/base/list
 */
export async function getBaseList(options?: any) {
  const response = await request<BaseListResponse>('/api/base/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(base => ({
      ...base,
      baseType: base.base_type,
      deepSeaCertified: base.deep_sea_certified,
      taiwanCooperation: base.taiwan_cooperation,
      greenCertification: base.green_certification,
    }));
  }
  
  return response;
}

/**
 * 获取深远海装备列表
 * GET /api/deep-sea/equipment/list
 */
export async function getDeepSeaEquipmentList(options?: any) {
  const response = await request<DeepSeaEquipmentListResponse>('/api/deep-sea/equipment/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(equipment => ({
      ...equipment,
      equipmentType: equipment.equipment_type,
      baseId: equipment.base_id,
      maxDepth: equipment.max_depth,
      gpsPosition: equipment.gps_position,
      subsidyAmount: equipment.subsidy_amount,
      subsidyStatus: equipment.subsidy_status,
    }));
  }
  
  return response;
}

/**
 * 获取深远海作业日志列表
 * GET /api/deep-sea/operation/logs
 */
export async function getDeepSeaOperationLogs(options?: any) {
  const response = await request<DeepSeaOperationLogListResponse>('/api/deep-sea/operation/logs', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(log => ({
      ...log,
      equipmentId: log.equipment_id,
      operationType: log.operation_type,
      startTime: log.start_time,
      endTime: log.end_time,
      catchQuantity: log.catch_quantity,
      fuelConsumption: log.fuel_consumption,
    }));
  }
  
  return response;
}

/**
 * 获取台资企业列表
 * GET /api/taiwan/enterprise/list
 */
export async function getTaiwanEnterpriseList(options?: any) {
  const response = await request<TaiwanEnterpriseListResponse>('/api/taiwan/enterprise/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(enterprise => ({
      ...enterprise,
      companyName: enterprise.company_name,
      taiwanBusinessLicense: enterprise.taiwan_business_license,
      taiwanContact: enterprise.taiwan_contact,
      crossStraitCooperation: enterprise.cross_strait_cooperation,
      preferentialPolicy: enterprise.preferential_policy,
      insuranceDiscount: enterprise.insurance_discount,
    }));
  }
  
  return response;
}

/**
 * 获取台湾种苗引进列表
 * GET /api/taiwan/seed/import/list
 */
export async function getTaiwanSeedImportList(options?: any) {
  const response = await request<TaiwanSeedImportListResponse>('/api/taiwan/seed/import/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(seed => ({
      ...seed,
      speciesName: seed.species_name,
      originTaiwan: seed.origin_taiwan,
      quarantineCertificate: seed.quarantine_certificate,
      adaptationAssessment: seed.adaptation_assessment,
      importCost: seed.import_cost,
      expectedYield: seed.expected_yield,
    }));
  }
  
  return response;
}

/**
 * 获取两岸技术交流列表
 * GET /api/taiwan/tech/exchange/list
 */
export async function getCrossStraitTechExchangeList(options?: any) {
  const response = await request<CrossStraitTechExchangeListResponse>('/api/taiwan/tech/exchange/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(exchange => ({
      ...exchange,
      expertName: exchange.expert_name,
      consultationType: exchange.consultation_type,
      consultationContent: exchange.consultation_content,
      taiwanStandard: exchange.taiwan_standard,
    }));
  }
  
  return response;
}

/**
 * 获取物资信息列表
 * GET /api/material/list
 */
export async function getMaterialList(options?: any) {
  const response = await request<MaterialListResponse>('/api/material/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(material => ({
      ...material,
      originRegion: material.origin_region,
      taiwanBrand: material.taiwan_brand,
      crossStraitStandard: material.cross_strait_standard,
    }));
  }
  
  return response;
}

/**
 * 获取供应商列表
 * GET /api/supplier/list
 */
export async function getSupplierList(options?: any) {
  const response = await request<SupplierListResponse>('/api/supplier/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(supplier => ({
      ...supplier,
      supplierOrigin: supplier.supplier_origin,
      taiwanQualification: supplier.taiwan_qualification,
      crossStraitCooperation: supplier.cross_strait_cooperation,
      insuranceDiscount: supplier.insurance_discount,
    }));
  }
  
  return response;
}

/**
 * 获取产品合格证列表
 * GET /api/certificate/list
 */
export async function getCertificateList(options?: any) {
  const response = await request<CertificateListResponse>('/api/certificate/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(certificate => ({
      ...certificate,
      productName: certificate.product_name,
      batchNumber: certificate.batch_number,
      productionDate: certificate.production_date,
      expirationDate: certificate.expiration_date,
      greenCertification: certificate.green_certification,
      crossStraitRecognition: certificate.cross_strait_recognition,
      exportTaiwan: certificate.export_taiwan,
      premiumPrice: certificate.premium_price,
    }));
  }
  
  return response;
}

/**
 * 获取市场行情列表
 * GET /api/market/quote/list
 */
export async function getMarketQuoteList(options?: any) {
  const response = await request<MarketQuoteListResponse>('/api/market/quote/list', {
    method: 'GET',
    ...(options || {}),
  });
  
  // 类型转换：后端DTO -> 前端模型
  if (response.data) {
    response.data = response.data.map(quote => ({
      ...quote,
      productName: quote.product_name,
      marketPrice: quote.market_price,
      taiwanMarketPrice: quote.taiwan_market_price,
      exportDemand: quote.export_demand,
      crossStraitTrend: quote.cross_strait_trend,
    }));
  }
  
  return response;
}
