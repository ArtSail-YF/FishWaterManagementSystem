import { request } from '@umijs/max';
import { convertToProTable } from './utils/convert';
import type { CertificateApplyParams, CertificateStrategy, CertificateVO } from '@/types/api/certificate';
import type { BaseResponse, PageResult } from '@/types/common';

/**
 * 合格证管理 API
 */

/** 查询合格证列表 */
export async function searchCertificates(params: any) {
  const response = await request('/certificate/search', { method: 'GET', params });
  return convertToProTable(response);
}

/** 获取合格证详情 */
export async function getCertificateDetail(id: number) {
  return request<BaseResponse<CertificateVO>>('/certificate/' + id, { method: 'GET' });
}

/** 申请生成合格证 */
export async function applyCertificate(body: CertificateApplyParams) {
  return request<BaseResponse<CertificateVO>>('/certificate/apply', {
    method: 'POST',
    data: body,
  });
}

/** 合格证统计 */
export async function getCertificateStats() {
  return request<BaseResponse<Record<string, number>>>('/certificate/stats', { method: 'GET' });
}

/** 合格证预览 */
export async function previewCertificate(id: number) {
  return request<BaseResponse<CertificateVO>>('/certificate/' + id + '/preview', { method: 'GET' });
}

/**
 * 合规校验相关 API
 */

/** 查询指定塘口当前休药期状态 */
export async function getWithdrawalStatus(pondId: number) {
  return request('/compliance/withdrawal-status', {
    method: 'GET',
    params: { pondId },
  });
}

/** 查询基地下所有塘口的休药期概览 */
export async function getWithdrawalSummary(baseId?: number) {
  return request('/compliance/withdrawal-summary', {
    method: 'GET',
    params: { baseId: baseId || 1 },
  });
}

/** 检查合格证发放资格 */
export async function checkCertEligibility(pondId: number, strategyId: number) {
  return request('/compliance/check-cert-eligibility', {
    method: 'GET',
    params: { pondId, strategyId },
  });
}

/**
 * 合格证策略 API
 */

/** 获取所有策略列表 */
export async function getStrategyList() {
  return request<BaseResponse<CertificateStrategy[]>>('/cert-strategy/list-all', { method: 'GET' });
}
