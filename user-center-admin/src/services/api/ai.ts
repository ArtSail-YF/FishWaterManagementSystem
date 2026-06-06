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

export interface AiChatSession {
  id: number;
  sessionNo: string;
  title: string;
  modelName?: string;
  messageCount: number;
  lastMessageAt?: string;
  createTime: string;
}

export interface AiChatSource {
  documentId: number;
  title: string;
  category: string;
  excerpt: string;
}

export interface AiToolCall {
  name: string;
  label: string;
  description: string;
}

export interface AiChatMessage {
  id: number;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  sources: AiChatSource[];
  tools: AiToolCall[];
  riskLevel: string;
  riskNotice?: string;
  createTime: string;
}

export interface AiChatReply {
  sessionId: number;
  answer: string;
  sources: AiChatSource[];
  tools: AiToolCall[];
  riskLevel: string;
  riskNotice?: string;
}

type ApiResponse<T> = { code: number; message: string; data: T };

export function createChatSession() {
  return request<ApiResponse<AiChatSession>>('/ai/chat/sessions', { method: 'POST' });
}

export function listChatSessions() {
  return request<ApiResponse<AiChatSession[]>>('/ai/chat/sessions', { method: 'GET' });
}

export function listChatMessages(sessionId: number) {
  return request<ApiResponse<AiChatMessage[]>>(`/ai/chat/sessions/${sessionId}/messages`, {
    method: 'GET',
  });
}

export function sendChatMessage(sessionId: number, message: string, tool?: string) {
  return request<ApiResponse<AiChatReply>>(`/ai/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    data: { message, tool },
  });
}

export function deleteChatSession(sessionId: number) {
  return request<ApiResponse<boolean>>(`/ai/chat/sessions/${sessionId}`, { method: 'DELETE' });
}
