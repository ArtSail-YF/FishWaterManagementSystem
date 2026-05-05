import { request } from '@umijs/max';

export interface DiseaseDetection {
  label: string;
  confidence: number;
  confidencePercent: string;
  bbox: number[];
  riskLevel: string;
  suggestion: string;
}

export interface DiseaseDetectResult {
  recordNo: string;
  originalImageUrl: string;
  annotatedImageUrl: string;
  detected: boolean;
  topDisease: string;
  confidence: number;
  confidencePercent: string;
  riskLevel: string;
  suggestion: string;
  detections: DiseaseDetection[];
}

export async function detectDisease(file: File, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append('file', file);

  return request<{
    code: number;
    message: string;
    data: DiseaseDetectResult;
  }>('/ai/disease/detect', {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
}
